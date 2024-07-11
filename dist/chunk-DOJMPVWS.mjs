import {
  dayjs
} from "./chunk-AUHJNNSO.mjs";
import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-activities.ts
import { z } from "zod";
async function getActivities(app) {
  app.withTypeProvider().get(
    "/trips/:tripId/activities",
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
          activities: {
            orderBy: { occurs_at: "asc" }
          }
        }
      });
      if (!trip) throw new ClientError("Trip not found");
      const differenceInDaysBetweenTripStartAndEnd = dayjs(trip.ends_at).diff(
        trip.starts_at,
        "days"
      );
      const activities = Array.from({
        length: differenceInDaysBetweenTripStartAndEnd + 1
      }).map((_, index) => {
        const date = dayjs(trip.starts_at).add(index, "days");
        return {
          date: date.toDate(),
          activities: trip.activities.filter(
            (activity) => dayjs(activity.occurs_at).isSame(date, "day")
          )
        };
      });
      return { activities };
    }
  );
}

export {
  getActivities
};
