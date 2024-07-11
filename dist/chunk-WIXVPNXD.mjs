import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-links.ts
import { z } from "zod";
async function getLinks(app) {
  app.withTypeProvider().get(
    "/trips/:tripId/links",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { tripId } = request.params;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: { links: true }
      });
      if (!trip) throw new ClientError("Trip not found");
      return { links: trip.links };
    }
  );
}

export {
  getLinks
};
