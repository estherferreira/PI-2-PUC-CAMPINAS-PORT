const bodyParser = require('body-parser');
const { Console } = require('console');
//-------------------------------------⬇️ Conexão com o Banco de Dados e criação das tabelas
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
			const sql     = 'CREATE TABLE BILHETE (ID_USUARIO_BILHETE NUMBER(6)'+
			'CONSTRAINT PK_ID_USUARIO_BILHETE PRIMARY KEY,'+
			'HORA_CRIACAO VARCHAR2(8),'+
			'DATA_CRIACAO DATE)';
			await conexao.execute(sql);
			console.log('Tabela Bilhete!')
		}
		catch (erro)
		{} 
	
		try
		{
			const conexao = await this.getConexao();
			const sql     = 'CREATE TABLE RECARGA(COD_RECARGA NUMBER(6, 0) CONSTRAINT RECARGA_PK PRIMARY KEY,'+
			'TIPO VARCHAR2(20), DATA_RECARGA DATE,  HORA_RECARGA VARCHAR2(8),'+
			'VALOR_RECARGA NUMBER(5, 2), FK_ID_BILHETE NUMBER (6, 0),'+
			'FOREIGN KEY (FK_ID_BILHETE) REFERENCES BILHETE (ID_USUARIO_BILHETE))';
			await conexao.execute(sql);
			console.log('Tabela criada Recarga!')
		}
		catch (erro)
		{}
	}
}
//-------------------------------------------------------------------------⬇️ insert Bilhete
function BILHETE (bd)
{
	this.bd = bd;
	
	this.inclua = async function (Bilhete)
	{
		const sql1 = "INSERT INTO BILHETE VALUES (:0,:1,:2)";
		const dados = [( parseInt(Bilhete.cdb)),( Bilhete.horacri),( Bilhete.datacri)];
	
		console.log(sql1, dados);
		await conexao.execute(sql1, dados);
		
		const sql2 = 'COMMIT';
		await conexao.execute(sql2);	
	}	
}	

function Bilhete (id)
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

async function inclusao (req, res)
{
    const Bilhetecriado = new Bilhete (req.body.id);
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
//-------------------------------------------------------------------------⬇️ insert Recarga
function RECARGA (bd)
{
	this.bd = bd;
	
	this.inserir_recarga = async function (Recarga)
	{

		const sql3 = "INSERT INTO RECARGA VALUES (:0,:1,:2,:3,:4,:5)";
		const dados2 = [(parseInt(Recarga.cdr)),(Recarga.tipo),(Recarga.datacri),
			(Recarga.horacri),(Recarga.valor),(parseInt(Recarga.cdb))];
	
		console.log(sql3, dados2);
		await conexao.execute(sql3, dados2);
		
		const sql4 = 'COMMIT';
		await conexao.execute(sql4);	
	}	
}

async function inclusaoRec (req,res)
{
    const Recarga_escolhida = new Recarga (req.body.tipo, req.body.cdb);
    try
    {	
        await  global.Recargas.inserir_recarga(Recarga_escolhida);
		const  sucesso = new Comunicado('Insert da Recarga concluído!');
		return res.status(201).json(sucesso);
	}
	catch (err)
	{
		console.log('Erro no incluir da recarga');
		console.log(err)
		const  erro2 = new Comunicado ('O número do Bilhete digitado não é valido');
        return res.status(409).json(erro2);
    }
}

function createRandomNumber() {
    const randomNumber = (Math.random() * (1000000 - 100000) + 100000).toFixed(0);
    return randomNumber;
}

function Recarga(tipo,cdb)
{
	console.log(cdb);

	switch(tipo) 
	{
		case 'Bilhete Único - R$3,10':
			console.log('Bilhete escolhido tipo unico');
			this.tipo = 'Unico';
			this.valor = 3.1 ;
		break;

		case 'Bilhete Duplo - R$7,20':
			console.log('Bilhete escolhido tipo duplo');
			this.tipo = 'Duplo';
			this.valor = 7.2 ;
		break;

		case 'Bilhete 7 dias - R$14,39':
			console.log('Bilhete escolhido tipo 7dias');
			this.tipo = '7 Dias';
			this.valor = 14.4 ;
		break;

		case 'Bilhete 30 dias - R$35,50':
			console.log('Bilhete escolhido tipo 30dias');
			this.tipo = '30 Dias';
			this.valor = 35.5;
		break;
	}

	this.cdb = cdb;
	this.datacri = new Date().toLocaleDateString();
	this.horacri = new Date().toLocaleTimeString();
	this.cdr = createRandomNumber();
}

function Comunicado (mensagem)
{
	this.mensagem  = mensagem;
}
//-------------------------------------------------------------------------------⬇️ Servidor
async function server ()
{
    const bd = new banco_de_dados ();
	await bd.estrutureSe();
    global.Bilhetes = new BILHETE (bd);
	global.Recargas = new RECARGA (bd);

    const express = require('express');
    const app = express();
	const cors = require('cors')
	const fs = require("fs");
	const { response } = require("express");
	const PORT = 3000;

    app.use(express.json());   
	app.use(cors()); 
    app.use(middleWareGlobal);
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Origin", "*");
		app.use(cors());
		next();
	  });
    app.post  ('/Bilhete'        , inclusao); 
	app.post  ('/Recarga'        , inclusaoRec);
    console.log ('Servidor ativo na porta 3000');
    app.listen(3000);
}
server();
