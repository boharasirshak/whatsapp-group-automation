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

export async function isRegisteredNumber(req: Request, res: Response): Promise<void> {
  const { number } = req.body;
  const client = globalThis.client;
  try {
    const response = await client.isRegisteredUser(number);
    res.status(200).send({ data: { valid: response } });
  } catch {
    res.status(404).send({ error: { message: "not a registered number on whatsapp." } });
  }
}

export async function getFormattedNumber(req: Request, res: Response): Promise<void> {
  const query = req.body || req.query || req.params;
  let number = query.number! as string;
  const client = globalThis.client;
  number = number.replace('+', '');
  try {
    const response = await client.getNumberId(number);
    if (!response) {
      res.status(404).send({ error: { message: "Invalid number" } });
      return;
    }
    res.status(200).send({ data: { number: response?._serialized } });
    return;
  } catch {
    res.status(404).send({ error: { message: "Invalid number" } });
  }
}
