import { api } from '@/utils/api'
import { InfiniteTweetList } from './InfiniteTweetsList'
import { LoadingSpinnerOverlay } from './Spinner'
export const Feed = () => {
  const { data, isError, isLoading, hasNextPage, fetchNextPage } =
    api.tweetsRouter.infiniteFeed.useInfiniteQuery(
      {},
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
