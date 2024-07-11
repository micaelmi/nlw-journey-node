import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-trip-details.ts
import { z } from "zod";
async function getTripDetails(app) {
  app.withTypeProvider().get(
    "/trips/:tripId",
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
        select: {
          id: true,
          destination: true,
          starts_at: true,
          ends_at: true,
          is_confirmed: true
        },
        where: { id: tripId }
      });
      if (!trip) throw new ClientError("Trip not found");
      return { trip };
    }
  );
}

export {
  getTripDetails
};
