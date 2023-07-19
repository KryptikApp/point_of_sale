// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CourierClient } from "@trycourier/courier";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  success: boolean;
  requestId?: string;
  msg?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const phoneNumber = req.body.phoneNumber;
    const name = req.body.name;
    const amount = req.body.amount;
    const courier = CourierClient({
      authorizationToken: process.env.COURIER_AUTH_TOKEN,
    });

    const { requestId } = await courier.send({
      message: {
        to: {
          phone_number: phoneNumber,
        },
        template: "N3G4A5ZMC8M8CRKT4PR41PWRYGZC",
        data: {
          amount: amount,
          currencyName: "ckBTC",
          recipientName: name,
        },
      },
    });
    res.status(200).json({ success: true, requestId: requestId });
  } catch (e: any) {
    res.status(500).json({ success: false, msg: e.message });
  }
}
