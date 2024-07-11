import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-participants.ts
import { z } from "zod";
async function getParticipants(app) {
  app.withTypeProvider().get(
    "/trips/:tripId/participants",
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
        include: {
          participants: {
            select: {
              id: true,
              name: true,
              email: true,
              is_owner: true,
              is_confirmed: true
            }
          }
        }
      });
      if (!trip) throw new ClientError("Trip not found");
      return { participants: trip.participants };
    }
  );
}

export {
  getParticipants
};
