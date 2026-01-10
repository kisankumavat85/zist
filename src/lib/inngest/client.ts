import { EventSchemas, Inngest } from "inngest";
import z from "zod";

export const inngest = new Inngest({
  id: "zist",
  schemas: new EventSchemas().fromSchema({
    "test/hello.world": z.object({
      email: z.email(),
    }),
    "resource/process": z.object({
      userId: z.string(),
      resourceId: z.number(),
      fullPath: z.string(),
    }),
  }),
});
