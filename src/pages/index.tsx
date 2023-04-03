import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";
import request from "~/helpers/axios";
import DeviceDetector from "device-detector-js";
import { SessionProvider } from "next-auth/react";
import { setCookie, deleteCookie, getCookie } from "cookies-next";

function HomePage() {
  const { data: session = {}, status } = useSession();

  console.log("session", session, status);

  if (session?.user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "50px",
        }}
      >
        <img
          style={{ marginBottom: "10px" }}
          src={session?.user?.image}
          alt={session?.user?.name}
        />
        <h2 style={{ marginBottom: "10px" }}>{session?.user?.name}</h2>
        <p style={{ marginBottom: "10px" }}>{session?.user?.email}</p>
        <button style={{ marginBottom: "10px" }} onClick={() => signOut()}>
          Logout
        </button>
        <button
          onClick={() => {
            window.open(process.env.NEXT_PUBLIC_LANDING_PAGE_URL, "_blank");
          }}
        >
          Go To Landing Page
        </button>
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

      <button
        onClick={() => {
          window.open(process.env.NEXT_PUBLIC_LANDING_PAGE_URL, "_blank");
        }}
      >
        Go To Landing Page
      </button>
    </div>
  );
}

const parseUserAgent = (userAgent) => {
  const deviceDetector = new DeviceDetector();

  const device = deviceDetector.parse(userAgent);

  return device;
};

export async function getServerSideProps(context) {
  const { req, res } = context;

  const cookie = getCookie("accessToken");

  const deviceId = parseUserAgent(req.headers["user-agent"]).client?.name;

  const { user } = await request.get(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/session`,
    {
      headers: {
        deviceId,
      },
    }
  );

  console.log("server side props", cookie);
  console.log("user", user);

  let session = null;
  if (user?.accessToken) {
    session = {
      user,
      expires: user.expired,
    };

    res.setHeader("Set-Cookie", [`accessToken=${user.accessToken}`]);
  } else {
    deleteCookie("accessToken");
  }

  return {
    props: {
      session,
    }, // will be passed to the page component as props
  };
}

export default function Home({ session }) {
  return (
    <SessionProvider session={session}>
      <HomePage />
    </SessionProvider>
  );
}
