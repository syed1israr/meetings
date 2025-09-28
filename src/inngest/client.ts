import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "tandemly", 
  apiKey: process.env.INNGEST_API_KEY, 
});
