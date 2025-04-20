"use client"

import React from 'react'
import { useSession,signOut } from 'next-auth/react'
import Link from 'next/link'
import { User } from 'next-auth'
import { Button } from './ui/button'
function Navbar() {

    const { data: session } = useSession()
    const user: User = session?.user
    
    

  return (
      <nav className='w-[80vw] flex justify-between items-center bg-gray-900 my-2 text-white h-10  m-auto rounded-md shadow-2xl p-8'>
          <div className='text-2xl p-1'>
              <a className='no-underline font-bold cursor-pointer' href="#">Mistry Massage</a>
          </div>

          {
              session ? (<>
                  <p>Hello {user.username || user.email}</p>
                  <Button   onClick={()=> signOut()} variant={'destructive'}>LogOut</Button>
              </>) : (
                      <Link href="/login">
                          
                          <Button variant={'default'}>LogIn</Button>
                      
                      </Link>
              )
          }

     </nav>
  )
}

export default Navbar