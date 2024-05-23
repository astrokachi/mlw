import { prisma } from "../db/server";

export const createAccount = (req: Request, res: Response) => {
  const { accountName, accountNumber, bankName, swiftCode } = req.body;
  prisma.account
    .create({
      data: {
        accountName,
        accountNumber,
        bankName,
        swiftCode,
      },
    })
    .then((account) => {
      return res.json({
        success: true,
        message: "Account details saved successfully",
        data: account,
      });
    })
    .catch((error) => {
      res.json({
        success: false,
        message: "Operation failed",
        error,
      });
    });
};
