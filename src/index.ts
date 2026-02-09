import { Hono } from "hono"
import { logger } from "hono/logger"
import { secureHeaders } from "hono/secure-headers"

import streamRoute from "./routes/stream"
import userRoutes from "./routes/user"
import waitlistRoutes from "./routes/waitlist"

import { auth } from "./utils/auth"

const app = new Hono()

app.use(logger())
app.use(secureHeaders())

app.get("/", (c) => {
  return c.text("Hello Hono!")
})
app.on(
  ["POST", "GET"],
  "/api/auth/*",
  async (c) => await auth.handler(c.req.raw),
)
app.route("/stream/", streamRoute)
app.route("/api/user/", userRoutes)
app.route("/api/waitlist/", waitlistRoutes)

export default app

process.on("unhandledRejection", (reason: string, p: Promise<any>) => {
  console.log(p)
  throw new Error(reason)
})

process.on("uncaughtException", (error: Error) => {
  console.error(error)
  process.exit(1)
})
