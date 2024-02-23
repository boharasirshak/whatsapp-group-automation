import type { NextFunction, Request, Response } from 'express'

/**
 * Checks if the client is ready to be used
 * @param req express request
 * @param res express response
 * @param next express next function
 * @returns void
 */
export function isClientReady (req: Request, res: Response, next: NextFunction): void {
  if (!globalThis.IS_AUTHENTICATED) {
    res.status(401).send({
      error: {
        message: 'Client is not authenticated'
      }
    })
    return
  }
  if (!globalThis.IS_READY) {
    res.status(401).send({
      error: {
        message: 'Client is not ready'
      }
    })
    return
  }
  next()
}
