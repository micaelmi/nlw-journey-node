import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-participant.ts
import { z } from "zod";
async function getParticipant(app) {
  app.withTypeProvider().get(
    "/participants/:participantId",
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { participantId } = request.params;
      const participant = await prisma.participant.findUnique({
        select: {
          id: true,
          name: true,
          email: true,
          is_confirmed: true,
          is_owner: true
        },
        where: { id: participantId }
      });
      if (!participant) throw new ClientError("Participant not found");
      return { participant };
    }
  );
}

export {
  getParticipant
};
