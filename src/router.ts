import { Request, Response, Router } from 'express'
const router = Router({ strict: true, caseSensitive: true })

router.get('/', hi)
router.post('/', hi)

function hi(req: Request, res: Response) {
    if (JSON.stringify(req.body) === '{}') res.send('No req.body :(')
    res.send(req.body)
}

export default router
