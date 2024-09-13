// app/actions/login-action.ts
"use server";

import { compare } from "bcryptjs";
import clientPromise from "@/lib/client";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
export type LoginActionResponseType = {
  success: boolean;
  message: string;
};

export type LoginActionStateType = {
  userName: string;
  password: string;
};

export async function loginAction(
  prevState: LoginActionResponseType,
  formData: FormData
): Promise<LoginActionResponseType> {
  const userName = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const client = await clientPromise;
    const db = client.db("telegram_app");
    const user = await db
      .collection("auth_users")
      .findOne({ username: userName });
    if (!user) {
      return { success: false, message: "User not found." };
    }
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: "Invalid credentials." };
    }
    const token = await new SignJWT({ userId: user._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600, // 1 hour
      path: "/",
    });
    return {
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
