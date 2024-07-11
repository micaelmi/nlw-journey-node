// src/env.ts
import { z } from "zod";
var envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  FRONTEND_BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(3333)
});
var env = envSchema.parse(process.env);

export {
  env
};
