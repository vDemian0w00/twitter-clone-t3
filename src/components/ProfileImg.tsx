import Image from 'next/image'
import { VscAccount } from 'react-icons/vsc'

type ProfileImgProps = {
  src?: string | null
  className?: string
}

export const ProfileImg = ({ className, src }: ProfileImgProps) => {
  return (
    <div className={`relative h-12 w-12 overflow-hidden rounded-full ${className ?? ''}`}>
      {src ? (
        <Image src={src} alt='Profile Image' quality={100} fill />
      ) : (
        <VscAccount className='h-full w-full' />
      )}
    </div>
  )
}
