import { Request, Response } from "express";

export class SCBController {
    static async webhookHandle(req: Request, res: Response) {
        try{
            // save to database
            // update database
            // send message to user
        } catch (e) {
            throw new Error('error with scb webhook')
        }
    }
}