"use client";
import React from "react";
import { Tabs } from "@radix-ui/themes";

function capitalizeFirstLetter(txt: string) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

export function LibraryTab({
  defaultValue,
  tabs,
  children,
}: React.PropsWithChildren<{
  defaultValue?: string;
  tabs: string[];
}>) {
  return (
    // @ts-ignore
    <Tabs.Root defaultValue={defaultValue}>
      {/* @ts-ignore */}
      <Tabs.List className="justify-center">
        {tabs.map((tab, i) => (
          // @ts-ignore
          <Tabs.Trigger key={i} value={tab}>
            {capitalizeFirstLetter(tab)}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {children}
    </Tabs.Root>
  );
  //
}

export function Trigger({
  children,
  value,
}: React.PropsWithChildren<{
  value?: string;
}>) {
  return <></>;
}

export function Content({
  children,
  value,
}: React.PropsWithChildren<{
  value?: string;
}>) {
  return (
    // @ts-ignore
    <Tabs.Content
      //
      value={value}
    >
      {children}
    </Tabs.Content>
  );
}
