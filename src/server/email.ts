import nodemailer, { SendMailOptions as Mail } from "nodemailer";
import { Session } from "utils/auth";
const { getEnv } = require("utils/env");

export const sendMail = async (mail: Mail, session?: Session | null) => {
  try {
    const server = {
      pool: true,
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // use TLS
      auth: {
        user: "rom.seguy@lilo.org",
        pass: process.env.NEXT_PUBLIC_EMAIL_API_KEY // TODO
      }
    };

    if (getEnv() === "production") {
      const transport = nodemailer.createTransport(server);
      await transport.sendMail(mail);
    }

    console.log(`sent notif to ${mail.to}`, mail);
  } catch (error: any) {
    console.log("api/email/sendMail error");
    console.error(error);

    if (getEnv() === "development") {
      if (error.command === "CONN") {
        console.log(`sent email to ${mail.to}`, mail);
      }
    } else throw error;
  }
};

export const sendToAdmin = async ({
  event,
  project
}: {
  event?: Omit<IEvent, "_id">;
  project?: Partial<IProject>;
}) => {
  if (!event && !project) return;

  let mail: Mail = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_ADMIN
  };

  console.log(event);

  if (event) {
    if (event.isApproved) return;

    mail = {
      ...mail,
      subject: `Un événement attend votre approbation : ${event.eventName}`,
      html: `
        <h1>Nouvel événement : ${event.eventName}</h1>
        <p>Rendez-vous sur <a href="${process.env.NEXT_PUBLIC_URL}/${event.eventUrl}">${process.env.NEXT_PUBLIC_SHORT_URL}/${event.eventUrl}</a> pour l'approuver.</p>
      `
    };
  } else if (project && project.projectOrgs) {
    mail = {
      ...mail,
      subject: `Un projet attend votre approbation : ${project.projectName}`,
      html: `
        <h1>Nouveau projet : ${project.projectName}</h1>
        <p>Rendez-vous sur <a href="${process.env.NEXT_PUBLIC_URL}/${project.projectOrgs[0].orgName}">${process.env.NEXT_PUBLIC_SHORT_URL}/${project.projectOrgs[0].orgName}</a> pour l'approuver.</p>
      `
    };
  }

  if (getEnv() === "production") {
    await sendMail(mail);
  } else if (getEnv() === "development") {
    console.log(`sent project email notif to ${mail.to}`, mail);
  }
};
