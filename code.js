//Gera um número aleatorio para o Bilhete
function createRandomNumber() {
    const randomNumber = (Math.random() * (1000000 - 100000) + 100000).toFixed(0);
    return randomNumber;
}

//Exibe o código do bilhete para o usuário
function showId() {
    let visor = document.getElementById('numrandomid');
    let numberrand = createRandomNumber();
    visor.innerHTML = `<button type="button" class="white-elements numberandom" name="numberandom" id="numrandomid">Seu bilhete: ${numberrand}
    </button>`
    return numberrand;
}

//Verifica se a checkbox está marcada e permite que usuário gere o código do seu bilhete caso esteja
function toggleButton() {
    const checkbox = document.querySelector('#checkbox').checked;

    if (checkbox) {
        document.querySelector('#generate').disabled = false;
        if (generate == false) {
            showId();
        }
        return
    }
    document.querySelector('#generate').disabled = true;
}

 function cadastraBilhete() {
  
  let id = showId();

  var xhr = new XMLHttpRequest();             
    xhr.open("POST", "http://localhost:3000/Bilhete", true);             
    xhr.setRequestHeader('Content-Type', 'application/json');             
    xhr.send(JSON.stringify({                 
        id:id,           
    }));
}

//------------------------------------------------------------------------------daqui para cima é da primeira entrega

//Seleciona as modalidades de bilhetes
const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach(dropdown => {
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

  options.forEach(option => {
    option.addEventListener("click", () => {
      selected.innerText = option.innerText;
      select.classList.remove("select-clicked");
      caret.classList.remove("caret-rotate");
      menu.classList.remove("menu-open");
      options.forEach(option => {
        option.classList.remove("active");
      });
      option.classList.add("active");
    });
  });
});

//Ativa botão "Comprar" e mostra a mensagem "Compra efetuada!"
function showMessage() {
  let message = document.getElementById('successMessage');
  message.innerHTML = `<p id="successMessage" class="success">Compra efetuada!</p>`
}

function handleChange() {
  const ticketCode = document.querySelector('#ticketCodeField').value;
  const ticketType = document.querySelector('.selected').innerText;

  if (ticketCode && ticketType != "Escolher modalidade") {
    document.querySelector('#buyTicketButton').disabled = false;
  }
  else {
    document.querySelector('#buyTicketButton').disabled = true;
  }
}
