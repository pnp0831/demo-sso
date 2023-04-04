import { NextApiResponse, NextApiRequest } from "next";
import { parseUserAgent } from "~/helpers";
import request from "~/helpers/axios";

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const deviceId = parseUserAgent(req.headers["user-agent"]).client?.name;

  await request.post(`${process.env.NEXT_PUBLIC_AUTH_URL}/api/auth/signout`, {
    userId: req.body.userId,
    deviceId,
  });

  res.setHeader("Set-Cookie", [`accessToken=; Max-Age=0`]);
  // Do whatever you want here, before the request is passed down to `NextAuth`
  res.status(200).send({ message: "ok" });
}
