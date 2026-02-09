import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import { z } from "zod"

import { addToWaitlist, allWaitlists } from "@/controllers/waitlist"

const waitlist = new Hono()

waitlist.get("/", async (c) => {
  const waitlist = await allWaitlists()
  return c.json(waitlist, 200)
})

waitlist.post(
  "/",
  zValidator("json", z.object({ email: z.string() })),
  async (c) => {
    const body = c.req.valid("json")
    const res = await addToWaitlist(body.email)
    return c.json(res, 201)
  },
)

export default waitlist
