import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useCallback } from 'react'
import { IconHoverEffect } from './IconHoverEffect'
import { VscAccount, VscArrowLeft, VscHome, VscSignIn, VscSignOut } from 'react-icons/vsc'
export const SideNav = () => {
  const { data } = useSession()

  const user = data?.user

  const handleLogOut = useCallback(() => {
    void signOut()
  }, [])
  const handleSignIn = useCallback(() => {
    void signIn()
  }, [])
  return (
    <nav className='sticky top-0 px-2 py-4'>
      <ul className='flex flex-col items-start gap-2 whitespace-nowrap'>
        <li>
          <Link href={'/'}>
            <IconHoverEffect>
              <span className='flex items-center gap-4'>
                <VscHome size={24} />
                <span className='hidden text-lg md:inline'>Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link href={`/profiles/${user.id}`}>
                <IconHoverEffect>
                  <span className='flex items-center gap-4'>
                    <VscAccount size={24} />
                    <span className='hidden text-lg md:inline'>Profile</span>
                  </span>
                </IconHoverEffect>
              </Link>
            </li>
            <li>
              <button onClick={handleLogOut}>
                <IconHoverEffect>
                  <span className='flex items-center gap-4'>
                    <VscSignOut size={24} className='fill-red-400' />
                    <span className='hidden text-lg text-red-400 md:inline'> Log Out</span>
                  </span>
                </IconHoverEffect>
              </button>
            </li>
          </>
        ) : (
          <li>
            <button onClick={handleSignIn}>
              <IconHoverEffect>
                <span className='flex items-center gap-4'>
                  <VscSignIn size={24} className='fill-green-600' />
                  <span className='hidden text-lg text-green-600 md:inline'> Log in</span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}
