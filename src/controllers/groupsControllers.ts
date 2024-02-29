import type { Request, Response } from "express";
import { MessageMedia, type GroupChat } from "whatsapp-web.js";
import JsonDb from "../lib/db";
import { formatNumber } from "../lib/formatter";
import { CreatedGroup } from "../types/groups";

const db = new JsonDb<CreatedGroup>("groups.json");

export async function createAGroup(req: Request, res: Response): Promise<void> {
  const title = (req.body.title as string) ?? "New Group";
  const contactIds = (req.body.contacts as string[]) ?? [];
  const verifyEveryContact =
    (req.body.verify_every_contact as boolean) ?? false;

  if (verifyEveryContact) {
    for (let i = 0; i < contactIds.length; i++) {
      let contactId = contactIds[i];
      contactId = formatNumber(contactId);
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
  for (const contactId of contactIds) {
    contacts.push(formatNumber(contactId));
  }
  try {
    const group = await globalThis.client.createGroup(title, contacts);
    if (typeof group === "string") {
      db.insertOne({
        title: group,
        id: group,
      });
      res.status(201).send({
        data: {
          group,
        },
      });
      return;
    }

    db.insertOne({
      title: group.title,
      id: group.gid._serialized,
    });

    res.status(201).send({
      data: {
        ...group,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: {
        message: "Failed to create group",
      },
    });
  }
}

export async function addGroupMembers(
  req: Request,
  res: Response
): Promise<void> {
  const id = (req.body.id as string) ?? "";
  const numbers = (req.body.numbers as string[]) ?? [];
  const message: string = (req.body.message as string) ?? "";

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
  try {
    let result = await group.addParticipants(numbers.map(formatNumber), {
      comment: message,
    });
    if (typeof result === "string") {
      res.status(200).send({
        data: {
          message: result,
        },
      });
      return;
    }
    res.status(200).send({
      data: {
        ...result,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).send({
      error: {
        message: "failed to add members",
      },
    });
  }
}

export async function setGroupProfilePic(
  req: Request,
  res: Response
): Promise<void> {
  const image = (req.file as Express.Multer.File) ?? null;
  const id = (req.body.id as string) ?? "";

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

export async function setGroupAdmins(
  req: Request,
  res: Response
): Promise<void> {
  const id = (req.body.id as string) ?? "";
  const usersIds = (req.body.users as string[]) ?? [];

  if (!id || usersIds.length === 0) {
    res.status(400).send({
      error: {
        message: "invalid request. `id` and `users` required.",
      },
    });
    return;
  }

  try {
    const chat = await globalThis.client.getChatById(id);
    const users = [];

    for (const userId of usersIds) {
      users.push(formatNumber(userId));
    }

    if (users.length === 0) {
      res.status(400).send({
        error: {
          message:
            "invalid request. `users` must have at least one valid number.",
        },
      });
      return;
    }
    if (!chat.isGroup) {
      res.status(400).send({
        error: {
          message: "specified chat id is not a group!",
        },
      });
      return;
    }

    const group = chat as GroupChat;
    const result = await group.promoteParticipants(users);
    if (result.status === 200) {
      res.status(200).send({
        data: {
          message: "admins set",
        },
      });
      return;
    } else {
      res.status(500).send({
        error: {
          message: "failed to set group admins",
        },
      });
      return;
    }
  } catch (e) {
    res.status(500).send({
      error: {
        message: "failed to set group admins or a user might already be admin",
      },
    });
  }
}
