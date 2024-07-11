import {
  dayjs
} from "./chunk-AUHJNNSO.mjs";
import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/update-trip.ts
import { z } from "zod";
async function updateTrip(app) {
  app.withTypeProvider().put(
    "/trips/:tripId",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid()
        }),
        body: z.object({
          destination: z.string().min(3),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date()
        })
      }
    },
    async (request) => {
      const { tripId } = request.params;
      const { destination, starts_at, ends_at } = request.body;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) throw new ClientError("Trip not found");
      if (dayjs(starts_at).isBefore(/* @__PURE__ */ new Date()))
        throw new ClientError("Invalid trip start date");
      if (dayjs(ends_at).isBefore(starts_at))
        throw new ClientError("Invalid trip end date");
      await prisma.trip.update({
        where: { id: tripId },
        data: {
          destination,
          starts_at,
          ends_at
        }
      });
      return { tripId: trip.id };
    }
  );
}

export {
  updateTrip
};
