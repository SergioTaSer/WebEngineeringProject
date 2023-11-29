'use client';

import { ReactNode } from 'react';
import { navbarButtonClasses } from '@/components/NavbarButton';
import Link from 'next/link';
import { NextAuthProvider } from '@/providers/NextAuthProvider';
import { signOut } from "next-auth/react"





interface NavbarSignOutButtonProps {
  children: ReactNode;
}

export default function NavbarSignOutButton({ children }: NavbarSignOutButtonProps) {

    return(
    <Link href={'/'} className={`relative inline-flex ${navbarButtonClasses}`}>
      {children}
    </Link>
    );
    
}