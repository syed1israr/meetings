import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { meetingInsertSchema, meetingUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";
import { streamVideo } from "@/lib/stream_video";
import { GenerateAvatarUri } from "@/lib/avatar";

export const meetingsRouter = createTRPCRouter({






    getMany: protectedProcedure
  .input(z.object({
    page: z.number().default(DEFAULT_PAGE),
    pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
    search: z.string().nullish(),
    agentId : z.string().nullish(),
    status: z.enum([
      MeetingStatus.Upcoming,
      MeetingStatus.Active,
      MeetingStatus.Completed,
      MeetingStatus.Processing,
      MeetingStatus.Cancelled,
    ]).nullish(),
  }))
  .query(async ({ input, ctx }) => {
    const { search, page, pageSize, status, agentId } = input;
    
    const data = await db
      .select({...getTableColumns(meetings),
        agent : agents,
        duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))`.as("duration")
       })
      .from(meetings)
      .innerJoin(agents, eq(meetings.agentId,agents.id))
      .where(
        and(
          eq(meetings.userId , ctx.auth.user.id),
          search ? ilike(meetings.name,`%${search}%`) : undefined,
          status ? eq(meetings.status,status) : undefined,
          agentId ? eq(meetings.agentId,agentId) : undefined,
        )
      )
      .orderBy(desc(meetings.createdAt),desc(meetings.id))
      .limit(pageSize)
      .offset( (page - 1) * pageSize)

      const [total] = await db.select({count : count()}).from(meetings).innerJoin(agents, eq(meetings.agentId,agents.id)).where(and(
          eq(meetings.userId , ctx.auth.user.id),
          status ? eq(meetings.status,status) : undefined,
          agentId ? eq(meetings.agentId,agentId) : undefined,
          search ? ilike(meetings.name,`%${search}%`) : undefined,
        ))

    
      const total_pages = Math.ceil(Number(total.count) / pageSize);

        return {
        items: data,
        total: Number(total.count),
        total_pages,
      };
  }),


    
  
  getOne: protectedProcedure.
    input(z.object({ id : z.string()}))
    .query(async ({input,ctx}) => {

    const [existingMeeting] = await db.
    select({...getTableColumns(meetings),
      agent : agents,
      duration: sql<number>`EXTRACT(EPOCH FROM (${meetings.endedAt} - ${meetings.startedAt}))`.as("duration")

    }).
    from(meetings)
    .innerJoin(agents,eq(meetings.agentId,agents.id))
    .where(and(
      eq(meetings.id, input.id),
      eq(meetings.userId, ctx.auth.user.id)
      
    ));
    if( !existingMeeting ) throw new TRPCError({ code : "NOT_FOUND", message:"Meeting Not Found"})

    return existingMeeting;
  }),

    create: protectedProcedure
      .input(meetingInsertSchema)
      .mutation(async ({ input, ctx }) => {
  
        const [createdmeeting] = await db.insert(meetings).values({
          ...input,
          userId: ctx.auth.user.id,
        }).returning();
        
        const call = streamVideo.video.call("default",createdmeeting.id);
        await call.create({
          data :{
            created_by_id : ctx.auth.user.id,
            custom : {
              meetingId : createdmeeting.id,
              meetingName : createdmeeting.name
            },
            settings_override :{
              transcription:{
                language:"en",
                mode :"auto-on",
                closed_caption_mode:"auto-on"
              },
              recording:{
                mode:"auto-on",
                quality:"1080p",
              },  
            },
          }
        
        });

         const [ exisitingAgent ] = await db.select().from(agents).where(eq(agents.id,createdmeeting.agentId));
        if( !exisitingAgent ) throw new TRPCError({ code : "NOT_FOUND", message:"Agent Not Found"})

        await streamVideo.upsertUsers([
          {
            id : exisitingAgent.id,
            name : exisitingAgent.name,
            role : "user",
            image: GenerateAvatarUri({seed:exisitingAgent.name, variant:"botttsNeutral"})
          }
        ])


        return createdmeeting;
      }),


      update : protectedProcedure
        .input(meetingUpdateSchema)
        .mutation(async ({ ctx, input }) => {
          const { id, ...updateData } = input;
          const [UpdatedMeeting] = await db
            .update(meetings)
            .set(updateData)
            .where(
              and(
                eq(meetings.id, id),
                eq(meetings.userId, ctx.auth.user.id)
              )
            )
            .returning();
          if (!UpdatedMeeting) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Meeting Not found",
            });
          }
          return UpdatedMeeting;
        }),

        remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
          const { id } = input;
          const [Removed_Meeting] = await db
            .delete(meetings)
            .where(
              and(
                eq(meetings.id, id),
                eq(meetings.userId, ctx.auth.user.id)
              )
            )
            .returning();
          if (!Removed_Meeting) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Meeting Not found",
            });
          }
          return Removed_Meeting;
        }),

        generateToken : protectedProcedure.mutation( async({ ctx }) => {
            await streamVideo.upsertUsers([
            {
              id : ctx.auth.user.id,
              name : ctx.auth.user.name,
              role : "admin",
              image : ctx.auth.user.image ?? GenerateAvatarUri({ seed : ctx.auth.user.name, variant : "initials"})
            }
          ])

          const expirationTime = Math.floor(Date.now()/1000)+3600;
          const issuedAt = Math.floor(Date.now()/1000) - 60 ;
          const token = streamVideo.generateUserToken({
            user_id : ctx.auth.user.id,
            exp:expirationTime,
            validity_in_seconds:issuedAt
          })
          return token;
        })
    
})