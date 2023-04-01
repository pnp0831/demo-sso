import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { user, error, isLoading } = useUser();

  console.log({ user, error, isLoading });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user)
    return (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <button onClick={() => router.push("/api/auth/logout")}>Logout</button>
      </div>
    );

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

      <button onClick={() => router.push("/api/auth/login")}>Login</button>
    </div>
  );
}
