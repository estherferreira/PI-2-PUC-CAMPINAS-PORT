//Gera um número aleatório de 6 dígitos
function createRandomNumber() {
    const randomNumber = (Math.random() * (1000000 - 100000) + 100000).toFixed(0);
    var xhr = new XMLHttpRequest();             
    xhr.open("POST", "http://localhost:8080/"/*+randomnumber*/, true);             
    xhr.setRequestHeader('Content-Type', 'application/json');             
    xhr.send(JSON.stringify({                 
        id:randomNumber,             
    }));
    return randomNumber;
}

//Exibe o código do bilhete para o usuário
function getRandomNumber() {
    let visor = document.getElementById('numrandomid');
    let numberrand = createRandomNumber();
    visor.innerHTML = `<button type="button" class="white-elements numberandom" name="numberandom" id="numrandomid">Seu bilhete: ${numberrand}
    </button>`
}

//Verifica se a checkbox está marcada e permite que usuário gere o código do seu bilhete caso esteja
function toggleButton() {
    const checkbox = document.querySelector('#checkbox').checked;

    if (checkbox) {
        document.querySelector('#generate').disabled = false;
        if (generate == false) {
            getRandomNumber();
        }
        return
    }
    document.querySelector('#generate').disabled = true;
}

//Salva a data e a hora que o usuário clicou no botão gerar
function saveDateAndTime() {
    const dateAndHour = document.querySelector('.date');
    const date = console.log(Date());
}
