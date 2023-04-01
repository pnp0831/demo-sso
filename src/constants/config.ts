interface Config {
  baseUrl: string;
  timeout: number;
  limit: number;
  cookieConfig: any;
}

const config: Config = {
  baseUrl: "https://641031d1864814e5b649fc8e.mockapi.io/api",
  timeout: 10000,
  limit: 8,
  cookieConfig: {
    path: "/",
    // domain:
    //   process.env.NODE_ENV === "development"
    //     ? "localhost"
    //     : process.env.NEXT_PUBLIC_AUTH_URL || ".vercel.app",
    httpOnly: false,
  },
};

export default config;
