import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc'
import { getInfiniteTweets } from '@/utils/Functions'

export const tweetsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { content } }) => {
      const userId = ctx.session.user.id

      const tweetCreated = await ctx.prisma.tweet.create({
        data: {
          content,
          userId,
        },
      })

      return tweetCreated
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tweet.findMany()
  }),

  infiniteProfileFeed: publicProcedure
    .input(
      z.object({
        id: z.string(),
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input: { id, limit = 10, cursor } }) => {
      const tweets = await getInfiniteTweets({
        whereClause: {
          userId: id,
        },
        limit,
        cursor,
        ctx,
      })

      let nextCursor: typeof cursor | null

      if (tweets && tweets.length > limit) {
        const nextItem = tweets.pop()
        if (nextItem) {
          nextCursor = {
            id: nextItem.id,
            createdAt: nextItem.createdAt,
          }
        }
      }

      return {
        tweets: tweets.map((tweet) => ({
          id: tweet.id,
          content: tweet.content,
          createdAt: tweet.createdAt,
          likesCount: tweet._count.likes,
          user: tweet.user,
          likedByMe: tweet.likes?.length > 0,
        })),
        nextCursor,
      }
    }),

  infiniteFeed: publicProcedure
    .input(
      z.object({
        onlyFollowing: z.boolean().optional().default(false),
        limit: z.number().optional(),
        cursor: z
          .object({
            id: z.string(),
            createdAt: z.date(),
          })
          .optional(),
      }),
    )
    .query(async ({ ctx, input: { limit = 10, cursor, onlyFollowing } }) => {
      const userId = ctx.session?.user?.id

      console.log({
        userId,
      })

      const tweets = await getInfiniteTweets({
        whereClause: onlyFollowing
          ? {
              user: {
                followers: {
                  some: {
                    id: userId,
                  },
                },
              },
            }
          : undefined,
        limit,
        cursor,
        ctx,
        userId,
      })

      let nextCursor: typeof cursor | null

      console.log({
        tweets,
      })
      if (tweets && tweets.length > limit) {
        const nextItem = tweets.pop()
        if (nextItem) {
          nextCursor = {
            id: nextItem.id,
            createdAt: nextItem.createdAt,
          }
        }
      }

      return {
        tweets: tweets.map((tweet) => ({
          id: tweet.id,
          content: tweet.content,
          createdAt: tweet.createdAt,
          likesCount: tweet._count.likes,
          user: tweet.user,
          likedByMe: tweet.likes?.length > 0,
        })),
        nextCursor,
      }
    }),

  toogleLike: protectedProcedure
    .input(
      z.object({
        tweetId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input: { tweetId } }) => {
      const userId = ctx.session.user.id

      const findData = {
        tweetId,
        userId,
      }

      const existingLike = await ctx.prisma.like.findUnique({
        where: {
          userId_tweetId: findData,
        },
      })

      if (existingLike) {
        await ctx.prisma.like.delete({
          where: {
            userId_tweetId: findData,
          },
        })

        return {
          addedLike: false,
        }
      } else {
        await ctx.prisma.like.create({ data: findData })
        return { addedLike: true }
      }
    }),
})
