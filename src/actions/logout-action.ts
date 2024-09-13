"use server";

import { cookies } from "next/headers";

export async function logoutAction() {
  cookies().delete("auth-token");
  return { success: true, message: "Logged out successfully" };
}
