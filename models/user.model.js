import mongoose from 'mongoose'
import crypto from 'crypto'
import { config } from 'dotenv'

config()
const SALT = process.env.SALT

// username rules
// allowed: _ a-z A-Z 0-9
// reject: *bot
const re_username = /^(?=.{4,20}$)(?!.*_{2})[a-zA-Z0-9_]+(?<!bot)$/

// password rules
// Yike, I can't

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        match: [re_username, 'Please choose a valid username'],
        required: 'Username can\'t be blank'
    },
    hashed_password: {
        type: String,
        required: 'Hashed password is, somehow.. missing'
    },
    about: String,
    karma: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

UserSchema
    .virtual('password')
    .set(function (pwd) {
        this.raw_password = pwd
        this.hashed_password = this.encryptPassword(pwd)
    })
    .get(function () {
        return this.raw_password
    })

UserSchema.path('hashed_password').validate(function (v) {
    if (this.raw_password && this.raw_password.length < 4) this.invalidate('password', 'password should be longer than 4, no MUST')
    if (this.isNew && !this.raw_password) this.invalidate('password', 'No password tho')
}, null)

UserSchema.methods = {
    authenticate: function (pwd) {
        return this.encryptPassword(pwd) === this.hashed_password
    },
    encryptPassword: function (pwd) {
        return crypto
            .createHmac('sha1', SALT)
            .update(pwd)
            .digest('hex')
    }
}

export default mongoose.model('User', UserSchema)
