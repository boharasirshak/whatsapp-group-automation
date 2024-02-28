import path from "path";
import { exit } from "process";
import qrcode from "qrcode-terminal";
import { Client, GroupNotificationTypes, LocalAuth, MessageAck, type Message } from "whatsapp-web.js";

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
  // currently we are only interested in invite and add notifications
  if (
    notification.type === GroupNotificationTypes.INVITE || 
    notification.type === GroupNotificationTypes.ADD
  ) {
    const chat = await notification.getChat();
    console.log(`[info]: ${notification.author} joined group ${chat.name} - ${chat.id._serialized}`);

    // check if it is the group that was created by the POST /groups endpoint
    // if yes, send a welcome message to the user.
  }
});

export default client;
