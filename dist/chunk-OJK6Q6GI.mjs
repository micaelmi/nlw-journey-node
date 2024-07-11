import {
  dayjs
} from "./chunk-AUHJNNSO.mjs";
import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create-activity.ts
import { z } from "zod";
async function createActivity(app) {
  app.withTypeProvider().post(
    "/trips/:tripId/activities",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid()
        }),
        body: z.object({
          title: z.string().min(3),
          occurs_at: z.coerce.date()
        })
      }
    },
    async (request) => {
      const { tripId } = request.params;
      const { title, occurs_at } = request.body;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) throw new ClientError("Trip not found");
      if (dayjs(occurs_at).isBefore(trip.starts_at))
        throw new ClientError("Invalid activity date");
      if (dayjs(occurs_at).isAfter(trip.ends_at))
        throw new ClientError("Invalid activity date");
      const activity = await prisma.activity.create({
        data: { title, occurs_at, trip_id: tripId }
      });
      return { activityId: activity.id };
    }
  );
}

export {
  createActivity
};
