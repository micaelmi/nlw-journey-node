import {
  env
} from "./chunk-PGO3CUCA.mjs";
import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/confirm-participant.ts
import { z } from "zod";
async function confirmParticipant(app) {
  app.withTypeProvider().get(
    "/participants/:participantId/confirm",
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid()
        })
      }
    },
    async (request, reply) => {
      const { participantId } = request.params;
      const participant = await prisma.participant.findUnique({
        where: { id: participantId }
      });
      if (!participant) throw new ClientError("Participant not found.");
      if (participant.is_confirmed)
        return reply.redirect(
          `${env.FRONTEND_BASE_URL}/trips/${participant.trip_id}`
        );
      await prisma.participant.update({
        where: { id: participantId },
        data: { is_confirmed: true }
      });
      return reply.redirect(
        `${env.FRONTEND_BASE_URL}/trips/${participant.trip_id}`
      );
    }
  );
}

export {
  confirmParticipant
};
