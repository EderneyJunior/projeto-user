const knex = require("../database/connection")
const User = require("./User")

class PasswordToken{
    async create(email){
        try {
            const user = await User.findByEmail(email)

            if(!user){
                return { status: false, message: "O e-mail passado não existe no banco de dados!" }
            }

            const token = Date.now()

            await knex("passwordtokens").insert({
                user_id: user.id,
                used: 0,
                token
            })

            return { status: true, token }
        } catch (error) {
            return error
        }
    }

    async validate(token){
        try {
            const result = await knex("passwordtokens").where({ token }).select("*")

            if(result.length == 0){
                return { status: false }
            }

            const tk = result[0]

            if(tk.used > 0){
                return { status: false }
            }

            return { status: true, token: tk }
        } catch (error) {
            return error
        }
    }

    async setUsed(token){
        try {
            await knex("passwordtokens").where({ token }).update({ used: 1 })
        } catch (error) {
            return error
        }
    }
}

module.exports = new PasswordToken()