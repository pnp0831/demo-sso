import { setToken } from "~/helpers/axios";
import { serialize } from "cookie";
import config from "~/constants/config";

export default function handler(req, res) {
  console.log("trigeer", req.method, req.headers.token);
  if (req.method === "POST") {
    console.log("trigger", req.body);
    setToken(req.body.token);
    const serializedCookie = serialize(
      "accessToken",
      req.body.token,
      config.cookieConfig
    );
    res.setHeader("Set-Cookie", serializedCookie);
  }

  res.status(200).json({ status: "ok" });
}
