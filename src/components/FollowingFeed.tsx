import { api } from '@/utils/api'
import { InfiniteTweetList } from './InfiniteTweetsList'
import { LoadingSpinnerOverlay } from './Spinner'
export const FollowingFeed = () => {
  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    api.tweetsRouter.infiniteFeed.useInfiniteQuery(
      { onlyFollowing: true },
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    )

  if (!data) return <LoadingSpinnerOverlay />

  return (
    <InfiniteTweetList
      tweets={data.pages.flatMap((page) => page.tweets)}
      isError={isError}
      isLoading={isLoading}
      hasMore={hasNextPage}
      loadMore={fetchNextPage}
    />
  )
}
