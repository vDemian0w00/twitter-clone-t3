import { type createTRPCContext } from '@/server/api/trpc'
import { type Prisma } from '@prisma/client'
import { type inferAsyncReturnType } from '@trpc/server'

export async function getInfiniteTweets({
  whereClause,
  userId,
  limit,
  cursor,
  ctx,
}: {
  whereClause?: Prisma.TweetWhereInput
  limit: number
  cursor:
    | {
        id: string
        createdAt: Date
      }
    | undefined
  ctx: inferAsyncReturnType<typeof createTRPCContext>
  userId?: string
}) {
  const tweets = await ctx.prisma.tweet.findMany({
    take: limit + 1,
    cursor: cursor
      ? {
          createdAt_id: cursor,
        }
      : undefined,
    where: whereClause,
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        id: 'desc',
      },
    ],
    select: {
      id: true,
      content: true,
      createdAt: true,
      _count: {
        select: {
          likes: true,
        },
      },
      likes: !userId
        ? false
        : {
            where: {
              userId,
            },
          },
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  })

  console.log(tweets.map((tweet) => tweet.likes))

  return tweets
}
