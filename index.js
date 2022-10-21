const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const oracledb = require("oracledb");
const { response } = require("express");
const app = express();
const PORT = 8080;
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
app.post("", (req,res)=>{
     var conn = inserirTicket()
    conn.execute("insert into tabela values (:id)", [req.body.id], {
        autoCommit: true,
      })
    console.log("gerou");console.log(req.body.id)
})

async function inserirTicket() {
    try {
      const conn = await oracledb.getConnection({
        user: "ebd1es822109",
        password: "Yqejp2",
        connectionString: "CEATUDB02",
      });
      return conn;
    } catch (err) {
      console.log(err);
    }}
    
    app.listen(8080) //no final do codigo
