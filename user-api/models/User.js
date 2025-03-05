const knex = require("../database/connection")
const bcrypt = require("bcrypt")
const PasswordToken = require("./PasswordToken")

class User{
    async findAll() {
        try {
            const users = await knex("users").select(["id", "name", "email", "role"])
            return users
        } catch (error) {
            return []
        }
    }

    async findById(id){
        try {
            const user = await knex("users").where({ id }).select(["id", "name", "email", "role"])
            if(user.length == 0){
                return undefined
            }
            return user[0]
        } catch (error) {
            return undefined
        }
    }

    async findByEmail(email) {
        try {
            const user = await knex("users").where({ email }).select("*")
            if (user.length == 0) {
                return undefined
            }
            return user[0]
        } catch (error) {
            return undefined
        }
    }

    async findEmail(email) {
        try {
            const user = await knex("users").where({ email }).select("*")

            if (user.length > 0) {
                return true
            }

            return false

        } catch (error) {
            return error
        }
    }

    async create(name, email, password){
        try {
            const hash = await bcrypt.hash(password, 10)
            const newUser = await knex("users")
                .insert({ name, email, password: hash, role: 0 })
        } catch (error) {
            return error
        }
    }

    async update(id, name, email, role){
        try {
            const userById = await this.findById(id)

            if(!userById){
                return { status: false, message: "Usuario não existe!" }
            }

            const editUser = {}

            if(email!= undefined && userById.email != email){
                const userByEmail = await this.findEmail(email)
                if(userByEmail){
                    return { status: false, message: "O e-mail já está cadastrado!" }
                }
            }

            if(role != undefined && isNaN(role)){
                return { status: false, message: "Profissão inválida!" }
            }
            editUser.email = email
            editUser.role = role
            editUser.name = name

            await knex("users").where({ id }).update({ name, email, role })
            return { status: true }
        } catch (error) {
            return error
        }
    }

    async delete(id){
        try {
            const user = await this.findById(id)

            if (user == undefined) {
                return { status: false, message: "Usuario não existe" }
            }

            await knex("users").where({ id }).delete()

            return { status: true }
        } catch (error) {
            return error
        }
    }

    async changePassword(newPassword, id, token){
        try {
            const hash = await bcrypt.hash(newPassword, 10)
            await knex("users").where({ id }).update({ password: hash })
            await PasswordToken.setUsed(token)
        } catch (error) {
            return error
        }
    }
}

module.exports = new User()