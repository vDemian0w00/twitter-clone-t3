import { type Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { api } from '@/utils/api'
import '@/styles/globals.css'
import Head from 'next/head'
import { SideNav } from '../components/SideNav'
import { Toaster } from 'react-hot-toast'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <Head>
        <title>Twitter Clone</title>
        <meta name='description' content='Twitter Clone' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='container mx-auto flex items-start sm:pr-4'>
        <SideNav />
        <main className='min-h-screen flex-grow border-x'>
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
