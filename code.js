//Gera um numero aleatorio para o Bilhete
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
