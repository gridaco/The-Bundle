"use client";
import React from "react";
import { Tabs } from "@radix-ui/themes";
import Link from "next/link";

function capitalizeFirstLetter(txt: string) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}

type TabData =
  | string
  | {
      label?: string;
      value: string;
      href?: string;
    };

export function LibraryTab({
  defaultValue,
  tabs,
  children,
}: React.PropsWithChildren<{
  defaultValue?: string;
  tabs: TabData[];
}>) {
  return (
    // @ts-ignore
    <Tabs.Root defaultValue={defaultValue}>
      {/* @ts-ignore */}
      <Tabs.List className="justify-center">
        {tabs.map((tab, i) => {
          const label = capitalizeFirstLetter(
            typeof tab === "string" ? tab : tab.label || tab.value
          );
          const value = typeof tab === "string" ? tab : tab.value;
          return (
            // @ts-ignore
            <Tabs.Trigger key={i} value={value}>
              {typeof tab === "object" && !!tab.href ? (
                <Link href={tab.href}>{label}</Link>
              ) : (
                <>{label}</>
              )}
            </Tabs.Trigger>
          );
        })}
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
