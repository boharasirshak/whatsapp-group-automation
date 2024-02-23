import type { Request, Response } from "express";
import { MessageAck, MessageMedia, type Message } from "whatsapp-web.js";
import { formatMessageAck } from "../utils/formatter";

export async function getMe(req: Request, res: Response): Promise<void> {
  const me = globalThis.client.info.wid;
  const name = globalThis.client.info.pushname;
  const platform = globalThis.client.info.platform;
  const chats = await globalThis.client.getChats();
  const groups = chats.filter((chat) => chat.isGroup);
  const contacts = await globalThis.client.getContacts();
  res.status(200).send({
    ...me,
    name,
    platform,
    chats,
    groups,
    contacts,
  });
}

export async function sendMessageToUser(
  req: Request,
  res: Response
): Promise<void> {
  const message = (req.body.message as string) ?? "";
  const number: string = (req.body.number as string) ?? "";

  try {
    const isValid = await client.isRegisteredUser(req.body.number as string);
    if (!isValid) {
      res.status(404).send({
        error: "Number is not registered on Whatsapp",
      });
      return;
    }

    const files = (req.files as Express.Multer.File[]) ?? [];
    const length = (req.files?.length as number) ?? 0;

    if (length === 0) {
      const sentMessage = await client.sendMessage(number, message);
      const messageStatus = formatMessageAck(sentMessage.ack);

      if (sentMessage.ack === MessageAck.ACK_ERROR) {
        res.status(400).send({
          error: "Message failed to send",
        });
        return;
      }

      res.status(200).send({
        data: {
          status: messageStatus,
          ...sentMessage,
        },
      });
      return;
    }

    const sendAsDocument = Boolean(req.body.send_as_document) ?? false;
    const responses: Message[] = [];

    for (let i = 0; i < length; i++) {
      const file = MessageMedia.fromFilePath(files[i].path);
      file.mimetype = files[i].mimetype;
      file.filename = files[i].originalname;
      const sentMessage = await client.sendMessage(number, file, {
        caption: message,
        sendMediaAsDocument: sendAsDocument,
      });

      if (sentMessage.ack === MessageAck.ACK_ERROR) {
        res.status(400).send({
          error: "Message failed to send",
        });
        return;
      }
      responses.push(sentMessage);
    }
    res.status(200).send({
      data: responses,
    });
  } catch {
    res.status(500).send({
      error: {
        message: "Failed to send message",
      },
    });
  }
}
