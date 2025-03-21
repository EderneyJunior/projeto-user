const express = require("express")
const app = express()
const router = require("./routes/routes")
const cors = require("cors")

app.use(cors)
 
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// parse application/json
app.use(express.json())

app.use(router);

app.listen(8686,() => {
    console.log("Servidor rodando na porta 8686!")
});
