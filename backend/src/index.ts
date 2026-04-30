import { env } from "./config/env";
import { createApp } from "./app";

createApp().listen(env.port, "0.0.0.0", () => {
  console.log(`Skillswap API listening on 0.0.0.0:${env.port}`);
});
