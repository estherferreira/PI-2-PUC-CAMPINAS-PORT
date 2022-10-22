const express = require("express");//esse é o servidor conectado ao oracle
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const oracledb = require("oracledb");
const { response } = require("express");
const app = express();
const PORT = 8080; // porta padrão 
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

//middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  app.use(cors());
  next();
});
//insere valares na tabela 
app.post("", (req,res)=>{
     var conn = inserirTicket()
    conn.execute("insert into tabela values (:id)", [req.body.id], {
        autoCommit: true,
      })
    console.log("gerou");console.log(req.body.id)
})
// essa é a função que conecta com o banco de dados 
async function inserirTicket() {
    try {
      const conn = await oracledb.getConnection({
        user: "SYSTEM",
        password: "oracle",
        connectionString: "Localhost",
      });
      return conn;
    } catch (err) {
      console.log(err);
    }}
    
    app.listen(8080) 
