import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";
import request from "~/helpers/axios";
import DeviceDetector from "device-detector-js";
import { SessionProvider } from "next-auth/react";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { parse } from "cookie";

function HomePage({ session }) {
  const nextAuthSession = useSession();
  console.log("nextAuthSession", nextAuthSession);
  console.log("session", session);

  const logout = async () => {
    const csrtToken = await getCsrfToken();

    deleteCookie("accessToken");

    console.log("logout", nextAuthSession);

    if (nextAuthSession?.status === "unauthenticated") {
      await request.post("/api/auth/logout", {
        csrtToken,
        userId: session?.user?.userId,
      });
      window.location.reload();
    } else {
      signOut();
    }
  };

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
        <button style={{ marginBottom: "10px" }} onClick={logout}>
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
        padding: "50px",
      }}
    >
      <h1 style={{ marginBottom: "50px" }}>Sign In</h1>

      <button style={{ margin: "10px 0" }} onClick={() => signIn()}>
        Login
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

  const cookies = parse(req.headers.cookie || "");

  const deviceId = parseUserAgent(req.headers["user-agent"]).client?.name;

  const { user } = await request.get(
    `${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/session`,
    {
      headers: {
        deviceId,
        accessToken: cookies["accessToken"] || "",
      },
    }
  );

  let session = null;

  const nextCookie =
    cookies["__Secure-next-auth.session-token"] ||
    cookies["next-auth.session-token"];

  console.log("server");

  if (user?.accessToken) {
    session = {
      user,
      expires: user.expired,
    };

    res.setHeader("Set-Cookie", [`accessToken=${user.accessToken}`]);
  } else {
    if (!user?.accessToken) {
      res.setHeader("Set-Cookie", [`accessToken=; Max-Age=0`]);
    }
  }

  return {
    props: {
      session,
    }, // will be passed to the page component as props
  };
}

export default function Home({ session }) {
  return (
    <SessionProvider>
      <HomePage session={session} />
    </SessionProvider>
  );
}
