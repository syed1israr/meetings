import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { GenerateAvatarUri } from "@/lib/avatar";
import { streamChat } from "@/lib/stream-chat";
import { streamVideo } from "@/lib/stream_video";
import {
    CallEndedEvent,
    CallRecordingReadyEvent,
    CallSessionParticipantLeftEvent,
    CallSessionStartedEvent,
    CallTranscriptionReadyEvent,
    MessageNewEvent,
} from "@stream-io/node-sdk";

import { and, eq, not } from "drizzle-orm";

import { NextRequest, NextResponse } from "next/server";


import OpenAI from "openai";

import { ChatCompletionMessageParam } from "openai/resources/index.mjs";


function verifySignature(body : string, signature : string ) : boolean{
    return streamVideo.verifyWebhook(body,signature)
}

const openaiClient = new OpenAI({
    apiKey : process.env.NEXT_OPEN_API_KEY!
});


export async function POST(req:NextRequest){
    const signature = req.headers.get("x-signature");
    const apiKey = req.headers.get("x-api-key");
    if( !signature || !apiKey ){
        return NextResponse.json(
            { error : "Missing Signature or API key"},
            { status : 400}
        )
    }
    const body = await req.text();

    if( !verifySignature(body,signature)){
        return NextResponse.json({ error : "Invalid Signature"},{status : 401});
    }
    
    let payload : unknown;
    try{
        payload = JSON.parse(body) as Record<string,unknown>;
    }catch{
        return NextResponse.json({error : "Invalid JSON"}, { status : 400 });
    }

    const eventType = ( payload  as Record<string,unknown>)?.type;

    if( eventType === "call.session_started"){
        const event = payload as CallSessionStartedEvent;
        const meetindId = event.call.custom?.meetingId;
        if( !meetindId ){
            return NextResponse.json({error : "Missing MeetingId"}, { status : 400 });
        }
        const [ existingMeeting ] = await db
        .select()
        .from(meetings)
        .where(
            and(
                eq(meetings.id,meetindId),
                not(eq(meetings.status,"completed")),
                not(eq(meetings.status,"active")),
                not(eq(meetings.status,"cancelled")),
            )
        );
           if( !existingMeeting ){
            return NextResponse.json({error : "Missing Meeting"}, { status : 404 });
        }

        await db.update(meetings).set({
            status : "active",
            startedAt : new Date(),
        })
        .where(eq(meetings.id, existingMeeting.id));

        const [ existingAgent ] = await db
        .select()
        .from(agents)
        .where(eq(agents.id,existingMeeting.agentId));
        if( !existingAgent ){
                return NextResponse.json({error : "Missing Agent"}, { status : 404 });
        }
        const call = streamVideo.video.call("default", meetindId);
        let realTimeClient;
      try {
           realTimeClient = await streamVideo.video.connectOpenAi({
              call,
              openAiApiKey : process.env.NEXT_OPEN_API_KEY!,
              agentUserId : existingAgent.id
          })
         await realTimeClient.updateSession({
            instructions: `
You are an expert strictly limited to the user's configured topic and role below. Your highest priority is to stay within scope at all times.
TOPIC (SOURCE OF TRUTH):
${existingAgent.instructions}
ROLE: ${existingAgent.name}
STRICT POLICY:
1) Before answering, quickly check: Is the user's request strictly within the topic/role or current meeting context?
2) If in-scope: answer concisely with practical, step-by-step guidance as a seasoned expert.
3) If out-of-scope or uncertain: DO NOT ANSWER. Instead respond exactly with a brief refusal and redirection:
   "I’m focused on ${existingAgent.name}'s scope. Could you rephrase within that topic?"
   Optionally add one example of an in-scope area.
4) If information is insufficient, ask a targeted clarifying question.
5) Be concise and factual. Avoid speculation, trivia, or generic filler.
`,
        
        });
      } catch (error) {
        return NextResponse.json({ error: "OpenAI connection failed", details: String(error) }, { status: 500 });
      }
    }else if( eventType === "call.session_participant_left"){
        const event = payload as CallSessionParticipantLeftEvent;
        const meetindId = event.call_cid.split(":")[1];
         if( !meetindId ){
                return NextResponse.json({error : "Missing meetindId from second event Type"}, { status : 404 });
        }
        const call = streamVideo.video.call("default",meetindId);
        await call.end();
    }else if( eventType === "call.session_ended" ){
        const event  = payload as CallEndedEvent;
        const meetingId = event.call.custom?.meetingId;
         if( !meetingId ){
                return NextResponse.json({error : "Missing meetindId from second event Type"}, { status : 404 });
        }
        await db
        .update(meetings)
        .set({
            status:"processing",
            endedAt: new Date(),
        })
        .where(and(eq(meetings.id,meetingId),eq(meetings.status,'active')))
    }else if( eventType === "call.transcription_ready"){
        const event = payload as CallTranscriptionReadyEvent;
        const meetingId = event.call_cid.split(":")[1];
        const [ updatedMeeting ] = await db
        .update(meetings)
        .set({
            transcriptUrl: event.call_transcription.url,
        })
        .where(eq(meetings.id,meetingId))
        .returning();

         if( !updatedMeeting ){
                return NextResponse.json({error : "Failed to Update Meetings"}, { status : 404 });
        }
        await inngest.send({
            name : "meetings/processing",
            data : {
                meetingId : updatedMeeting.id,
                transcriptUrl : updatedMeeting.transcriptUrl,
            },
        })
    }else if( eventType === "call.recording_ready" ){
        const event = payload as CallRecordingReadyEvent;
        const meetingId = event.call_cid.split(":")[1];
        await db
        .update(meetings)
        .set({
            recordingUrl: event.call_recording.url,
        })
        .where(eq(meetings.id,meetingId))
    }else if( eventType === "message.view"){
        const event = payload as MessageNewEvent;
        const userId = event.user?.id;
        const channelId = event.channel_id;
        const text = event.message?.text;
        if( !userId || !channelId || !text ){
            return NextResponse.json(
                { error : "Missing Required Fields"},
                { status : 400}
            )
        }
          const [ existingMeeting ] = await db
        .select()
        .from(meetings)
        .where(
            and(
                eq(meetings.id,channelId),
                eq(meetings.status,"completed"),
            )
        );
           if( !existingMeeting ){
            return NextResponse.json({error : "Missing Meeting"}, { status : 404 });
        }

        const [ existingAgent ] = await db
        .select()
        .from(agents)
        .where(eq(agents.id,existingMeeting.agentId));

        if( !existingAgent ){
                return NextResponse.json({error : "Missing Agent"}, { status : 404 });
        }

        if( userId !== existingAgent.id ){
          // Pre-filter: classify scope before any generation call
          const scopeCheckSystem = `You are a strict scope classifier. Return JSON only.
Fields:
- in_scope: boolean (true only if the user message is clearly about the meeting summary OR the agent topic/role)
- reason: short string
Rules:
- If uncertain, set in_scope to false.`.trim();

          const scopeCheckUser = `Agent Topic/Role:\n${existingAgent.instructions}\n\nMeeting Summary:\n${existingMeeting.summary}\n\nUser Message:\n${text}`;

          let isInScope = true;
          try{
            const scopeResp = await openaiClient.chat.completions.create({
              model: 'gpt-4o-mini',
              response_format: { type: 'json_object' },
              messages: [
                { role: 'system', content: scopeCheckSystem },
                { role: 'user', content: scopeCheckUser },
              ],
              temperature: 0,
              max_tokens: 100,
            });
            const raw = scopeResp.choices[0]?.message?.content || '{}';
            const parsed = JSON.parse(raw) as { in_scope?: boolean };
            isInScope = parsed.in_scope === true;
          }catch{
            // Fail-safe: refuse if classifier fails
            isInScope = false;
          }

          if( !isInScope ){
            const preChannel = streamChat.channel("messaging",channelId);
            await preChannel.watch();
            const avatarUrl = GenerateAvatarUri({
              seed : existingAgent.name,
              variant : "botttsNeutral",
            })
            await streamChat.upsertUser({
              id : existingAgent.id,
              name : existingAgent.name,
              image : avatarUrl
            })
            await preChannel.sendMessage({
              text : `I’m focused on ${existingAgent.name}'s scope and this meeting. Could you rephrase within that context?`,
              user : {
                  id : existingAgent.id,
                  name : existingAgent.name,
                  image : avatarUrl
              }
            })
            return NextResponse.json({ status : "ok" });
          }

           const instructions = `
You are an expert assistant restricted to the agent's configured topic/role.

MEETING SUMMARY (PRIMARY CONTEXT):
${existingMeeting.summary}

AGENT TOPIC & ROLE (SOURCE OF TRUTH):
${existingAgent.instructions}

STRICT SCOPE RULES:
- Only answer questions directly related to the meeting summary and the topic/role above.
- If the user asks something out-of-scope (unrelated to the meeting or the topic/role), refuse politely and redirect back to the topic. Example: "I’m focused on ${existingAgent.name}'s scope and this meeting. Could you rephrase within that context?"
- Ask targeted clarifying questions when needed; do not hallucinate or speculate.
- Provide concise, accurate, step-by-step expert guidance when applicable.

CONVERSATION USE:
- Use recent conversation history for coherence and continuity.
- If the summary or context is insufficient, say so and request the missing info.
`;

      const channel = streamChat.channel("messaging",channelId);
      await channel.watch();

      const prevMessage = channel.state.messages
      .slice(-5)
      .filter((msg)=>msg.text && msg.text.trim() !== "")
      .map<ChatCompletionMessageParam>((msg)=>({
        role : msg.user?.id === existingAgent.id ? "assistant" : "user",
        content : msg.text || ""
      }))

      const GPTResponse = await openaiClient.chat.completions.create({
        messages: [
            {role : "system", content : instructions},
            ...prevMessage,
            { role : "user", content : text},
        ],
        model: 'gpt-4o-mini',
        temperature: 0.3
      })

      const GPTresText = GPTResponse.choices[0].message.content;
      if( !GPTresText ){

    //     channel.sendMessage({
    //     text : " Please Check GPT API Key ",
    //     user : {
    //         id : existingAgent.id,
    //         name : existingAgent.name,
    //         image :  " "
    //     }
    //   })

        return NextResponse.json(
            { error : "No response from GPT"},
            { status : 404 }
        )
      }

      const avatarUrl = GenerateAvatarUri({
        seed : existingAgent.name,
        variant : "botttsNeutral",
      })
      
      streamChat.upsertUser({
        id : existingAgent.id,
        name : existingAgent.name,
        image : avatarUrl
      })

      channel.sendMessage({
        text : GPTresText,
        user : {
            id : existingAgent.id,
            name : existingAgent.name,
            image : avatarUrl
        }
      })
     }
    }
     return NextResponse.json({status : "ok"})
}
