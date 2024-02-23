import type { Request, Response } from "express";
import type { Contact } from "whatsapp-web.js";
import { formatNumber } from "../utils/formatter";

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

}

export async function setGroupAdmins(req: Request, res: Response): Promise<void> {
  
}
