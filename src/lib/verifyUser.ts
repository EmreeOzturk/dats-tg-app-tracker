import { cookies } from "next/headers";
import { jwtVerify } from "jose";

async function verifyAuth() {
  const token = cookies().get("auth-token")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return payload;
  } catch (error) {
    return null;
  }
}

export { verifyAuth };
