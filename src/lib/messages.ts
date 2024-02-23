import { MessageMedia } from "whatsapp-web.js";
import {
  ISendButtons,
  ISendContact,
  ISendFile,
  ISendList,
  ISendLocation,
  ISendMessage,
} from "../types/messages";

export async function sendMessage(opts: ISendMessage) {
  const {client, message, options, chatId} = opts;
  try {
    const chat = await client.getChatById(chatId); // Verify if chat exists, throws error if not
    return chat.sendMessage(message, options);
  } catch (e) {
    throw new Error(`failed to send message: ${(e as Error).message}`);
  }
}

export async function sendFile(opts: ISendFile) {
  const {client, caption, options, chatId, file} = opts;
  try {
    const chat = await client.getChatById(chatId);
    const media = MessageMedia.fromFilePath(file.path);
    return chat.sendMessage(media, {caption: caption, ...options});
  } catch (e) {
    throw new Error(`failed to send file: ${(e as Error).message}`);
  }
}

export async function sendLocation(opts: ISendLocation) {
  const {client, location, options, chatId} = opts;
  try {
    const chat = await client.getChatById(chatId);
    return chat.sendMessage(location, options);
  } catch (e) {
    throw new Error(`failed to send location: ${(e as Error).message}`);
  }
}

export async function sendContacts(opts: ISendContact) {
  const {client, contacts, options, chatId} = opts;
  try {
    const chat = await client.getChatById(chatId);
    return chat.sendMessage(
      contacts.length > 1 ? contacts : contacts[0], 
      options
    );
  } catch (e) {
    throw new Error(`failed to send contacts: ${(e as Error).message}`);
  }
}

export async function sendButtons(opts: ISendButtons) {
  const {client, buttons, options, chatId} = opts;
  try {
    const chat = await client.getChatById(chatId);
    return chat.sendMessage(buttons, options);
  } catch (e) {
    throw new Error(`failed to send contacts: ${(e as Error).message}`);
  }
}


export async function sendLists(opts: ISendList) {
  const {client, list, options, chatId} = opts;
  try {
    const chat = await client.getChatById(chatId);
    return chat.sendMessage(list, options);
  } catch (e) {
    throw new Error(`failed to send contacts: ${(e as Error).message}`);
  }
}
