import { NextFunction, Response } from 'express'
// not in use :(
export const requestHandle = (controller: any) => async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await controller(req, res, next)
        if (!res.headersSent) {
            res.status(200).send({
                status: 'ok',
                data: response,
            })
        }
    } catch (e) {
        next(e)
    }
}
