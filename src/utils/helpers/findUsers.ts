import { Client, Therapist } from "@prisma/client";
import { prisma } from "../../db/server";

export const findUser = async (email: string) => {
  let user: Client | Therapist | null;
  user = await prisma.client.findUnique({
    where: {
      email,
    },
  });

  if (user) {
    return { user, type: "client" };
  }

  if (!user) {
    user = await prisma.therapist.findUnique({
      where: {
        email,
      },
    });
  }

  console.log(user);

  return { user, type: "therapist" };
};
