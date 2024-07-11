import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create-link.ts
import { z } from "zod";
async function createLink(app) {
  app.withTypeProvider().post(
    "/trips/:tripId/links",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid()
        }),
        body: z.object({
          title: z.string().min(3),
          url: z.string().url()
        })
      }
    },
    async (request) => {
      const { tripId } = request.params;
      const { title, url } = request.body;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) throw new ClientError("Trip not found");
      const link = await prisma.link.create({
        data: { title, url, trip_id: tripId }
      });
      return { linkId: link.id };
    }
  );
}

export {
  createLink
};
