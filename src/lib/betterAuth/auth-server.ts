"use server";

import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect, unauthorized } from "next/navigation";

export const getSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
};

export const getAuthenticatedSessionAndRedirect = async () => {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  return session;
};

export const getAuthenticatedUser = async () => {
  const session = await getSession();

  if (!session) {
    unauthorized();
  }

  return session;
};
