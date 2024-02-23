import type { NextFunction, Request, Response } from 'express'

/**
 * Checks if the message is in the correct format and length
 * @param req The request object
 * @param res The response object
 * @param next The next function
 * @returns void
 */
export function messageLengthCheck (req: Request, res: Response, next: NextFunction): void {
  const message = req.body.message as string ?? ''

  if (message.length === 0) {
    res.status(400).send({
      error: 'message is empty'
    })
    return
  }

  if (message.length > 4096) {
    res.status(400).send({
      error: 'message is too long. Max length is 4096 characters'
    })
    return
  }
  next()
}
