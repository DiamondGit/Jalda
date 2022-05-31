import type { NextApiRequest, NextApiResponse } from "next";
import { _contacts, _socials } from "../../../data/infos";

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const { param } = req.query;
        const paramStr = param[0];

        if (paramStr === "contacts") res.status(200).json(_contacts);
        else if (paramStr === "socials") res.status(200).json(_socials);
        else res.status(404).end("Not found");
    } else res.status(405).end("Method not allowed");
};
