const localStorage = window.localStorage;
let gameWinnersList = localStorage.getItem('gameWinnersList') ? JSON.parse(localStorage.getItem('gameWinnersList')) : [];
localStorage.setItem('gameWinnersList', JSON.stringify(gameWinnersList));

class Player {
    constructor(nome, simbolo) {
        this.nome = nome;
        this.simbolo = simbolo;
    }
}

class Self {
    constructor(robo, simbolo, texto, bottonLabel, nomeJogadorAtual, jogadores) {
        this.robo = robo;
        this.simbolo = simbolo;
        this.texto = texto;
        this.bottonLabel = bottonLabel;
        this.nomeJogadorAtual = nomeJogadorAtual;
        this.jogadores = jogadores;
    }
}

class InforPlay {
    constructor(total, venceu, podeJogar, quadro, jogadas) {
        this.total = total;
        this.venceu = venceu;
        this.podeJogar = podeJogar;
        this.quadro = quadro;
        this.jogadas = jogadas;
    }
}

class WinningPlayer {
    constructor(id, nome, total) {
        this.id = id;
        this.nome = nome;
        this.total = total;
    }
}

window.onload = function () {
    criaTable();
};

function criaTable() {
    const parent = document.getElementById("tableGameWinners");
    while (parent.firstChild) {
        parent.firstChild.remove()
    }

    var row = document.createElement("tr");
    row.style = 'background-color: #0F2028;';

    var thRA = document.createElement("th");
    thRA.innerHTML = 'Nome';
    thRA.style = 'width: 200px; text-align: center; color: #FFFFFF;';
    row.append(thRA);

    var thStatus = document.createElement("th");
    thStatus.innerHTML = 'Total';
    thStatus.style = 'width: 100px; text-align: center; color: #FFFFFF;';
    row.append(thStatus);

    const tableNotaSemestre = document.getElementById("tableGameWinners");
    tableNotaSemestre.insertBefore(row, tableNotaSemestre.childNodes[0]);// Adiciona a linha na posição zero(0) tabela
    const notasLocalStorage = JSON.parse(localStorage.getItem('gameWinnersList'));

    notasLocalStorage.sort((a, b) => parseFloat(b.total) - parseFloat(a.total));
    notasLocalStorage.forEach(item => {
        criarElemento(item);
    });

    var linhasTabela = document.getElementsByTagName("tr");
    for (var i = 0; i < linhasTabela.length; i++) {
        if (i == 0) {
            continue;
        }
        else if ((i) % 2 == 0) {
            linhasTabela[i].className = "styleOne";
        }
        else {
            linhasTabela[i].className = "styleTwo";
        }
    }
}

function criarElemento(obj) {

    // Create two new cells
    var cellTextoNome = document.createElement("td");
    cellTextoNome.id = obj.id;
    cellTextoNome.innerHTML = obj.nome;
    cellTextoNome.style = 'text-align: center;';
    // Create two new cells
    var cellTextoTotal = document.createElement("td");
    cellTextoTotal.id = obj.id;
    cellTextoTotal.innerHTML = obj.total;
    cellTextoTotal.style = 'text-align: center;';

    var row = document.createElement("tr");
    row.id = obj.id;
    row.appendChild(cellTextoNome);
    row.appendChild(cellTextoTotal);
    const table = document.getElementById("tableGameWinners");
    table.appendChild(row);// Adiciona a linha na tabela
}


const JogoVelha = () => {

    let inforPlay = new InforPlay(0, false, false, null, []);

    const mensagens = [
        'Aperte jogar para iniciar',
        'Agora é sua vez',
        'Venceu o jogo',
        'Jogo empatado'
    ]

    const self = new Self(true, '', mensagens[0], 'Jogar', null, []);

    const checkMatching = (val1, val2, val3) => {
        if (inforPlay.jogadas[val1] === inforPlay.jogadas[val2] && inforPlay.jogadas[val2] === inforPlay.jogadas[val3]) {
            return inforPlay.jogadas[val1];
        }
    }

    const clickedBox = (elemento) => {
        let winner = false;

        if (elemento) {
            inforPlay.total++;
            const id = elemento.getAttribute('data-id');
            if (!inforPlay.podeJogar || inforPlay.jogadas[id]) {// Verifica se o jogador pode jogar ou se a celular já foi preenchida
                return false;
            }
            elemento.innerText = self.simbolo;
            inforPlay.jogadas[id] = self.simbolo;


            // Verifica todas as opções do jogador ganhar a partida
            winner = (checkMatching(1, 2, 3) || checkMatching(4, 5, 6) || checkMatching(7, 8, 9) ||
                checkMatching(1, 4, 7) || checkMatching(2, 5, 8) || checkMatching(3, 6, 9) ||
                checkMatching(1, 5, 9) || checkMatching(3, 5, 7));

            if (winner) {
                inforPlay.total = 0;
                inforPlay.venceu = true;
                self.simbolo = winner;
                self.texto = mensagens[2];
                inforPlay.podeJogar = false;
                const mensagem = document.getElementById('mensagem');
                mensagem.className = "efeitoVenceu"; // Aplica o efeito da mensagem piscando


                let winningPlayer = gameWinnersList.find(o => o.nome.trim() === self.nomeJogadorAtual.trim());
                const index = gameWinnersList.length;

                let removeValFromIndex = [];

                for (var i = 0; i < gameWinnersList.length; i++) {
                    if (gameWinnersList[i].nome == self.nomeJogadorAtual) {
                        removeValFromIndex.push(i);
                    }
                }

                for (var i = removeValFromIndex.length - 1; i >= 0; i--)
                    gameWinnersList.splice(removeValFromIndex[i], 1);

                if (winningPlayer === null || winningPlayer === undefined) {
                    const winningPlayer = new WinningPlayer(index, self.nomeJogadorAtual, 1);
                    gameWinnersList.push(winningPlayer);
                } else {
                    winningPlayer.total = winningPlayer.total + 1;
                    gameWinnersList.push(winningPlayer);
                }
                localStorage.setItem('gameWinnersList', JSON.stringify(gameWinnersList));
                criaTable();

            } else {
                if (self.simbolo === 'x') {
                    self.simbolo = 'o';
                    let playCurrent = self.jogadores.find(o => o.simbolo.trim() === self.simbolo.trim());
                    self.nomeJogadorAtual = playCurrent.nome + ' - ';
                } else {
                    self.simbolo = 'x';
                    let playCurrent = self.jogadores.find(o => o.simbolo.trim() === self.simbolo.trim());
                    self.nomeJogadorAtual = playCurrent.nome + ' - ';
                }
            }
        }

        if (!inforPlay.venceu && inforPlay.total > 8) {
            const mensagem = document.getElementById('mensagem');
            self.nomeJogadorAtual = '';
            self.texto = mensagens[3];
            self.simbolo = '';
            mensagem.className = "efeitoVenceu";
            return false;
        }

        return true;
    }

    self.init = (elemento) => {
        inforPlay.quadro = elemento;
        elemento.addEventListener('click', (e) => {
            switch (e.target.tagName) {
                case 'SPAN':
                    if (clickedBox(e.target)) {
                        if (self.robo && !inforPlay.venceu) {
                            elemento.style.pointerEvents = 'none';
                            setTimeout(() => {
                                const emptyTitles = elemento.querySelectorAll('span:empty');
                                const cell = emptyTitles[Math.floor(Math.random() * emptyTitles.length)];
                                clickedBox(cell);
                                elemento.style.pointerEvents = '';
                            }, 500);
                        }
                    }
                    break;
                case 'BUTTON':
                    play();
                    break;
            };
        });
    }

    const play = () => {

        // Ajustando a inicialização do jogador 1 com o valor do campo "jog1"
        let jogador1Nome = document.getElementById('jog1').value;
        let jogador2Nome = document.getElementById('jog2').value;
        let jogador1 = new Player(jogador1Nome, 'x');
        let jogador2 = new Player(self.robo ? 'Máquina' : jogador2Nome, 'o');
        self.jogadores[0] = jogador1;
        self.jogadores[1] = jogador2;

        inforPlay.total = 0;
        inforPlay.podeJogar = true;
        inforPlay.venceu = false;
        self.simbolo = jogador1.simbolo;
        self.nomeJogadorAtual = jogador1.nome + ' - ';
        self.texto = mensagens[1];
        inforPlay.jogadas = [];
        const cells = inforPlay.quadro.querySelectorAll('span');
        
        // Aqui ele constroi os símbolos de cada quadradinho
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = '';
        }
        const mensagem = document.getElementById('mensagem');
        mensagem.className = 'none';
        self.bottonLabel = 'Reiniciar';
    }

    const template = `
    <div>
        <h1>Jogo da velha</h1>
        <p class="checkbox">
            Jogar contra a máquina <input type="checkbox" checked @bind="self.robo">
        </p>
        <div>
            <div class="gui">
                <span id="mensagem">{{self.nomeJogadorAtual}} {{self.texto}}</span>
            </div>
            <div class="quadro" @ready="self.init(this)">
                <section class="board__column">
                    <span class="board__cell" data-id="1"></span>
                    <span class="board__cell" data-id="2"></span>
                    <span class="board__cell" data-id="3"></span>
                </section>
                <section class="board__column">
                    <span class="board__cell" data-id="4"></span>
                    <span class="board__cell" data-id="5"></span>
                    <span class="board__cell" data-id="6"></span>
                </section>
                <section class="board__column">
                    <span class="board__cell" data-id="7"></span>
                    <span class="board__cell" data-id="8"></span>
                    <span class="board__cell" data-id="9"></span>
                </section>
                <button class="btn" onclick="play()">{{self.bottonLabel}}</button>
            </div>
        </div>
    </div>
`;

return lemonade.element(template, self);


    return lemonade.element(template, self);
}