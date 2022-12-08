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
			console.log('Não foi possível estabelecer conexão com o banco_de_dados!');
			process.exit(1);
		}

		return global.conexao;
	}

	this.estrutureSe = async function ()
	{
		try//cria tabela para o insert do bilhete
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
	
		try//cria tabela para o insert da recarga
		{
			const conexao = await this.getConexao();
			const sqlr     = 'CREATE TABLE RECARGA(COD_RECARGA NUMBER(6, 0) CONSTRAINT RECARGA_PK PRIMARY KEY,'+
			'TIPO VARCHAR2(20), DATA_RECARGA DATE,  HORA_RECARGA VARCHAR2(8),'+
			'VALOR_RECARGA NUMBER(5, 2), FK_ID_BILHETE NUMBER (6, 0),'+
			'FOREIGN KEY (FK_ID_BILHETE) REFERENCES BILHETE (ID_USUARIO_BILHETE))';
			await conexao.execute(sqlr);
			console.log('Tabela criada Recarga!')
		}
		catch (erro)
		{}
	}
}
//-------------------------------------------------------------------------⬇️ insert Bilhete
function BILHETE (bd)//conexão com o bd sendo passada por parametro
{
	this.bd = bd;
	
	this.inclua = async function (Bilhete)//organiza os dados neste comando p/ ser executado no banco de dados  
	{
		const sql1 = "INSERT INTO BILHETE VALUES (:0,:1,:2)";
		const dados = [( parseInt(Bilhete.cdb)),( Bilhete.horacri),( Bilhete.datacri)];
	
		console.log(sql1, dados);
		await conexao.execute(sql1, dados);
		
		const sql2 = 'COMMIT';
		await conexao.execute(sql2);	
	}	
}	

function Bilhete (id)//adiciona dados como data e hora para ser enviados no comando acima
{
	this.cdb = id;//codigo do bilhete 
	this.datacri = new Date().toLocaleDateString();//data
	this.horacri = new Date().toLocaleTimeString();//hora
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
    const Bilhetecriado = new Bilhete (req.body.id);//requisição do codigo do bilhete e passando para a função Bilhete que está logo acima
    try
    {
        await  global.Bilhetes.inclua(Bilhetecriado);//global..é conexão com o banco de dados e inclua é a função que faz o insert
		console.log('Insert do Bilhete concluído!!!');//insert concluido exibe no terminal a mensagem
	}
	catch (err)//pego o erro 
	{
		console.log('Erro no incluir');//avisa no terminal que deu erro
		console.log(err)//exibe no terminal o erro
    }
}
//-------------------------------------------------------------------------⬇️ insert Recarga
function RECARGA (bd)
{
	this.bd = bd;
	
	this.inserir_recarga = async function (Recarga)//reuni os dados no comando para ser executado no bd 
	{

		const sql3 = "INSERT INTO RECARGA VALUES (:0,:1,:2,:3,:4,:5)";
		const dados2 = [(parseInt(Recarga.cdr)),(Recarga.tipo),(Recarga.datacri),
			(Recarga.horacri),(Recarga.valor),(parseInt(Recarga.cdb))];
	
		console.log(sql3, dados2);
		await conexao.execute(sql3, dados2);//excuta o comando no bd
		
		const sql4 = 'COMMIT';
		await conexao.execute(sql4);//comita as informações
	}	

    this.recupereUm = async function (code)
	{
		const conexao = await this.bd.getConexao();
		
		const sql = "SELECT COD_RECARGA,TIPO,TO_CHAR(DATA_RECARGA, 'DD/MM/YYYY') "+
		            "FROM RECARGA WHERE FK_ID_BILHETE=:0";
		const dados = [code];
		ret =  await conexao.execute(sql,dados);
		
		return ret.rows;
	}
}

async function inclusaoRec (req,res)
{
    const Recarga_escolhida = new Recarga (req.body.tipo, req.body.cdb);//requisição do tipo do bilhete e o codigo do bilhete
    try
    {	
        await  global.Recargas.inserir_recarga(Recarga_escolhida);//conexão com bd e a função para 
		const  sucesso = new Comunicado('Insert da Recarga concluído!');//exibe no terminal se ocorreu com o sucesso o insert da recarga
		return res.status(201).json(sucesso);//retorna para o front se deu certo o insert da recarga
	}
	catch (err)//retorno do try caso de erro
	{
		console.log('Erro no incluir da recarga');//exibe no terminal 
		console.log(err)//exibe no terminal o erro 
		const  erro2 = new Comunicado ('O número do Bilhete digitado não é valido');//texto que será enviado p o front
        return res.status(409).json(erro2);// retorna p o front a mensagem acima
    }
}

function createRandomNumber() {//função p gerar numeros aleatorio
    const randomNumber = (Math.random() * (1000000 - 100000) + 100000).toFixed(0);
    return randomNumber;
}

function Recarga(tipo,cdb)//tipo do bilhete e codigo do bilhete como parametro
{
	console.log(cdb);

	switch(tipo) //para inserir os dados do tipo e o valor do bilhete
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

		case 'Bilhete 7 dias - R$14,40':
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

	this.cdb = cdb;//codigo do bilhete
	this.datacri = new Date().toLocaleDateString();//data da recarga"dd mm yyyy"
	this.horacri = new Date().toLocaleTimeString();//hora da recarga
	this.cdr = createRandomNumber();//chama a função para criar um numero aleatorio p o codigo da recarga
}

function Comunicado (mensagem)
{
	this.mensagem  = mensagem;//p mandar mensagens no para o front
}

//-------------------------------------------------------------------⬇️Ativação do Bilhete
function Recharge(tipo)//function Recharge(cdr,tipo,data)

{
	//this.cdr=cdr;
	this.tipo=tipo;
	//this.data=data;
}
 
async function list (req, res)
{
	const code = req.params.code;

    let rec;
	try
	{
	    rec = await global.Recargas.recupereUm(code);
	}    
    catch(erro)
    {}

	if (rec.length==0)
	{
		return res.status(200).json([]);
	}
	else
	{
		const ret=[];
		for (i=0;i<rec.length;i++) ret.push (new Recharge (/*rec[i][0],*/rec[i][1]/*,rec[i][2]*/));
		return res.status(200).json(ret);
	}
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
    app.post  ('/Bilhete'       , inclusao); 
	app.post  ('/Recarga'       , inclusaoRec);
	app.get   ('/Recarga/:code' , list);

    console.log ('Servidor ativo na porta 3000');
    app.listen(3000);
}
server();
//--------------------------------------------------------------------------------------------------------------------
/*

        //cria tabela ativação 
		try
		{
			const conexao = await this.getConexao();
			const sqlr    = 'CREATE TABLE ATIVACAO(COD_ATIVACAO NUMBER(6, 0) CONSTRAINT ATIVACAO_PK PRIMARY KEY,'+
			'TIPO VARCHAR2(20), DATA_ATIVACAO DATE,  HORA_ATIVACAO VARCHAR2(8),'+
			'VALOR_ATIVACAO NUMBER(5, 2), FK_ID_BILHETE NUMBER (6, 0),'+
			'FOREIGN KEY (FK_ID_BILHETE) REFERENCES BILHETE (ID_USUARIO_BILHETE))';
			await conexao.execute(sqlr);
			console.log('Tabela criada ativação!')
		}
		catch (erro)
		{}

		try
		{
			const conexao = await this.getConexao();
			const sqlr    = 'CREATE TABLE UTILIZACAO(COD_UTILIZACAO NUMBER(6, 0) CONSTRAINT UTILIZACAO_PK PRIMARY KEY,'+
			'TIPO VARCHAR2(20), DATA_UTILIZACAO DATE,  HORA_UTILIZACAO VARCHAR2(8),'+
			'VALOR_UTILIZACAO NUMBER(5, 2), FK_ID_BILHETE NUMBER (6, 0))';
			await conexao.execute(sqlr);
			console.log('Tabela criada de utilização!')
		}
		catch (erro)
		{}


//----------------------------------------------------------AQUI VAI SER A UTILIZAÇÃO 
function activationRec() {
  const tipo = document.querySelector(".MUDAR ISSO AQUI").innerText;

  let objAtivacao = { cdr:cdr };
  let url = `http://localhost:3000/`;

  let res = axios
    .post(url, objRecarga)
}

function activThisShit (bd)//conexão com o bd sendo passada por parametro
{
	this.bd = bd;
	
	this.inclua = async function (Ativado)//organiza os dados neste comando p/ ser executado no banco de dados  
	{
		const sql1 = "INSERT INTO BILHETE VALUES (:0,:1,:2)";
		const dados = [( parseInt(Bilhete.cdb)),( Bilhete.horacri),( Bilhete.datacri)];
	
		console.log(sql1, dados);
		await conexao.execute(sql1, dados);
		
		const sql2 = 'COMMIT';
		await conexao.execute(sql2);	
	}	
}	

function Ativado (id)//adiciona dados como data e hora para ser enviados no comando acima
{
	this.cdb = id;//codigo do bilhete 
	this.datacri = new Date().toLocaleDateString();//data
	this.horacri = new Date().toLocaleTimeString();//hora
}	

async function incluAtivado (req, res)
{
    const recAtivada = new Ativado (req.body.id);//requisição do codigo do bilhete e passando para a função Bilhete que está logo acima
    try
    {
        await  global.Bilhetes.inclua(recAtivada);//global..é conexão com o banco de dados e inclua é a função que faz o insert
		console.log('Insert do Bilhete concluído!!!');//insert concluido exibe no terminal a mensagem
	}
	catch (err)//pego o erro 
	{
		console.log('Erro no incluir');//avisa no terminal que deu erro
		console.log(err)//exibe no terminal o erro
    }
}




//------------------------------------------------------AQUI VAI SER A UTILIZAÇÃO 
function utilizRec() {
  const cdb = document.querySelector(".MUDAR ISSO AQUI").innerText;//pegar o numero do bilhete

  let objUtilizar = { cdb:cdb };
  let url = `http://localhost:3000/`;

  let res = axios
    .post(url, objUtilizar)
}



function UTILIZADOS (bd)//conexão com o bd sendo passada por parametro
{
	this.bd = bd;
	
	this.inclua = async function (UsedShit)//organiza os dados neste comando p/ ser executado no banco de dados  
	{
		const sql1 = "INSERT INTO UTILIZADOS VALUES (:0,:1,:2)";
		const dados = [( parseInt(Bilhete.cdb)),( Bilhete.horacri),( Bilhete.datacri)];
	
		console.log(sql1, dados);
		await conexao.execute(sql1, dados);
		
		const sql2 = 'COMMIT';
		await conexao.execute(sql2);	
	}	
}	

function usedShit (id)//adiciona dados como data e hora para ser enviados no comando acima
{
	this.cdb = id;//codigo do bilhete 
	this.datacri = new Date().toLocaleDateString();//data
	this.horacri = new Date().toLocaleTimeString();//hora
}	

async function UseTicket (req, res)
{
    const UsedTicked = new usedShit (req.body.id);//requisição do codigo do bilhete e passando para a função Bilhete que está logo acima
    try
    {
        await  global.Bilhetes.inclua(UsedTicked);//global..é conexão com o banco de dados e inclua é a função que faz o insert
		console.log('Insert da utização concluida!!!');//insert concluido exibe no terminal a mensagem
	}
	catch (err)//pego o erro 
	{
		console.log('Erro no incluir da utili...');//avisa no terminal que deu erro
		console.log(err)//exibe no terminal o erro
    }
}

 */

