import express from 'express'

// route controllers
import mews from '../controllers/mews.controller.js'


// path: /api/v1/
const router = express.Router()

// path: /api/v1/mews
// method: GET, POSt
router.route('/')
    .get(mews.list)
    .post(mews.create)

// use to load MEWS by :mewsId param
router.param('mewsId', mews.mewsById)

// path: /api/v2/mews/r4nd0m1dh3r3
// methods: GET, PUT, DELETE
router.route('/:mewsId')
    .get(mews.read)
    .put(mews.update)
    .delete(mews.destroy)

export default router