import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";

// src/error-handler.ts
import { ZodError } from "zod";
var errorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Invalid Input",
      errors: error.flatten().fieldErrors
    });
  }
  if (error instanceof ClientError) {
    return reply.status(400).send({
      message: error
    });
  }
  return reply.status(500).send({ message: "Internal Server Error" });
};

export {
  errorHandler
};
