import { FollowButton } from '@/components/FollowButton'
import { IconHoverEffect } from '@/components/IconHoverEffect'
import { InfiniteTweetList } from '@/components/InfiniteTweetsList'
import { ProfileImg } from '@/components/ProfileImg'
import { LoadingSpinnerOverlay } from '@/components/Spinner'
import { ssgHelper } from '@/server/api/ssgHelper'
import { api } from '@/utils/api'
import type { GetStaticPropsContext, InferGetStaticPropsType, NextPage } from 'next'
import ErrorPage from 'next/error'
import Head from 'next/head'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { VscArrowLeft } from 'react-icons/vsc'

const ProfilePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  _props: InferGetStaticPropsType<typeof getStaticProps>,
) => {
  const { data: profile } = api.profilesRouter.getProfileById.useQuery({
    id: _props.id,
  })

  const { data, isLoading, isError, hasNextPage, fetchNextPage } =
    api.tweetsRouter.infiniteProfileFeed.useInfiniteQuery(
      {
        id: _props.id,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    )

  const ctx = api.useContext()

  const { mutate } = api.profilesRouter.toogleFollow.useMutation({
    onSuccess: ({ isFollowing }) => {
      toast.success('Following!')

      if (!profile) return

      ctx.profilesRouter.getProfileById.setData({ id: profile?.id }, (oldData) => {
        if (!oldData) return oldData
        return {
          ...oldData,
          followersCount: oldData.followersCount + (isFollowing ? 1 : -1),
          followedByMe: isFollowing,
        }
      })
    },
    onError: (err) => {
      const zErr = err.data?.zodError?.fieldErrors.userId
      const zMessage = zErr ? zErr[0] ?? 'Try again later' : 'Try again later'

      toast.error(`Error! ${zMessage}`)
    },
  })

  if (!data?.pages) return <LoadingSpinnerOverlay />

  if (!profile || !profile.name) return <ErrorPage statusCode={404} />

  const handleFollow = () => {
    mutate({
      userId: profile.id,
    })
  }

  return (
    <>
      <Head>
        <title>{`Twitter clone ${profile?.name}`}</title>
      </Head>
      <header className='sticky top-0 z-10 flex items-center border-b bg-white px-4 py-2'>
        <Link href={`..`}>
          <IconHoverEffect>
            <VscArrowLeft size={24} />
          </IconHoverEffect>
        </Link>
        <ProfileImg src={profile.image} className='flex-shrink-0' />
        <div className='ml-2 flex-grow'>
          <h1 className='text-lg font-bold'>{profile.name}</h1>
          <div className='text-gray-500'>
            {profile.tweetsCount} tweets - {profile.followersCount} followers -{' '}
            {profile.followingCount} following -{' '}
          </div>
        </div>
        <FollowButton
          isFollowing={profile.followedByMe}
          onClick={handleFollow}
          userId={profile.id}
        />
      </header>
      <main>
        <InfiniteTweetList
          tweets={data?.pages.flatMap((page) => page.tweets)}
          isError={isError}
          isLoading={isLoading}
          hasMore={hasNextPage}
          loadMore={fetchNextPage}
        />
      </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export async function getStaticProps(context: GetStaticPropsContext<{ id: string }>) {
  const id = context.params?.id

  if (!id) {
    return {
      redirect: {
        destination: '/',
      },
    }
  }

  const ssg = ssgHelper()

  await ssg.profilesRouter.getProfileById.prefetch({
    id,
  })

  return {
    props: {
      id,
      trpcState: ssg.dehydrate(),
    },
  }
}

export default ProfilePage
