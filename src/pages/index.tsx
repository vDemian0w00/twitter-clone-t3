import type { NextPage } from 'next'
import { NewTweetForm } from '@/components/NewTweetForm'
import { Feed } from '../components/Feed'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { FollowingFeed } from '../components/FollowingFeed'

const TABS = ['Recent', 'Followers'] as const

const Home: NextPage = (_props) => {
  const { data, status } = useSession()

  const [selectedMode, setSelectedMode] = useState<(typeof TABS)[number]>(TABS[0])

  return (
    <>
      <header className='sticky top-0 z-10 border-b bg-white pt-2 '>
        <h1 className='mb-2 px-4 text-lg font-bold'>Home</h1>
        {status === 'authenticated' ? (
          <div className='flex'>
            {TABS.map((tab) => {
              return (
                <button
                  key={tab}
                  className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 ${
                    tab === selectedMode ? 'border-b-4 border-b-blue-500 font-bold' : ''
                  }`}
                  onClick={() => setSelectedMode(tab)}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        ) : null}
      </header>
      <NewTweetForm />
      {selectedMode === 'Recent' ? <Feed /> : <FollowingFeed />}
    </>
  )
}

export default Home
