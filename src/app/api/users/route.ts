import { NextResponse } from "next/server";
import clientPromise from "@/lib/client";
import { verifyAuth } from "@/lib/verifyUser";
export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.redirect(
      new URL("/", "http://localhost:3000").toString(),
      { status: 302 }
    );
  }
  try {
    const client = clientPromise;
    const db = client.db("telegram_app");
    const users = await db.collection("users").find({}).toArray();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = users.map((user: any) => {
      return {
        ...user,
        _id: user._id.toString(),
      };
    });
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error(
      "An error occurred while trying to fetch users from the database: ",
      error
    );
    return NextResponse.json(
      { error: "Failed to fetch users from the database" },
      { status: 500 }
    );
  }
}
