//Gera um número aleatório de 6 dígitos
function getRandomNumber() {
    const randomNumber = (Math.random() * (1000000 - 100000) + 100000).toFixed(0);
    console.log(randomNumber);
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
