import type { Request, Response } from "express";

export async function getMe(req: Request, res: Response): Promise<void> {
  const client = globalThis.client;
  const chats = await globalThis.client.getChats();
  const contacts = await globalThis.client.getContacts();
  res.status(200).send({
    me: client.info.wid,
    name: client.info.pushname,
    platform: client.info.platform,
    chats,
    contacts,
  });
}
