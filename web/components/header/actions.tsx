'use client'

import React from 'react';
import Link from "next/link";
import { useUser } from '@/hooks/useUser';

export function Actions() {
  const user = useUser();

  const base = " rounded text-sm lg:text-base px-3 py-2 lg:px-3 font-medium "


  const _subscribe = (
    <button className={base + "bg-white text-black"}>
      <Link href="/library">
        Subscribe
      </Link>
    </button>
  )

  if (user) {
    return (
      <>
        {
          !user.isPro && <>{_subscribe}</>
        }
        <button className={base + "bg-black text-white"}>
          <Link href="/downloads">
            Downloads
          </Link>
        </button>
      </>
    )
  }

  return <>
    <button className={base + "bg-white text-black"}>
      <Link href="/pro">
        Subscribe
      </Link>
    </button>
    <button className={base + "bg-black text-white"}>
      <Link href="/signin">
        Sign In
      </Link>
    </button>
  </>
}
