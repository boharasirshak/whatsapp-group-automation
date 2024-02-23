import { type NextFunction, type Request, type Response } from 'express'

export const basicErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(`[ERROR]: ${err.name} ${err.message}`)
  res.status(500).send({
    error: {
      name: err.name,
      message: err.message
    }
  })
}
