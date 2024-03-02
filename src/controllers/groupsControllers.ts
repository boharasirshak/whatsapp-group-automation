import type { Request, Response } from "express";
import { Chat, MessageMedia, type GroupChat } from "whatsapp-web.js";
import { db } from "../client";
import { formatNumber } from "../lib/formatter";
import { CreatedCustomer } from "../types/groups";

export async function createAGroup(req: Request, res: Response): Promise<void> {
  const title = (req.body.title as string) ?? "New Group";
  let contactIds = (req.body.contacts as string[]) ?? [];
  contactIds = contactIds.map(formatNumber);

  // do not add own number to the group (it is added by default when creating a group)
  contactIds = contactIds.filter(
    (contact) => contact !== globalThis.client.info.wid._serialized
  );

  const verifyEveryContact =
    (req.body.verify_every_contact as boolean) ?? false;
  
  let messageType = req.body.message_type ?? "Keine Nachricht";
  let customers: CreatedCustomer[] = req.body.customers ?? [];
  const customerType = req.body.customer_type ?? "";
  const brandName = req.body.brand_name ?? "";
  const link1 = req.body.link1 ?? "";
  const link2 = req.body.link2 ?? "";
  const date1 = req.body.date1 ?? "";
  const date2 = req.body.date2 ?? "";
  const time = req.body.time ?? "";
  const props = req.body.props ?? "";

  if (verifyEveryContact) {
    for (let i = 0; i < contactIds.length; i++) {
      let contactId = contactIds[i];
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
  try {
    const group = await globalThis.client.createGroup(title, contactIds);
    if (typeof group === "string") {
      db.insertOne({
        id: group,
        title: group,
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
      brandName,
      customerType,
      date1,
      date2,
      link1,
      link2,
      time,
      props,
      customers,
      messageType
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
  let numbers = (req.body.numbers as string[]) ?? [];
  numbers = numbers.map(formatNumber);
  numbers = numbers.filter(
    (number) => number !== globalThis.client.info.wid._serialized
    );
  const message: string = (req.body.message as string) ?? "";
  let chat: Chat;

  // when no numbers other than the admin's number is provided
  // return OK, cause the main number is already in the group
  if (numbers.length === 0) {
    res.status(200).send({
      data: {
        message: "OK",
      },
    });
    return;
  }

  try {
    chat = await globalThis.client.getChatById(id);
    if (!chat.isGroup) {
      res.status(400).send({
        error: {
          message: "chat is not a group!",
        },
      });
      return;
    }
  } catch {
    res.status(400).send({
      error: {
        message: "invalid `id`",
      },
    });
    return;
  }

  const group = chat as GroupChat;
  try {
    let result = await group.addParticipants(numbers, {
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
  let users = usersIds.map(formatNumber);
  users = users.filter((user) => user !== globalThis.client.info.wid._serialized);

  if (id === null || id === undefined || usersIds.length === 0) {
    res.status(400).send({
      error: {
        message: "invalid request. `id` and `users` required.",
      },
    });
    return;
  }

  try {
    const chat = await globalThis.client.getChatById(id);

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
