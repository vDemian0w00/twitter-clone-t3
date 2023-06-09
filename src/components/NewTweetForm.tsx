import { useSession } from 'next-auth/react'
import { Button } from './Button'
import { ProfileImg } from './ProfileImg'
import { type FormEventHandler, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { api } from '@/utils/api'

import { toast } from 'react-hot-toast'

const updateDynamicallyTextAreaSize = (textArea?: HTMLTextAreaElement): void => {
  if (!textArea) return

  textArea.style.height = '0'
  textArea.style.height = `${textArea.scrollHeight}px`
}

const RawForm = ({ src }: { src: string | null | undefined }) => {
  const [tweetValue, setTweetValue] = useState('')

  const session = useSession()

  useLayoutEffect(() => {
    updateDynamicallyTextAreaSize(textAreaRef.current)
  }, [tweetValue])

  const textAreaRef = useRef<HTMLTextAreaElement>()
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateDynamicallyTextAreaSize(textArea)
    textAreaRef.current = textArea
  }, [])

  const ctx = api.useContext()

  const createTweet = api.tweetsRouter.create.useMutation({
    onSuccess: (newTweet) => {
      setTweetValue('')
      toast.success('Tweet created!')

      if (session.status !== 'authenticated') return
      const user = session.data?.user

      ctx.tweetsRouter.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (!oldData || !oldData.pages[0]) return

        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [
                {
                  ...newTweet,
                  likedByMe: false,
                  likesCount: 0,
                  user: {
                    id: user?.id,
                    image: user?.image ?? null,
                    name: user?.name ?? null,
                  },
                },
                ...oldData.pages[0].tweets,
              ],
            },
            ...oldData.pages.slice(1),
          ],
        }
      })
    },
    onError: (error) => {
      const zErr = error.data?.zodError?.fieldErrors.content
      toast.error(zErr ? zErr[0] ?? 'Something went wrong!' : 'Something went wrong!')
    },
  })

  const myHandleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault()

      if (!tweetValue || tweetValue.trim() === '') return

      createTweet.mutate({ content: tweetValue })
    },
    [tweetValue],
  )

  return (
    <form className='flex flex-col gap-2 border-b px-4 py-2' onSubmit={myHandleSubmit}>
      <div className='flex gap-4'>
        <ProfileImg src={src} />
        <textarea
          ref={inputRef}
          value={tweetValue}
          onChange={(e) => setTweetValue(e.target.value)}
          className='flex-grow resize-none overflow-hidden p-4 text-lg outline-none'
          placeholder="What's happening?"
        ></textarea>
      </div>
      <Button className='self-end'>Tweet</Button>
    </form>
  )
}

export const NewTweetForm = () => {
  const session = useSession()

  if (session.status !== 'authenticated') return null

  const user = session.data.user

  return <RawForm src={user?.image} />
}
