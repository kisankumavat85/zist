import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { _getChats, GetChatsParams } from "@/db/data/chats";

export const GET = async (request: NextRequest) => {
  try {
    const { isAuthenticated, userId } = await auth();

    if (!isAuthenticated || !userId) {
      return Response.json(null, {
        status: 401,
      });
    }
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit");
    const page = searchParams.get("page");
    const query = searchParams.get("query");

    const params: GetChatsParams = {
      userId,
    };
    if (limit) params.limit = Number(limit);
    if (page) params.page = Number(page);
    if (query) params.query = query;

    const chats = await _getChats(params);
    return Response.json(chats, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        message: "Internal server error",
      },
      { status: 500 },
    );
  }
};
