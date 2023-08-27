import { User, createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";

export default function AuthTest() {
  const [user, setUser] = useState<User>();

  const supabase = createPagesBrowserClient();

  const onsignin = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/lsd/auth/callback`,
      },
    });
  };

  const pingServer = () => {
    //
  };

  useEffect(() => {
    // check if user is logged in
    supabase.auth
      .getUser()
      .then((response) => {
        if (!response.error) {
          setUser(response.data.user);
          // user is logged in
        }
      })
      .catch(console.error);
  }, [supabase.auth]);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <code>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </code>
      <button onClick={onsignin}>Sign in with Google</button>
      <button onClick={pingServer}>Authenticated server ping</button>
    </main>
  );
}
