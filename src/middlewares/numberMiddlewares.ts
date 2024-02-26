import type { NextFunction, Request, Response } from 'express';

/**
 * Checks if the number is in the correct format, and formats it to be used by the whatsapp-web.js library
 * @param req The request object
 * @param res The response object
 * @param next The next function
 * @returns void
 */
export function numberFormater (req: Request, res: Response, next: NextFunction): void {
  let number = req.body.number as string ?? ''
  if (number === '') {
    res.status(400).send({
      error: {
        message: 'missing number on request body'
      }
    })
    return
  }

  number = number.replace(" ", "");
  
  // check if it's a group
  if (number.endsWith("@g.us")) { } 
  else {
    number = number.replace(/\+/g, '')
    if (!number.endsWith('@c.us')) {
      number += '@c.us'
    }
  }
  req.body.number = number;
  next()
}
