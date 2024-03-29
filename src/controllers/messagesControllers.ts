import type { Request, Response } from "express";
import { formatNumber } from "../lib/formatter";
import { sendContacts, sendMessage } from "../lib/messages";

export async function sendTextMesage(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await sendMessage({
      client: globalThis.client,
      chatId: req.body.number ?? "",
      message: req.body.message ?? "",
    });
    res.status(200).send({
      data: result,
    });
  } catch (e) {
    res.status(500).send({
      error: {
        message: "failed to send message",
      },
    })
  }
}

export async function sendContactMessage(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.body.number ?? "";
  const contactIds = req.body.contacts ?? [];
  const contacts = [];

  if (contactIds.length === 0) {
    res.status(400).send({
      error: {
        message: "empty body parameter `contacts`. please add some value"
      }
    })
    return
  }
  
  try {
    for (let i = 0; i < contactIds.length; i++) {
      try {
        let cId = contactIds[i];
        cId = formatNumber(cId);
        const contact = await globalThis.client.getContactById(cId);
        contacts.push(contact);
      } 
      catch {}
    }

    if (contacts.length === 0) {
      res.status(400).send({
        error: {
          message: "invalid request. `contacts` must have at least one valid number."
        }
      })
      return
    }
    const result = await sendContacts({
      client: globalThis.client,
      chatId: id,
      contacts: contacts,
    });
    res.status(200).send({
      data: result,
    });
    return;
  } catch {
    res.status(500).send({
      error: {
        message: "failed to send contact as message",
      },
    });
  }
}

// implement other routes as required
