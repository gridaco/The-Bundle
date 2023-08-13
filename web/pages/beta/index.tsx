import { CAMPAIGN_CBT_001 } from "@/k/campaigns";
import { CBTSignin } from "@/scaffolds/cbt";

export default function CBTGate() {
  return <CBTSignin />;
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
