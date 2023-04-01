import { useSession, signIn, signOut, getCsrfToken } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session = {}, status } = useSession();

  // const session = {};
  // const status = "";

  const [formValue, setFormValue] = useState({});

  useEffect(() => {
    window.addEventListener("message", function (event) {
      // Kiểm tra xem thông điệp được gửi từ iframe cha
      // Xử lý thông điệp được gửi từ iframe cha
      // console.log(event.data);
    });
  }, []);

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
      {/* <div style={{ margin: "10px 0" }}>
        <label style={{ marginRight: "10px" }} for="username">
          Username:
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formValue.username}
          onChange={(e) =>
            setFormValue({ ...formValue, username: e.target.value })
          }
        />
      </div>
      <div style={{ margin: "10px 0" }}>
        <label style={{ marginRight: "10px" }} for="password">
          Password:
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formValue.password}
          onChange={(e) =>
            setFormValue({ ...formValue, password: e.target.value })
          }
        />
      </div> */}
      <button
        style={{ margin: "10px 0" }}
        onClick={() => {
          // window.location.href = `${process.env.NEXT_PUBLIC_AUTH_URL}/auth/signin?callbackUrl=${window.location.href}`;
          // signIn("credentials", {
          //   username: formValue.username,
          //   password: formValue.password,
          //   redirect: false,
          // });
          signIn();
        }}
      >
        Sign In
      </button>
    </div>
  );
}
