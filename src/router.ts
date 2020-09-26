import { Request, Response, Router } from 'express'

const router = Router({ strict: true })

router.get('/', hi)

function hi(req: Request, res: Response) {
    res.send('Hi!')
}
export default router
