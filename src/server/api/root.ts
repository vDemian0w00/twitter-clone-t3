import { tweetsRouter } from '@/server/api/routers/tweets'
import { createTRPCRouter } from '@/server/api/trpc'
import { profilesRouter } from './routers/profiles'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  tweetsRouter: tweetsRouter,
  profilesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
