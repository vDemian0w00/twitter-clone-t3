import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc'
import { getInfiniteTweets } from '@/utils/Functions'
import { TRPCError } from '@trpc/server'

export const profilesRouter = createTRPCRouter({
  getProfileById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      const currentUser = ctx.session?.user.id

      const profile = await ctx.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          image: true,
          _count: {
            select: {
              followers: true,
              following: true,
              tweets: true,
            },
          },
          followers: currentUser
            ? {
                where: {
                  id: currentUser,
                },
              }
            : undefined,
        },
      })

      if (!profile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Profile not found',
        })
      }

      return {
        id: profile.id,
        name: profile.name,
        image: profile.image,
        followersCount: profile._count.followers,
        followingCount: profile._count.following,
        tweetsCount: profile._count.tweets,
        followedByMe: profile.followers?.length > 0,
      }
    }),
})
