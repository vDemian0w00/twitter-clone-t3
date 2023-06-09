import { appRouter } from '@/server/api/root'
import { createServerSideHelpers } from '@trpc/react-query/server'
import SuperJSON from 'superjson'
import { createInnerTRPCContext } from './trpc'

export const ssgHelper = () => {
  return createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: null,
    }),
    transformer: SuperJSON,
  })
}
