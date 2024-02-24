import type { Request, Response } from "express";
import { MessageMedia, type GroupChat } from "whatsapp-web.js";
import { formatNumber } from "../utils/formatter";

export async function createAGroup(req: Request, res: Response): Promise<void> {
  const title = (req.body.title as string) ?? "New Group";
  const contactIds = (req.body.contacts as string[]) ?? [];
  const verifyEveryContact =
    (req.body.verify_every_contact as boolean) ?? false;

  if (verifyEveryContact) {
    for (let i = 0; i < contactIds.length; i++) {
      const contactId = contactIds[i];
      try {
        await globalThis.client.getContactById(contactId);
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
  const contacts = [];
  for(const contactId of contactIds){
    contacts.push(formatNumber(contactId));
  }
  try {
    const group = await globalThis.client.createGroup(title, contacts);
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

export async function setGroupProfilePic(req: Request, res: Response): Promise<void> {
  const image = req.file as Express.Multer.File ?? null;
  const id = req.body.id as string ?? "";

  if (!image || !id) {
    res.status(400).send({
      error: {
        message: "invalid request. `image` and `id` required.",
      },
    });
    return;
  }

  if (image.mimetype.split("/")[0] !== "image") {
    res.status(400).send({
      error: {
        message: "invalid file type. must be an image!",
      },
    });
    return;
  }

  try {
    const file = MessageMedia.fromFilePath(image.path);
    file.filename = image.originalname;
    file.mimetype = image.mimetype;

    const chat = await globalThis.client.getChatById(id);
    if (!chat.isGroup) {
      res.status(400).send({
        error: {
          message: "chat is not a group!",
        },
      });
      return;
    }

    const group = chat as GroupChat;
    const status = await group.setPicture(file);
    if (!status) {
      res.status(500).send({
        error: {
          message: "failed to set group profile picture",
        },
      });
      return;
    }

    res.status(200).send({
      data: {
        message: "group profile picture set",
      },
    });
  } catch {
    res.status(500).send({
      error: {
        message: "failed to set group profile picture",
      },
    });
  }
}

export async function setGroupAdmins(req: Request, res: Response): Promise<void> {
  
}
