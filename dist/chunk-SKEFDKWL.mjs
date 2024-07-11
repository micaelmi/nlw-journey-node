import {
  dayjs
} from "./chunk-AUHJNNSO.mjs";
import {
  getMailClient
} from "./chunk-GMAFZPC6.mjs";
import {
  env
} from "./chunk-PGO3CUCA.mjs";
import {
  ClientError
} from "./chunk-GWDUPKZL.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/create-trip.ts
import { z } from "zod";
import nodemailer from "nodemailer";
async function createTrip(app) {
  app.withTypeProvider().post(
    "/trips",
    {
      schema: {
        body: z.object({
          destination: z.string().min(3),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email())
        })
      }
    },
    async (request) => {
      const {
        destination,
        starts_at,
        ends_at,
        owner_name,
        owner_email,
        emails_to_invite
      } = request.body;
      if (dayjs(starts_at).isBefore(/* @__PURE__ */ new Date()))
        throw new ClientError("Invalid trip start date");
      if (dayjs(ends_at).isBefore(starts_at))
        throw new ClientError("Invalid trip end date");
      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_owner: true,
                  is_confirmed: true
                },
                ...emails_to_invite.map((email) => {
                  return { email };
                })
              ]
            }
          }
        }
      });
      const formattedStartDate = dayjs(starts_at).format("LL");
      const formattedEndDate = dayjs(ends_at).format("LL");
      const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`;
      const mail = await getMailClient();
      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "oi@plann.er"
        },
        to: {
          name: owner_name,
          address: owner_email
        },
        subject: `Confirme sua viagem para ${destination} em ${formattedStartDate}`,
        html: `
        <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
          <p>Voc\xEA solicitou a cria\xE7\xE3o de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate} a ${formattedEndDate}</strong>.</p>
          <p></p>
          <p>Para confirmar sua viagem, clique no link abaixo:</p>
          <p></p>
          <p><a href="${confirmationLink}">Confirmar viagem</a></p>
          <p></p>
          <p>Caso voc\xEA n\xE3o saiba do que se trata esse e-mail, apenas ignore.</p>
      </div>`.trim()
      });
      console.log(nodemailer.getTestMessageUrl(message));
      return { tripId: trip.id };
    }
  );
}

export {
  createTrip
};
