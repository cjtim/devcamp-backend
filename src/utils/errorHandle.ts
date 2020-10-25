import { Response } from "express"

export const errorHandle = (err: any, req: any, res: Response, next: any) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status(400).send({
        status: err.message
    })
}
