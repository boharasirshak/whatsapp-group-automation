import type { Request, Response } from "express";
import type { Contact, Message } from "whatsapp-web.js";
import { MessageAck, MessageMedia } from "whatsapp-web.js";
import { formatMessageAck } from "../utils/formatter";

export async function sendMessageToGroup(
  req: Request,
  res: Response
): Promise<void> {
  const message = (req.body.message as string) ?? "";
  const groupId: string = (req.body.group_id as string) ?? "";

  try {
    const group = await globalThis.client.getChatById(groupId);
    const files = (req.files as Express.Multer.File[]) ?? [];
    const length = (req.files?.length as number) ?? 0;

    if (length === 0) {
      const sentMessage = await group.sendMessage(message);
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
      const sentMessage = await group.sendMessage(file, {
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
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: {
        message: "Failed to send message",
      },
    });
  }
}

export async function createAGroup(req: Request, res: Response): Promise<void> {
  const title = (req.body.title as string) ?? "New Group";
  const contactIds = (req.body.contacts as string[]) ?? [];
  const verifyEveryContact =
    (req.body.verify_every_contact as boolean) ?? false;

  if (verifyEveryContact) {
    const contacts: Contact[] = [];

    for (let i = 0; i < contactIds.length; i++) {
      const contactId = contactIds[i];
      try {
        const contact = await globalThis.client.getContactById(contactId);
        contacts.push(contact);
      } catch {
        res.status(400).send({
          error: {
            message: `Contact with id: ${contactId} is invalid`,
          },
        });
        return;
      }
    }
  }
  try {
    const group = await globalThis.client.createGroup(title, contactIds);
    if (typeof group === "string") {
      res.status(201).send({
        data: {
          group,
        },
      });
      return;
    }
    res.status(201).send({
      data: {
        ...group,
      },
    });
  } catch (e) {
    res.status(500).send({
      error: {
        message: "Failed to create group",
      },
    });
  }
}
