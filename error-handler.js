export default function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') return res.status(401).json(err)
    else return res.status(500).json({ message: 'Unknown error', err })
}