//-----------------Primeira Entrega-------------------------------

//Gera um número aleatorio para o Bilhete
function createRandomNumber() {
  const randomNumber = (Math.random() * (1000000 - 100000) + 100000).toFixed(0);
  return randomNumber;
}
//Exibe o código do bilhete para o usuário
function showId() {
  let visor = document.getElementById("numrandomid");
  let numberrand = createRandomNumber();
  visor.innerHTML = `<button type="button" class="white-elements numberandom" name="numberandom" id="numrandomid">Seu bilhete: ${numberrand}
  </button>`;
  return numberrand;
}
//Verifica se a checkbox está marcada e permite que usuário gere o código do seu bilhete caso esteja
function toggleButton() {
  const checkbox = document.querySelector("#checkbox").checked;

  if (checkbox) {
    document.querySelector("#generate").disabled = false;
    if (generate == false) {
      showId();
    }
    return;
  }
  document.querySelector("#generate").disabled = true;
}
// Envia o Bilhete para o backend
function cadastraBilhete() {
  let id = showId();

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:3000/Bilhete", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send(
    JSON.stringify({
      id: id,
    })
  );
}

//-----------------------Segunda Entrega-------------------------------

// Limita o input a numeros e somente 6 digitos e
window.onload = function () {
  document
    .getElementById("ticketCodeField")
    .addEventListener("keyup", function (e) {
      this.value = this.value.replace(/[^0-9]/g, "");
      let i = document.getElementById("ticketCodeField").value;
      var cond = i.length;
      if (cond <= 6) {
        handleChange(); //chama a funcao que confere se tudo foi devidamente preenchido
      }
    });
};
// Seleciona as modalidades de bilhetes
const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach((dropdown) => {
  const select = dropdown.querySelector(".select");
  const caret = dropdown.querySelector(".caret");
  const menu = dropdown.querySelector(".menu");
  const options = dropdown.querySelectorAll(".menu li");
  const selected = dropdown.querySelector(".selected");

  select.addEventListener("click", () => {
    select.classList.toggle("select-clicked");
    caret.classList.toggle("caret-rotate");
    menu.classList.toggle("menu-open");
  });

  options.forEach((option) => {
    option.addEventListener("click", () => {
      selected.innerText = option.innerText;
      select.classList.remove("select-clicked");
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");
      options.forEach((option) => {
        option.classList.remove("active");
      });
      option.classList.add("active");
      handleChange();
    });
  });
});
//Mensagem "Compra efetuada!"
function showMessageSuccess() {
  let message = document.getElementById("successMessage");
  message.innerHTML = `<p id="successMessage" class="success">Compra efetuada!</p>`;
}
//Mensagem "Bilhete inválido digite novamente!"
function showMessageError() {
  let message = document.getElementById("successMessage");
  message.innerHTML = `<p id="successMessage" class="error">Bilhete inválido digite novamente!</p>`;
  document.getElementById("ticketCodeField").value = "";
}
//Função para ativar o botão do bilhete
function handleChange() {
  const ticketCode = document.querySelector("#ticketCodeField").value.length;
  const ticketType = document.querySelector(".selected").innerText;
  if (ticketCode >= 6 && ticketType != "Escolher modalidade") {
    document.querySelector("#buyTicketButton").disabled = false;
  } else {
    document.querySelector("#buyTicketButton").disabled = true;
  }
}
// Envia para o Backend a recarga do Bilhete
function recarregaBilhete() {
  const cdb = document.getElementById("ticketCodeField").value;
  const tipo = document.querySelector(".selected").innerText;
  // cdb : codigo do bilhete do usuario
  // tipo : tipo do bilhete escolhido
  let objRecarga = { cdb: cdb, tipo: tipo };
  let url = `http://localhost:3000/Recarga/`;

  let res = axios
    .post(url, objRecarga)
    .then((response) => {
      if (response.data) {
        showMessageSuccess();
        const msg = new Comunicado(response.data.mensagem);
        console.log(msg.get());
      }
    })
    .catch((error) => {
      if (error.response) {
        showMessageError();
        const msg = new Comunicado(error.response.data.mensagem);
        console.log(msg.get());
      }
    });
}

//-----------------------Terceira Entrega-------------------------------

//Mensagem "Bilhete ativo!"
function Message() {
  let activateMessage = document.getElementById("successActivateMessage");
  activateMessage.innerHTML = `<p id="successMessage" class="activeTicket">Bilhete ativo!</p>`;
}
function Message() {
  let activateMessage = document.getElementById("successActivateMessage");
  activateMessage.innerHTML = `<p id="successMessage" class="activeTicket">Bilhete Expirado!</p>`;
}
let code = document.getElementById("ticketCodeVerification").value;

function searchRecharge() {
  let code = document.getElementById("ticketCodeVerification").value;
  let codeManager = document.getElementById("ticketCodeVerificationManage").value;
  let url = `http://localhost:3000/Recarga/${code}`;

  axios
    .get(url)
    .then((response) => {
      createDinamicList(response.data);
    })
    .catch((error) => {
      alert(error);
      console.log(error);
    });

    const createDinamicList = (Recharge) => {
      Recharge.map((recharge) => {
        const ulRecharge = document.getElementById("Recharge");
        const listRecharge = document.createElement("option");
        listRecharge.innerHTML =`${recharge.cdr} - Recarga ${recharge.tipo}`;
        ulRecharge.appendChild(listRecharge);
        document.getElementById("Recharge").style.display = "block";
      });
    }

    if (code) {
      document.querySelector("#activateTicketButton").disabled = false;
    }
  
    else {
      document.querySelector("#activateTicketButton").disabled = true;
    }

    if (codeManager) {
      document.getElementById("boxManage").style.display = "block";
      document.querySelector("#manageTicketButton").disabled = false;
    }
  
    else {
      document.querySelector("#manageTicketButton").disabled = true;
    }
}

 function UtiliRec() {
  const codRec = document.getElementById("Recharge").value;
  const cdb = document.getElementById("ticketCodeVerification").value; 
  const cdr = parseInt(codRec.substr(0,6));
  const tip = codRec.substr(17,);
  console.log(tip);
  console.log(cdr);
  let objUsed = { cdr:cdr, cdb:cdb , tipo:tip};
  let url = `http://localhost:3000/Utilizar`;

  let res = axios
  .post(url, objUsed)
  .then((response) => {
    if (response.data) {
      Message();
      const msg = new Comunicado(response.data.mensagem);
      console.log(msg.get());
    }
  })
  .catch((error) => {
    if (error.response) {
      Message();
      const msg = new Comunicado(error.response.data.mensagem);
      console.log(msg.get());
    }
  });
}
//Função para avisos
function Comunicado(mensagem) {
  this.mensagem = mensagem;
  this.get = function () {
    return this.mensagem;
  };
}

//Gerenciamento

function searchHist() {
  const cdb = document.getElementById("ticketCodeVerificationManage").value;
  let url = `http://localhost:3000/Gerenciamento/${cdb}`;

  axios
  .get(url)
  .then((response) => {
    createlistaGerenciamento(response.data);
  })
  .catch((error) => {
    alert(error);
    console.log(error);
  });
    const createlistaGerenciamento = (Utilizados) => {
      Utilizados.map((utiizados) => {
        const ulHistor = document.getElementById("ManageHist");
        const listHistor = document.createElement("option"); 
        listHistor.innerHTML =`${utiizados.cdr} - Recarga ${utiizados.tipo}`;
        ulHistor.appendChild(listHistor);
      });
    }
}