import React, { useEffect, useState } from "react";
import { CAMPAIGN_CBT_001 } from "@/k/campaigns";
import { CBTSignin } from "@/scaffolds/cbt";

export default function CBTGate() {
  const [host, setHost] = useState<string>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.origin);
    }
  }, []);

  const redirect = `${host}/lsd/auth/callback`;
  return <CBTSignin redirect={redirect} />;
}

// supabase
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  // check if authenticated
  const supabase = createPagesServerClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return {
      props: {
        // credit,
      },
    };
  }

  // TODO:
  // if authenticated, check if user is in beta
  const cbt = session.user.user_metadata[CAMPAIGN_CBT_001];

  if (cbt) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        // credit,
      },
    };
  }
}
