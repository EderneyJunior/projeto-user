const User = require("../models/User")
const PasswordToken = require("../models/PasswordToken")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const secret = process.env.SECRET

class UserController{

    async index(req, res){
        try {
            const users = await User.findAll()

            return res.json(users)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async findUser(req, res){
        const { id } = req.params

        if(isNaN(id)){
            return res.status(400).json({ message: "O id não é válido!"})
        }
        try {
            const user = await User.findById(id)

            if(!user){
                return res.status(404).json({})
            }
            return res.json(user)
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async create(req, res){
        const { name, email, password } = req.body

        if (!name || name.replace(/\s/g, '').length == 0){
            return res.status(400).json({ message: "Nome invalido!" })
        }

        if (!email || email.replace(/\s/g, '').length == 0) {
            return res.status(400).json({ message: "E-mail invalido!" })
        }

        if (!password || password.replace(/\s/g, '').length == 0) {
            return res.status(400).json({ message: "Senha invalida!" })
        }

        try {
            if(await User.findEmail(email)){
                return res.status(406).json({ message: "O e-mail já está cadastrado!" })
            }

            await User.create(name, email, password )

            return res.status(201).send()
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async edit(req, res){
        const { id } = req.params
        const { name, email, role } = req.body

        if (isNaN(id)) {
            return res.status(400).json({ message: "O id não é válido!" })
        }

        if (name != undefined && name.replace(/\s/g, '').length == 0) {
            return res.status(400).json({ message: "Nome invalido!" })
        }

        if (email != undefined && email.replace(/\s/g, '').length == 0) {
            return res.status(400).json({ message: "E-mail invalido!" })
        }

        try {
            const result = await User.update(id, name, email, role)

            if(!result.status){
                return res.status(400).json(result.message)
            }

            return res.json({ message: "Tudo OK!"})
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async remove(req, res){
        const { id } = req.params

        if(isNaN(id)){
            return res.status(400).json({ message: "O id não é válido!" })
        }

        try {
            const result = await User.delete(id)

            if(!result.status){
                return res.status(400).json({ message: result.message })
            }

            return res.json({ message: "Tudo OK!" })
        } catch (error) {
            return error
        }
    }

    async recoverPassword(req, res){
        const { email } = req.body

        if (!email || email.replace(/\s/g, '').length == 0) {
            return res.status(400).json({ message: "E-mail invalido!" })
        }

        try {
            const result = await PasswordToken.create(email)

            if(!result.status){
                return res.status(400).json(result.message)
            }

            return res.json({ token: result.token.toString() })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async changePassword(req, res){
        const { token, password } = req.body

        try {
            const isTokenValid = await PasswordToken.validate(token)

            if(!isTokenValid.status){
                return res.status(400).json({ message: "Token Inválido!" })
            }

            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)

            return res.json({ message: "Senha alterada!" })
        } catch (error) {
            return res.status(500).json(error)
        }
    }

    async login(req, res){
        const { email, password } = req.body

        try {
            const user = await User.findByEmail(email)

            if(!user){
                res.status(401).json({ message: "Usuario não encontrado!" })
            }

            if(!await bcrypt.compare(password, user.password)){
                return res.status(401).json({ message: "Senha Incorreta!" })
            }

            const token = jwt.sign({ email: user.email, role: user.role}, secret, { expiresIn: '24h' })

            return res.json({ token })
            
        } catch (error) {
            return res.status(500).json(error)
        }
    }
}

module.exports = new UserController()