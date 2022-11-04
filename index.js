const bodyParser = require('body-parser');
const { Console } = require('console');

function banco_de_dados ()
{
	process.env.ORA_SDTZ = 'UTC-3'; // garante horário de Brasília
	
	this.getConexao = async function ()
	{
		if (global.conexao)
			return global.conexao;

        const oracledb = require('oracledb');
        const dbConfig = require('./dbconfig.js');
        
        try
        {
		    global.conexao = await oracledb.getConnection(dbConfig);
		}
		catch (erro)
		{
			console.log ('Não foi possível estabelecer conexão com o banco_de_dados!');
			process.exit(1);
		}

		return global.conexao;
	}

	this.estrutureSe = async function ()
	{
		try
		{
			const conexao = await this.getConexao();
			const sql     = 'CREATE TABLE BILHETE (ID_USUARIO_BILHETE NUMBER(6)CONSTRAINT PK_ID_USUARIO_BILHETE PRIMARY KEY,'+
			'HORA_CRIACAO NVARCHAR2(8),'+
			'DATA_CRIACAO DATE)';
			await conexao.execute(sql);
			console.log('Tabela criada!')
		}
		catch (erro)
		{} // se a já existe, ignora e toca em frente
	}
}

function BILHETE (bd)
{
	this.bd = bd;
	
	this.inclua = async function (Bilhete)
	{

		const sql1 = "INSERT INTO BILHETE VALUES (:0,:1,:2)";
		const dados = [( parseInt(Bilhete.cdb)),( Bilhete.horacri),( Bilhete.datacri)];
	
	
		console.log(sql1, dados);
		await conexao.execute(sql1, dados);//
		
		const sql2 = 'COMMIT';
		await conexao.execute(sql2);	
	}	
}	


function Bilhete (id,datac,horac)
{
	    this.cdb = id;
	    this.datacri = new Date().toLocaleDateString();
	    this.horacri = new Date().toLocaleTimeString();
}

function middleWareGlobal (req, res, next)
{
    console.time('Requisição'); // marca o início da requisição
    console.log('Método: '+req.method+'; URL: '+req.url); // retorna qual o método e url foi chamada

    next(); // função que chama as próximas ações

    console.log('Finalizou'); // será chamado após a requisição ser concluída

    console.timeEnd('Requisição'); // marca o fim da requisição
}

// para a rota de CREATE
async function inclusao (req, res)
{
    const Bilhetecriado = new Bilhete (req.body.id,req.body.datac,req.body.horac);
    try
    {
        await  global.Bilhetes.inclua(Bilhetecriado);
		console.log('Insert do Bilhete concluído!!!');
	}
	catch (err)
	{
		console.log('Erro no incluir');
		console.log(err)
    }
}

async function server ()
{
    const bd = new banco_de_dados ();
	await bd.estrutureSe();
    global.Bilhetes = new BILHETE (bd);

    const express = require('express');
    const app     = express();
	const cors    = require('cors')
    const bodyParser = require("body-parser");
	const fs = require("fs");
	const { response } = require("express");
	const PORT = 3000;

    app.use(express.json());   // faz com que o express consiga processar JSON
	app.use(cors()); //habilitando cors na nossa aplicacao (adicionar essa lib como um middleware da nossa API - todas as requisições passarão antes por essa biblioteca).
    app.use(middleWareGlobal); // app.use cria o middleware global
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		app.use(cors());
		next();
	  });

    app.post  ('/Bilhete'        , inclusao); 

    console.log ('Servidor ativo na porta 3000')
    app.listen(3000);
}

server();
