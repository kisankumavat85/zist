import z from "zod";

const ChatSchema = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  id: z.string(),
  userId: z.string(),
  resourceId: z.number(),
  title: z.string(),
});

export const ChatsSchema = z.array(ChatSchema);
