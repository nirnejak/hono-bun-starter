import { zValidator } from "@hono/zod-validator"
import { createInsertSchema } from "drizzle-zod"
import { Hono } from "hono"
import { z } from "zod"

import { addToWaitlist, allWaitlists } from "@/controllers/waitlist"
import { waitlist as waitlistTable } from "@/db/schema"

const insertWaitlistSchema = createInsertSchema(waitlistTable, {
  email: z.email(),
}).omit({ id: true })

const waitlist = new Hono()

waitlist.get("/", async (c) => {
  const waitlist = await allWaitlists()
  return c.json(waitlist, 200)
})

waitlist.post("/", zValidator("json", insertWaitlistSchema), async (c) => {
  const body = c.req.valid("json")
  const res = await addToWaitlist(body.email)
  return c.json(res, 201)
})

export default waitlist
