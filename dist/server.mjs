import {
  getParticipants
} from "./chunk-7U3ERFOD.mjs";
import {
  getTripDetails
} from "./chunk-SP6OTZE4.mjs";
import {
  updateTrip
} from "./chunk-EFOTNGC7.mjs";
import {
  confirmTrip
} from "./chunk-HUUNS42A.mjs";
import {
  createActivity
} from "./chunk-OJK6Q6GI.mjs";
import {
  createInvite
} from "./chunk-HJQDBGU7.mjs";
import {
  createLink
} from "./chunk-QLCHZ4XC.mjs";
import {
  createTrip
} from "./chunk-SKEFDKWL.mjs";
import {
  getActivities
} from "./chunk-DOJMPVWS.mjs";
import {
  getLinks
} from "./chunk-WIXVPNXD.mjs";
import {
  getParticipant
} from "./chunk-SBZL54WZ.mjs";
import {
  errorHandler
} from "./chunk-CXZLK2YW.mjs";
import "./chunk-AUHJNNSO.mjs";
import "./chunk-GMAFZPC6.mjs";
import {
  confirmParticipant
} from "./chunk-P3SXB6FO.mjs";
import {
  env
} from "./chunk-PGO3CUCA.mjs";
import "./chunk-GWDUPKZL.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";
var app = fastify();
app.register(cors, {
  origin: "*"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.setErrorHandler(errorHandler);
app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipant);
app.register(createActivity);
app.register(getActivities);
app.register(createLink);
app.register(getLinks);
app.register(getParticipants);
app.register(createInvite);
app.register(updateTrip);
app.register(getTripDetails);
app.register(getParticipant);
app.listen({ port: env.PORT }).then(() => {
  console.log("Server flying! \u{1F680}");
});
