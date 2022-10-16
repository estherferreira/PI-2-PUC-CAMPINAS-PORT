//Gera um número aleatório de 6 dígitos
function createRandomNumber() {
    const randomNumber = (Math.random() * (1000000 - 100000) + 100000).toFixed(0);
    return randomNumber;
}
//função para exibir o codigo
function getRandomNumber(){
    let visor = document.getElementById('numrandomid');
    let numberrand = createRandomNumber();
   visor.innerHTML = 'O número do seu Bilhete é : '+ numberrand;
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
