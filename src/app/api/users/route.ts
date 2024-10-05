import { NextResponse } from "next/server";
import clientPromise from "@/lib/client";
import { verifyAuth } from "@/lib/verifyUser";
<<<<<<< HEAD

=======
export const maxDuration = 60;
>>>>>>> 19666fd77c83173c034bb69a648a5b7df9888293
export async function GET() {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = clientPromise;
    const db = client.db("telegram_app");
    // await db.collection("users").createIndex(
    //   {
    //     username: 1,
    //     lastCheckIn: -1,
    //     points: -1,
    //   },
    //   {
    //     name: "user_query_index",
    //     background: true, // This allows the index to be built in the background
    //   }
    // );

    const users = await db
      .collection("users")
      .find({})
      .sort({ lastCheckIn: -1, points: -1 })
      .project({
        _id: 1,
        username: 1,
        ipAddress: 1,
        location: 1,
        downloadSpeed: 1,
        uploadSpeed: 1,
        points: 1,
        totalTimeOfUsingApp: 1,
        isFollowingTwitter: 1,
        hasJoinedDiscord: 1,
        hasJoinedTelegram: 1,
        profilePhoto: 1,
        evmAddress: 1,
        substrateAddress: 1,
        lastCheckIn: 1,
      })
      .toArray();


    return NextResponse.json({ users }, { status: 200 });
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
