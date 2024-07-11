import {
  dayjs
} from "./chunk-AUHJNNSO.mjs";
import {
  getMailClient
} from "./chunk-GMAFZPC6.mjs";
import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create-invite.ts
import nodemailer from "nodemailer";
import { z } from "zod";
import { env } from "process";
async function createInvite(app) {
  app.withTypeProvider().post(
    "/trips/:tripId/invites",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid()
        }),
        body: z.object({
          email: z.string().email()
        })
      }
    },
    async (request) => {
      const { tripId } = request.params;
      const { email } = request.body;
      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });
      if (!trip) throw new ClientError("Trip not found");
      const participant = await prisma.participant.create({
        data: { email, trip_id: tripId }
      });
      const formattedStartDate = dayjs(trip.starts_at).format("LL");
      const formattedEndDate = dayjs(trip.ends_at).format("LL");
      const mail = await getMailClient();
      const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`;
      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "oi@plann.er"
        },
        to: participant.email,
        subject: `Confirme sua presen\xE7a na viagem para ${trip.destination} em ${formattedStartDate}`,
        html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Voc\xEA foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate} a ${formattedEndDate}</strong>.</p>
              <p></p>
              <p>Para confirmar sua viagem, clique no link abaixo:</p>
              <p></p>
              <p><a href="${confirmationLink}">Confirmar viagem</a></p>
              <p></p>
              <p>Caso voc\xEA n\xE3o saiba do que se trata esse e-mail, apenas ignore.</p>
          </div>`.trim()
      });
      console.log(nodemailer.getTestMessageUrl(message));
      return { participantId: participant.id };
    }
  );
}

export {
  createInvite
};
