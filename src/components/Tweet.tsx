import { formatRelativeTime } from '@/utils/Dates'
import type { TweetType } from './InfiniteTweetsList'
import { ProfileImg } from './ProfileImg'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { VscHeart, VscHeartFilled } from 'react-icons/vsc'
import { IconHoverEffect } from './IconHoverEffect'
import { api } from '@/utils/api'
import { toast } from 'react-hot-toast'
import { useCallback } from 'react'
import { LoadingSpinnerOverlay, Spinner } from './Spinner'

export const Tweet = ({ tweet }: { tweet: TweetType }) => {
  const ctx = api.useContext()

  const mutateLike = api.tweetsRouter.toogleLike.useMutation({
    onError: (err) => {
      const zErr = err.data?.zodError?.fieldErrors.content
        ? err.data.zodError.fieldErrors.content[0]
        : null
      toast.error(zErr ?? 'Something went wrong!')
    },
    onSuccess: ({ addedLike }) => {
      toast.success('Tweet liked!')

      const updateData: Parameters<typeof ctx.tweetsRouter.infiniteFeed.setInfiniteData>[1] = (
        oldData,
      ) => {
        if (!oldData) return

        const moreOrLess = addedLike ? 1 : -1

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            tweets: page.tweets.map((t) =>
              t.id === tweet.id
                ? { ...t, likedByMe: !t.likedByMe, likesCount: t.likesCount + moreOrLess }
                : t,
            ),
          })),
        }
      }

      void ctx.tweetsRouter.infiniteFeed.setInfiniteData({}, updateData)
      void ctx.tweetsRouter.infiniteFeed.setInfiniteData({ onlyFollowing: true }, updateData)
      void ctx.tweetsRouter.infiniteProfileFeed.setInfiniteData(
        {
          id: tweet.user.id,
        },
        updateData,
      )
    },
  })

  const onLike = useCallback(() => {
    mutateLike.mutate({ tweetId: tweet.id })
  }, [])

  console.log({
    tweet,
  })

  return (
    <>
      <div className='flex gap-4 border-b px-4 py-3'>
        <Link href={`/profiles/${tweet.user.id}`} className='flex-shrink-0'>
          <ProfileImg src={tweet.user.image} />
        </Link>
        <div className='flex flex-grow flex-col'>
          <div className='flex items-center gap-2'>
            <Link href={`/profiles/${tweet.user.id}`} className='flex-shrink-0'>
              <span className='font-bold'>{tweet.user.name}</span>
            </Link>
            <span className='text-gray-500'>{formatRelativeTime(tweet.createdAt)}</span>
          </div>
          <div className='flex flex-col'>
            <p className='whitespace-pre-wrap text-lg'>{tweet.content}</p>
          </div>
          <HeartButton
            likedByMe={tweet.likedByMe}
            likesCount={tweet.likesCount}
            onClick={onLike}
            isLoading={mutateLike.isLoading}
          />
        </div>
      </div>
    </>
  )
}

type HeartButtonProps = {
  likedByMe: boolean
  likesCount: number
  onClick: () => void
  isLoading: boolean
}

const HeartButton = ({ likedByMe, likesCount, onClick, isLoading }: HeartButtonProps) => {
  const { status } = useSession()

  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart

  if (status !== 'authenticated')
    return (
      <div className='my-1 flex items-center gap-3 self-start text-gray-500'>
        <HeartIcon />
        <span>{likesCount}</span>
      </div>
    )

  return (
    <button
      className={`group -ml-2 flex items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe ? 'text-red-400' : 'text-gray-500 hover:text-red-400'
      } group-focus-visible:text-red-400`}
      onClick={onClick}
      disabled={isLoading}
    >
      <IconHoverEffect red>
        <HeartIcon
          className={` transition-colors duration-200 ${
            likedByMe ? 'fill-red-400' : 'fill-gray-500 hover:fill-red-400'
          } group-focus-visible:fill-red-400`}
        />
      </IconHoverEffect>
      <span>{!isLoading ? likesCount : <Spinner size={2} />}</span>
    </button>
  )
}
