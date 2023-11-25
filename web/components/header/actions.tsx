'use client'

import React from 'react';
import Link from "next/link";
import { Button } from "@radix-ui/themes";
import { useUser } from '@/hooks/useUser';

export function Actions() {
  const user = useUser();

  const base = " rounded-md text-sm lg:text-base p-3 lg:p-4 font-medium "


  const _subscribe = (
    <Button className={base + "bg-white text-black"}>
      <Link href="/library">
        Subscribe
      </Link>
    </Button>
  )

  if (user) {
    return (
      <>
        {
          !user.isPro && <>{_subscribe}</>
        }
        <Button className={base + "bg-black text-white"}>
          <Link href="/downloads">
            Downloads
          </Link>
        </Button>
      </>
    )
  }

  return <>
    <Button className={base + "bg-white text-black"}>
      <Link href="/pro">
        Subscribe
      </Link>
    </Button>
    <Button className={base + "bg-black text-white"}>
      <Link href="/signin">
        Sign In
      </Link>
    </Button>
  </>
}
