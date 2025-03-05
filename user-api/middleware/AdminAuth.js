const jwt = require("jsonwebtoken")

module.exports = async (req, res, next) => {
    const authtoken = req.headers["authorization"]

    if(!authtoken){
        return res.status(401).json({ message: "Usuario não autorizado!" })
    }

    const token = authtoken.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        
        if(decoded.role == 0){
            return res.status(401).json({ message: "Você não tem permissão para isso!" })
        }
        next()
    } catch (error) {
        return error
    }
}