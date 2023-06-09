import { useSession } from 'next-auth/react'
import { Button } from './Button'

type FollowButtonProps = {
  isFollowing: boolean
  userId: string
  onClick: () => void
}

export const FollowButton = ({ isFollowing, onClick, userId }: FollowButtonProps) => {
  const { status, data } = useSession()

  if (status !== 'authenticated' || data.user.id === userId) return null

  return (
    <Button
      gray={isFollowing}
      small
      onClick={onClick}
      className={`${
        isFollowing ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white'
      } rounded-full px-4 py-2 text-sm font-bold`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
