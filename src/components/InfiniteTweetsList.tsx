import InfiniteScroll from 'react-infinite-scroll-component'
import type { RouterOutputs } from '../utils/api'
import { Button } from './Button'
import { LoadingSpinnerOverlay, Spinner } from './Spinner'
import { Tweet } from './Tweet'

export type TweetType = RouterOutputs['tweetsRouter']['infiniteFeed']['tweets'][number]

type InfiniteTweetListProps = {
  tweets: TweetType[]
  isError: boolean
  isLoading: boolean
  hasMore: boolean | undefined
  loadMore: () => Promise<unknown>
}

export const InfiniteTweetList = ({
  tweets,
  hasMore,
  isError,
  isLoading,
  loadMore,
}: InfiniteTweetListProps) => {
  if (isLoading) return <LoadingSpinnerOverlay />

  if (isError)
    return <div className='my-4 text-center text-2xl text-gray-500 '>Something went wrong!</div>

  if (tweets.length === 0)
    return <div className='my-4 text-center text-2xl text-gray-500 '>No tweets found!</div>

  return (
    <>
      <InfiniteScroll
        dataLength={tweets.length}
        next={loadMore}
        hasMore={Boolean(hasMore)}
        loader={<LoadingSpinnerOverlay />}
      >
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} tweet={tweet} />
        ))}
      </InfiniteScroll>
    </>
  )
}
