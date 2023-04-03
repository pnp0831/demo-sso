import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session = {}, status } = useSession();

  useEffect(() => {}, []);

  if (status === "authenticated") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        Signed in as{" "}
        <strong>{session?.user?.email || session?.user?.name}</strong>
        <div style={{ margin: "10px 0" }}>
          <button onClick={() => signOut({ redirect: false })}>Signout</button>
        </div>
        <div style={{ margin: "10px 0" }}>
          <button
            onClick={() => {
              window.open(process.env.NEXT_PUBLIC_LANDING_PAGE_URL, "_blank");
            }}
          >
            Go To Landing Page
          </button>
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Sign In</h1>

      <button
        style={{ margin: "10px 0" }}
        onClick={() => {
          signIn();
        }}
      >
        Sign In
      </button>
    </div>
  );
}
