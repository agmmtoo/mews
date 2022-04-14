export default function (err, req, res, next) {
    // express-jwt error
    if (err.name === 'UnauthorizedError') return res.status(401).json(err)

    // malformed request json error
    if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'perhaps malformed json request?', err })
    else return res.status(500).json({ message: 'Unknown error', err })
}