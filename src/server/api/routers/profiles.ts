import { z } from 'zod'
import { createTRPCRouter, publicProcedure, protectedProcedure } from '@/server/api/trpc'
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

  toogleFollow: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input: { userId } }) => {
      const currentUserId = ctx.session.user.id

      if (currentUserId === userId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'You cannot follow yourself',
        })
      }

      const following = await ctx.prisma.user.findUnique({
        where: {
          id: currentUserId,
        },
        select: {
          following: {
            where: {
              id: userId,
            },
          },
        },
      })

      console.log({
        following,
      })
      let isFollowing: boolean

      if (following?.following.length) {
        isFollowing = false

        await ctx.prisma.user.update({
          where: {
            id: currentUserId,
          },
          data: {
            following: {
              disconnect: {
                id: userId,
              },
            },
          },
        })
      } else {
        isFollowing = true
        await ctx.prisma.user.update({
          where: {
            id: currentUserId,
          },
          data: {
            following: {
              connect: {
                id: userId,
              },
            },
          },
        })
      }

      return {
        isFollowing,
      }
    }),
})
