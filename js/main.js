// Variáveis globais
var pontuacao = 0;
var combustivel = 100;
var intervaloCombustivel;
var intervaloObstaculo;
var velocidadeObstaculo = 2;
var recargasCombustivel = 0;
var velocidadeCarro = 2;
var desativar = 1;//variavel para desativar a alternância na grama
var atualiazacao;//variável da função da atualização do combústivel
var c = 0; // Variável global para armazenar o valor de "c"
var ambiente; // variável da função que muda o cenário
var curva; // variável da função que faz a curva e que tira ela

// Elementos do DOM
var carro = document.getElementById('carro');
var pontuacaoElemento = document.getElementById('valor-pontuacao');
var barraCombustivel = document.getElementById('barra-combustivel');
var menu_inicial = document.getElementById('menu');//div do menu_inicial

// Cenários disponíveis
function dia(){
    var container = document.getElementById('container');
    container.style.backgroundColor = 'lightblue';
}

function tarde(){
    var container = document.getElementById('container');
    container.style.backgroundColor = 'orangered';
}

function noite(){
    var container = document.getElementById('container');
    container.style.backgroundColor = 'rgb(0, 0, 20)';
}

function neve(){
    var container = document.getElementById('container');
    container.style.backgroundColor = 'white';
}

// Escolhendo o ambiente inicial ao clicar no botão
document.getElementById("dia").addEventListener("click", dia);
document.getElementById("tarde").addEventListener("click", tarde);
document.getElementById("noite").addEventListener("click", noite);
document.getElementById("neve").addEventListener("click", neve);

var direcaoCarro = 0; // -1 para a esquerda, 1 para a direita

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowLeft') {
        direcaoCarro = -1;
    } else if (event.key === 'ArrowRight') {
        direcaoCarro = 1;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        direcaoCarro = 0; // Parar de mover quando a tecla for solta
    }
});

//alterna a cada 30s o cenario
function alternarFuncoes() {
    var funcoes = ["dia", "tarde", "noite", "neve"];
    var index = 0;

    function executarFuncao() {
        var funcao = funcoes[index % funcoes.length];
        index++;

        if (typeof window[funcao] === "function") {
            window[funcao]();
        }
    }

    executarFuncao();
    ambiente = setInterval(executarFuncao, 30000); // Chama a função a cada minuto (60000 ms)
}

function moverCarro() {
    let posicaoEsquerda = parseInt(window.getComputedStyle(carro).getPropertyValue('left'));
    let novaPosicao = posicaoEsquerda + direcaoCarro * velocidadeCarro;
    console.log(novaPosicao);
    if (novaPosicao >= 25 && novaPosicao <= 775) {
        carro.style.left = novaPosicao + 'px';

    }
    if (!(novaPosicao >= 100 && novaPosicao <= 700)) {
        velocidadeObstaculo *= 0.85;
        velocidadeCarro = 2;
    } else {
        velocidadeObstaculo = 2;

    }

}

setInterval(moverCarro, 16); // Atualiza o movimento do carro a cada 16ms (aproximadamente 60 FPS)

function criarObstaculo() {

    var tiposObstaculo = ['obstaculo1', 'obstaculo2', 'obstaculo3', 'obstaculo4']; // Tipos de obstáculos disponíveis
    var container = document.getElementById('container'); // Obtém o elemento container

    // Gera um número aleatório entre 0 e 99
    var probabilidade = Math.floor(Math.random() * 100);

    // Define o tipo de obstáculo com base na probabilidade
    var tipoObstaculo;
    if (probabilidade < 50) {
        tipoObstaculo = 'obstaculo1';
    } else {
        tipoObstaculo = tiposObstaculo[Math.floor(Math.random() * tiposObstaculo.length)];
    }

    // Cria a div do obstáculo(Rever)
    var obstaculo = document.createElement('div');
    obstaculo.className = 'obstaculo ' + tipoObstaculo;

    // Define a posição inicial do obstáculo no centro do container
    var posicaoInicialX;
    var posicaoInicialY;
    if (c < 0) {
        posicaoInicialX = container.offsetWidth * 3 / 4 - 25;
    }
    else if (c > 0) {
        posicaoInicialX = container.offsetWidth * 1 / 4 - 25;

    } else {
        posicaoInicialX = container.offsetWidth * 2 / 4 - 25;

    }
    posicaoInicialY = 325;

    obstaculo.style.left = posicaoInicialX + 'px';
    obstaculo.style.top = posicaoInicialY + 'px';

    // Adiciona o obstáculo ao container
    container.appendChild(obstaculo);

    // Define a posição atual do obstáculo
    var posicaoAtualX = posicaoInicialX;
    var posicaoAtualY = posicaoInicialY;
    var posicaoAleatoriaX = Math.floor(Math.random() * (600 - 150 + 1) + 150);
    var posicaoAleatoriaY = container.offsetHeight;// - obstaculo.offsetHeight;
    
    // Move o obstáculo diagonalmente em 60 FPS

    var intervalo = setInterval(function () {

        // Calcula os deltas de movimento
        var deltaX = posicaoAleatoriaX - posicaoAtualX;
        var deltaY = posicaoAleatoriaY - posicaoAtualY;

        // Calcula o vetor de movimento normalizado
        var distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        var vetorMovimento = {
            x: deltaX / distancia,
            y: deltaY / distancia,
        };

        // Atualiza a posição do obstáculo
        if (c > 0) {
            posicaoAtualX += vetorMovimento.x * velocidadeObstaculo * 5;
            posicaoAtualY += vetorMovimento.y * velocidadeObstaculo;
        } else if (c < 0) {
            posicaoAtualX += vetorMovimento.x * velocidadeObstaculo * 5;
            posicaoAtualY += vetorMovimento.y * velocidadeObstaculo;
        } else {
            posicaoAtualX += vetorMovimento.x * velocidadeObstaculo;
            posicaoAtualY += vetorMovimento.y * velocidadeObstaculo;
        }
        
        obstaculo.style.left = posicaoAtualX + 'px';
        obstaculo.style.top = posicaoAtualY + 'px';

        // Verifica se ocorreu uma colisão
        if (posicaoAtualY > 600) {
            clearInterval(intervalo);
            criarObstaculo();
            obstaculo.remove();
            pontuacao += 1;
            pontuacaoElemento.textContent = pontuacao;

        } else if (posicaoAtualY > 500) {
            let aux = verificarColisao(obstaculo);
            if(aux===1)
                clearInterval(intervalo);
        }


    }, 1000 / 60); // 60 FPS
}

//verificar colisao
function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect();
    const b = elementoB.getBoundingClientRect();
    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top;

    return horizontal && vertical;
}

function colidiu(carro, obstaculo) {
    return estaoSobrepostos(carro, obstaculo);
}

function verificarColisao(obstaculo) {
    var colidiuObstaculo = colidiu(carro, obstaculo);

    if (colidiuObstaculo) {
        if (obstaculo.classList.contains('obstaculo1')) {//CARRO INIMIGO

            encerrarJogo();
            return 1;
            
            
        } else if (obstaculo.classList.contains('obstaculo2')) {//ABASTECE A GASOLINA
            combustivel += 10;
            if (combustivel > 100) {
                combustivel = 100
            }
            barraCombustivel.style.width = combustivel + '%';
            recargasCombustivel++;
            //gerarObstaculo();
            obstaculo.remove();
        } else if (obstaculo.classList.contains('obstaculo3')) {//REDUZ A VELOCIDADE E PERDE PONTOS
            if (pontuacao > 1) {
                pontuacao -= 2;
            } else {
                pontuacao = 0;
            }
            pontuacaoElemento.textContent = pontuacao;
            if (velocidadeObstaculo > 1) {
                velocidadeObstaculo -= velocidadeObstaculo * 0.15;
            }
            criarObstaculo();//cria outro obstaculo para dificultar o jogo
            obstaculo.remove();
        } else if (obstaculo.classList.contains('obstaculo4')) {//AUMENTA A VELOCIDADE E GANHA PONTO
            pontuacao += 2;
            pontuacaoElemento.textContent = pontuacao;
            velocidadeCarro += 5;
            //criarObstaculo();
            obstaculo.remove();
        }
    }
}

// Controle de combustível
function atualizarCombustivel() {
    combustivel -= 1;
    barraCombustivel.style.width = combustivel + '%';
    if (combustivel <= 0) {
        encerrarJogo();
    }
}

//Reinicia o jogo
function reiniciarJogo(){
    //remove a tela final do jogo
    document.getElementById("tela-final").remove();

    //Reincia as variáveis do jogo
    pontuacao = 0;
    cargasCombustivel = 0;

    //Recarrega a página para retornar ao menu inicial
    window.location.reload();
}

// Função para exibir tela de fim de jogo
function exibir_tela_final() {
    const telaFimDeJogo = document.createElement("div");
    telaFimDeJogo.id = "tela-final";

    const texto_final = document.createElement("h1");
    texto_final.textContent = "Fim de Jogo!";

    const pontuacao_final = document.createElement("p");
    pontuacao_final.textContent = `Pontuação: ${pontuacao}`;

    const numero_combustivel = document.createElement("p")
    numero_combustivel.textContent = `Recargas de Combustível: ${recargasCombustivel }`;

    const botaoReiniciar = document.createElement("button");
    botaoReiniciar.textContent = "Reiniciar";
    botaoReiniciar.addEventListener("click", reiniciarJogo);

    telaFimDeJogo.appendChild(texto_final);
    telaFimDeJogo.appendChild( pontuacao_final);
    telaFimDeJogo.appendChild( numero_combustivel);
    telaFimDeJogo.appendChild(botaoReiniciar);
    document.body.appendChild(telaFimDeJogo);
}

// Fim do jogo
function encerrarJogo() {

    clearInterval(intervaloCombustivel);
    clearInterval(intervaloObstaculo);
    clearInterval(curva);
    clearInterval(atualiazacao);
    clearInterval(ambiente);

    desativar = 0;
    
    exibir_tela_final();

}

//poligonos
function criarPoligono(cor, x1, y1, x2, y2, x3, y3, x4, y4) {
    var container = document.getElementById('container');
    var poligono = document.createElement('div');
    var pontos = `${x1}px ${y1}px, ${x2}px ${y2}px, ${x3}px ${y3}px, ${x4}px ${y4}px`;
    poligono.style.clipPath = `polygon(${pontos})`;
    poligono.style.backgroundColor = cor;
    poligono.classList.add('poligono');
    container.appendChild(poligono);
}

function criaTrapezio(x1, y1, w1, x2, y2, w2, color = "green") {
    criarPoligono(
        color,
        x1 - w1, y1,
        x1 + w1, y1,
        x2 + w2, y2,
        x2 - w2, y2
    );
}

///faz curva
function alterarValorVariavel() {
    var valores = [0, -10, 0, 10, 0];
    var index = 0;
    c = valores[index % valores.length];
    index++;

    curva = setInterval(function () {
        c = valores[index % valores.length];
        criaGrama();
        index++;
    
    }, 5000); // Altera o valor a cada 30 segundos (30000 ms)
}

//Cria grama e estrada
function criaGrama(bol = false) {
    let w = 150;// distancia do segmento pro outro
    let x = 600; // tamanho da tela altura
    let y = x - w;
    let z = y - w / 2;
    let a = 300;//pista
    let b = 350;//borda
    

    let verdeClaro = 'rgb(21, 97, 19)';
    let verdeEscuro = 'rgb(17, 77, 15)';
    let cinzaEscuro = 'rgb(83, 83, 83)';
    let cinzaclaro = 'rgb(126, 126, 126)';

    for (let i = 0; i < 4; i++) {

        criaTrapezio(400, x, 400, 400, y, 400, bol ? verdeClaro : verdeEscuro);
        criaTrapezio(400, y, 400, 400, z, 400, bol ? verdeEscuro : verdeClaro);
        criaTrapezio(400 - c, x, b, 400 - c * 2, y, b / 2, bol ? 'black' : 'white');
        criaTrapezio(400 - c * 2, y, b / 2, 400 - c * 3, z, b / 2 / 2, bol ? 'white' : 'black');
        criaTrapezio(400 - c, x, a, 400 - c * 2, y, a / 2, bol ? cinzaEscuro : cinzaclaro);
        criaTrapezio(400 - c * 2, y, a / 2, 400 - c * 3, z, a / 2 / 2, bol ? cinzaclaro : cinzaEscuro);

        c = c * 3;
        a = a / 2 / 2;
        b = b / 2 / 2;

        x = z;
        w = w / 4;
        y = x - w;
        z = y - w / 2;

    }
}

//Muda a grama para dar a sensação de movimento
function alternarChamadas() {
    alternar = true;

    var alternancia = setInterval(function () {
        if(desativar===0){
            clearInterval(alternancia);
        }


        if(c===0){
            if (alternar) {
                criaGrama(true);
            } else {
                criaGrama(false);
            }
        }
        

        alternar = !alternar;
    }, 1000/velocidadeObstaculo);
}

criaGrama();
        
// Iniciar o jogo
function iniciarJogo() {

    //removendo o div do menu
    menu_inicial.remove();

    alterarValorVariavel();

    alternarChamadas();


    alternarFuncoes();

    criarObstaculo();

    atualiazacao = setInterval(function () {
        atualizarCombustivel();
    }, 1000);
}

//Iniciar o jogo
document.getElementById("iniciar").addEventListener("click", iniciarJogo);

