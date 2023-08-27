import React, { useEffect, useMemo, useState } from "react";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>LSD</title>
        <meta name="description" content="Acid Text Generator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* og image */}
        <meta property="og:title" content="LSD" />
        <meta property="og:description" content="Acid Text Generator" />
        <meta property="og:image" content="https://grida.co/lsd/og-image.gif" />
        <link rel="icon" href="/lsd/favicon.png" />
      </Head>
      <Editor />
    </>
  );
}

// supabase
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";
import { Editor } from "@/scaffolds/editor";
import { app_metadata_subscription_id } from "@/k/userkey";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // check if authenticated
  const supabase = createPagesServerClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user.app_metadata[app_metadata_subscription_id]) {
    return {
      redirect: {
        destination: "/beta",
        permanent: false,
      },
    };
  }

  return {
    props: {
      // credit,
    },
  };
}
