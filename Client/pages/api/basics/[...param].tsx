import type { NextApiRequest, NextApiResponse } from "next";
import _categories from "../../../data/categories";
import _partners from "../../../data/partners";

export default (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "GET") {
        const { param } = req.query;
        const paramStr = param[0];

        if (paramStr === "categories") res.status(200).json(_categories);
        else if (paramStr === "partners") res.status(200).json(_partners);
        else res.status(404).end("Not found");
    } else res.status(405).end("Method not allowed");
};
