'use client'

import React from 'react';
import Link from "next/link";
import { Button } from "@radix-ui/themes";
import { useUser } from '@/hooks/useUser';

export function Actions() {
  const user = useUser();


  const _subscribe = (
    <Button className="bg-white text-black rounded-md p-4 font-medium">
      <Link href="/library">
        Subscribe
      </Link>
    </Button>
  )

  if (user) {
    return (
      <div className="flex gap-4">
        {
          !user.isPro && <>{_subscribe}</>
        }
        <Button className="bg-black text-white rounded-md p-4 font-medium">
          <Link href="/downloads">
            Downloads
          </Link>
        </Button>
      </div>
    )
  }

  return <div className="flex gap-4">
    <Button className="bg-white text-black rounded-md p-4 font-medium">
      <Link href="/pro">
        Subscribe
      </Link>
    </Button>
    <Button className="bg-black text-white rounded-md p-4 font-medium">
      <Link href="/signin">
        Sign In
      </Link>
    </Button>
  </div>
}
