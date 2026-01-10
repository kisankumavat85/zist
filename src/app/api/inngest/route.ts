import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { helloWorld } from "@/lib/inngest/hello-world";
import { resourceProcess } from "@/lib/inngest/resource-process";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, resourceProcess],
});
