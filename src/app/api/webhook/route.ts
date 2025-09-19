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
            instructions: existingAgent.instructions
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
           const instructions = `
      You are an AI assistant helping the user revisit a recently completed meeting.
      Below is a summary of the meeting, generated from the transcript:
      
      ${existingMeeting.summary}
      
      The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
      
      ${existingAgent.instructions}
      
      The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
      Always base your responses on the meeting summary above.
      
      You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
      
      If the summary does not contain enough information to answer a question, politely let the user know.
      
      Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
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
        model: 'gpt-3.5-turbo'
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
