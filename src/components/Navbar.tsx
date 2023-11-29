import {
    ArrowRightOnRectangleIcon,
    ShoppingCartIcon,
    UserIcon,
  } from '@heroicons/react/24/outline';
  import NavbarCartButton from '@/components/NavbarCartButton';
  import NavbarButton from '@/components/NavbarButton';

  import { authOptions } from '@/lib/authOptions';
  import { getServerSession } from 'next-auth/next';
  import Link from 'next/link';
  import { Session } from 'next-auth';
  
  export default async function Navbar() {
    const session: Session | null = await getServerSession(authOptions);
  
    return (
      <nav className='fixed top-0 z-50 w-full bg-violet-950 bg-opacity-90 backdrop-blur-lg backdrop-filter'>
        <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10'>
          <div className='relative flex h-16 items-center justify-between'>
            <div className='flex flex-1 items-stretch justify-start'>
              <Link
                className='flex flex-shrink-0 items-center space-x-4 text-gray-300 hover:text-gray-100'
                href='/'
              >
                <img
                  className='block h-8 w-auto'
                  src='/img/logo.svg'
                  alt='FilmShop logo'
                />
                <div className='inline-block w-auto text-xl font-semibold'>
                  FilmShop
                </div>
              </Link>
            </div>
            <div className='absolute inset-y-0 right-0 flex items-center space-x-4'>
              {session ? (
                <>
                  <NavbarCartButton>
                    <span className='sr-only'>Cart</span>
                    <ShoppingCartIcon className='h-6 w-6' aria-hidden='true' />
                  </NavbarCartButton>
                  <NavbarButton href='/profile'>
                    <span className='sr-only'>User profile</span>
                    <UserIcon className='h-6 w-6' aria-hidden='true' />
                  </NavbarButton>
                  <NavbarButton href='/api/auth/signout'>
                    <span className='sr-only'>Sign out</span>
                    <ArrowRightOnRectangleIcon
                      className='h-6 w-6'
                      aria-hidden='true'
                    />
                  </NavbarButton>
                </>
              ) : (
                <>
                  <Link
                    href='/api/auth/signup'
                    className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                  >
                    Sign up
                  </Link>
                  <Link
                    href='/api/auth/signin'
                    className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    );
  }