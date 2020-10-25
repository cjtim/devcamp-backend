import { Request } from 'express'

interface IUser {
    userId: string
}
declare global {
    namespace Express {
        interface Request {
            user: IUser
        }
    }
}
