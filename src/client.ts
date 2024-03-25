import path from "path";
import { exit } from "process";
import qrcode from "qrcode-terminal";
import { Client, GroupNotificationTypes, LocalAuth, MessageAck, type Message } from "whatsapp-web.js";
import JsonDb from "./lib/db";
import { formatNumber } from "./lib/formatter";
import { WelcomeMessageType, formatWelcomeMessage } from "./lib/welcomeMessages";
import { CreatedCustomer, CreatedGroup, GroupNotificationId } from "./types/groups";

const DEFAULT_CONTACTS = [
  // "+49 151 40320796",
  // "+49 176 73757069",
  // "+49 162 7289021",
  // "+49 173 3653715",
  // "+49 174 2796681",
  // "+49 152 34628125",
  "+977 976 2260487",
  "+977 981 0059586"
];

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
  // only handle join notifications which are not invites
  if (notification.type === GroupNotificationTypes.INVITE) {
    return;
  }

  // NotificationType ADD is generated when we send a invite request to a user
  const chat = await notification.getChat();
  let group = db.findOne((group) => group.id === chat.id._serialized);
  if (!group) {
    console.log(`[info]: Group ${chat.name} is not in the database`);
    return;
  }
  if (group.customers === undefined || group.customers.length === 0) {
    console.log(`[info]: Group ${chat.name} has no customers`);
    return;
  }

  const id = notification.id as GroupNotificationId;
  console.log(`[info]: A new user ${id.participant} joined group ${chat.name}`);

  let customer: CreatedCustomer | undefined;

  // logic to check if the user is the customer that filled the form
  for (const element in group.customers) {
    if (Object.prototype.hasOwnProperty.call(group.customers, element)) {
      const cusId = formatNumber(group.customers[element].phone);
      if (cusId === id._serialized || cusId === id.participant) {
        customer = group.customers[element];
        break;
      }
    }
  }

  // backup logic to check if the user is the customer that filled the form, just in case
  group.customers.forEach((cus) => {
    const cusId = formatNumber(cus.phone);
    if (cusId === id._serialized || cusId === id.participant) {
      customer = cus;
    }
  })

  if (!customer) {
    console.log(`[info]: User ${id.participant} (${id._serialized}) is not a customer of group ${chat.name}`);
    return;
  }

  console.log(`[info]: Customer ${customer?.name} (${customer?.phone}) is a customer of group ${chat.name}`);

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

  console.log(`[info]: Sending welcome message ${type} to ${customer?.name} (${customer?.phone}) in group ${chat.name}`);

  var message = formatWelcomeMessage(
    type,
    group,
    customer ?? {
      name: "",
      phone: ""
    },
  );

  await chat.sendMessage(message);

  for (const number of DEFAULT_CONTACTS) {
    try {
      let contactId = formatNumber(number);
      await client.sendMessage(contactId, `Bitte begrüße unseren neuen Kunden ${customer.name ?? ""} in der WhatsApp Gruppe *FL | ${group.brandName} | ${group.customerType}*`);
    } catch (error) {
      console.log(`[error]: Failed to send message to default contact ${number} as ${error}`);
    }
  }
});

export default client;
