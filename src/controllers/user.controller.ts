import { NextFunction, Request, Response } from 'express'
import { Users } from '../models/user'

export class UserController {
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await Users.findOrCreate({
                where: {
                    lineUid: req.user.userId,
                },
            })
            if (user[1]) {
                await user[0].update({
                    lineUid: req.user.userId,
                    name: 'ไม่มีชื่อ',
                    tel: 'กรุณาเพิ่มเบอร์โทร',
                })
            }
            res.json(user[0])
        } catch (e) {
            next(e)
        }
    }
    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await Users.findByPk(req.user.userId)
            await response.update(req.body)
            res.json(response)
        } catch (e) {
            next(e)
        }
    }
}
