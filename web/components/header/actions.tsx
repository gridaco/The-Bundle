'use client'

import React from 'react';
import Link from "next/link";
import { Button } from "@radix-ui/themes";


export function Actions() {

  return <div className="flex gap-4">
    <Button className="bg-white text-black rounded-md p-4 font-medium">
      <Link href="/library">
        Subscribe
      </Link>
    </Button>
    <Button className="bg-black text-white rounded-md p-4 font-medium">
      <Link href="/library">
        Sign In
      </Link>
    </Button>
  </div>
}