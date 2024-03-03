import path from "path";
import { exit } from "process";
import qrcode from "qrcode-terminal";
import { Client, GroupNotificationTypes, LocalAuth, MessageAck, type Message } from "whatsapp-web.js";
import JsonDb from "./lib/db";
import { formatNumber } from "./lib/formatter";
import { WelcomeMessageType, formatWelcomeMessage } from "./lib/welcomeMessages";
import { CreatedGroup, GroupNotificationId } from "./types/groups";

// for simplicity, these will be set to global variables
// you can, however, import/export these using 
// export { client, IS_READY, IS_AUTHENTICATED };
// import { client, IS_READY, IS_AUTHENTICATED } from "./client";
// to more standard practice of "no global vars"!
declare global {
  var IS_READY: boolean;
  var IS_AUTHENTICATED: boolean;
  var client: Client;
}

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: path.join(__dirname, "../session"),
  }),
  puppeteer: {
    args: ['--no-sandbox'],
  },
});

globalThis.IS_READY = false;
globalThis.IS_AUTHENTICATED = false;
globalThis.client = client;

export const db = new JsonDb<CreatedGroup>("groups.json");

client.on("message", (message) => {
  // empty
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("[info]: client is ready!");
  globalThis.IS_READY = true;
});

client.on("authenticated", () => {
  globalThis.IS_AUTHENTICATED = true;
  console.log("[info]: client is authenticated!");
});

client.on("authentication_failure", () => {
  console.log("[critical]: authentication failed!");
  exit(1);
});

client.on("message_ack", (message: Message, ack: MessageAck) => {
  // Currently commented because it's of no use , 
  // you can uncomment it if you want to see the status of the message

  // const sentTo = "+" + message.to.replace("@c.us", "");
  // const messageId = message.id.id;

  // switch (ack) {
  //   case MessageAck.ACK_ERROR:
  //     console.log(`[debug]: message ${messageId} sent to ${sentTo} failed to send`);
  //     break;

  //   case MessageAck.ACK_PENDING:
  //     console.log(`[debug]: message ${messageId} sent to ${sentTo} is pending to be seen`);
  //     break;

  //   case MessageAck.ACK_SERVER:
  //     console.log(`[debug]: message ${messageId} sent to ${sentTo} was sent by the server`);
  //     break;

  //   case MessageAck.ACK_DEVICE:
  //     console.log(`[debug]: message ${messageId} sent to ${sentTo} was received on the device`);
  //     break;

  //   case MessageAck.ACK_READ:
  //     console.log(`[debug]: message ${messageId} sent to ${sentTo} was read by the recipient`);
  //     break;

  //   case MessageAck.ACK_PLAYED:
  //     console.log(`[debug]: message ${messageId} sent to ${sentTo} was played by the recipient`);
  //     break;

  //   default:
  //     console.log(`[debug]: message ${messageId} sent to ${sentTo} has an unknown ack`);
  //     break;
  // }
});

client.on('group_join', async (notification) => {

  // TODO: check the diffrent notification types./

  if (notification.type === GroupNotificationTypes.ADD)
    return;

  // only handle the event if the user is invited and joins the group
  const chat = await notification.getChat();
  let group = db.findOne((group) => group.id === chat.id._serialized);
  if (!group) {
    return;
  }
  const id = notification.id as GroupNotificationId;
  console.log(`[info]: A new user ${id.participant} joined group ${chat.name}`);

  // logic to check if the user is the customer that filled the form
  let exists = db.findOne((group) => {
    group.customers?.forEach((customer) => {
      let cusId = formatNumber(customer.phone);
      if (cusId === id.participant) {
        return true;
      }
    });
    return false;
  });

  if (!exists) {
    return;
  }

  var customer = group.customers?.find((customer) => {
    let cusId = formatNumber(customer.phone);
    return cusId === id.participant;
  });

  let type: WelcomeMessageType;

  if (group.messageType === "E-Com Einzelprojekt") {
    type = WelcomeMessageType.First;
  } else if (group.messageType === "E-Com Content Abo") {
    type = WelcomeMessageType.Second;
  } else if (group.messageType === "E-Com Rundumbetreuung") {
    type = WelcomeMessageType.Third;
  } else {
    type = WelcomeMessageType.Fourth;
  }

  var message = formatWelcomeMessage(
    type,
    group,
    customer ?? {
      name: "",
      phone: ""
    },
  );

  await notification.reply(message);
});

export default client;
