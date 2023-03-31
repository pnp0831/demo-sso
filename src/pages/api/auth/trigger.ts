import { setToken } from "~/helpers/axios";

export default function handler(req, res) {
  if (req.method === "POST") {
    setToken(req.body.token);
  }

  res.status(200).json({ status: "ok" });
}
