import type { Request, Response } from 'express'

export default async function (req: Request, res: Response) {
  return res.status(204).end()
}
