import { exit } from "process";
import qrcode from "qrcode-terminal";
import { Client, LocalAuth, MessageAck, type Message } from "whatsapp-web.js";

declare global {
  var IS_READY: boolean;
  var IS_AUTHENTICATED: boolean;
  var client: Client;
}

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: "/session"
  })
});

globalThis.IS_READY = false;
globalThis.IS_AUTHENTICATED = false;
globalThis.client = client;

client.on("message", (message) => {
  if (message.body === "!ping") {
    message.reply("pong").catch((err) => {
      console.error(err);
    })
  }
})

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
})

client.on("ready", () => {
  console.log("Client is ready!");
  globalThis.IS_READY = true;
})

client.on("authenticated", () => {
  globalThis.IS_AUTHENTICATED = true;
  console.log("Client is authenticated!");
})

client.on("authentication_failure", () => {
  console.log("Auth failure!");
  exit(1);
})

client.on("message_ack", (message: Message, ack: MessageAck) => {
  const sentTo = "+" + message.to.replace("@c.us", "");
  const messageId = message.id.id;
  
  if (ack === MessageAck.ACK_ERROR) {
    console.log(`Message ${messageId} sent to ${sentTo} failed to send`);
  } else if (ack === MessageAck.ACK_PENDING) {
    console.log(`Message ${messageId} sent to ${sentTo} is pending to be seen`);
  } else if (ack === MessageAck.ACK_SERVER) {
    console.log(`Message ${messageId} sent to ${sentTo} was sent by the server`);
  } else if (ack === MessageAck.ACK_DEVICE) {
    console.log(`Message ${messageId} sent to ${sentTo} was received on the device`);
  } else if (ack === MessageAck.ACK_READ) {
    console.log(`Message ${messageId} sent to ${sentTo} was read by the recipient`);
  } else if (ack === MessageAck.ACK_PLAYED) {
    console.log(`Message ${messageId} sent to ${sentTo} was played by the recipient`);
  } else {
    console.log(`Message ${messageId} sent to ${sentTo} has an unknown ack`);
  }
})

export default client;
