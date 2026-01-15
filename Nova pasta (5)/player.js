        const quadrado = document.getElementById('meuQuadrado');
        const cenario = document.querySelector('.cenario');
        
        // Posição inicial
        const posXInicial = 50;
        const posYInicial = 0; // Começa no topo, cai com gravidade
        const cenarioXInicial = 0;
        
        let posX = posXInicial;
        let posY = posYInicial;
        let velocidadeY = 0;
        let cenarioX = cenarioXInicial;
        let direcao = 1; // 1 = direita, -1 = esquerda
        
        const passo = 5;
        const containerLargura = 800;
        const containerAltura = 400;
        const marioLargura = 40;
        const marioAltura = 80;
        const chaoY = containerAltura - marioAltura;
        const gravidade = 0.4;
        const forcaPulo = -10;
        const tamanhoBloco = 40; // Tamanho de cada bloco no mapa
        
        let estaNochao = false;
        let animacaoAtiva = null;
        let frameAtual = 0;
        const totalFrames = 6;
        const larguraFrame = 40;
        
        const teclasPrecionadas = {};

        function reiniciarJogo() {
            posX = posXInicial;
            posY = posYInicial;
            cenarioX = cenarioXInicial;
            velocidadeY = 0;
            estaNochao = true;
            direcao = 1;
            quadrado.style.backgroundPosition = '0px 0px';
            console.log('Mario caiu! Reiniciando...');
        }

        function temColisao(testarX, testarY, testarLargura, testarAltura) {
            // Verificar colisão com blocos do mapa
            const colunainicio = Math.floor(testarX / tamanhoBloco);
            const colunaFim = Math.floor((testarX + testarLargura) / tamanhoBloco);
            const linhaInicio = Math.floor(testarY / tamanhoBloco);
            const linhaFim = Math.floor((testarY + testarAltura) / tamanhoBloco);
            
            for (let linha = linhaInicio; linha <= linhaFim; linha++) {
                for (let coluna = colunainicio; coluna <= colunaFim; coluna++) {
                    if (mapa[linha] && mapa[linha][coluna] === 1) {
                        return true;
                    }
                }
            }
            return false;
        }

        function iniciarAnimacao() {
            if (animacaoAtiva) return;
            
            animacaoAtiva = setInterval(() => {
                frameAtual = (frameAtual + 1) % totalFrames;
                quadrado.style.backgroundPosition = `-${frameAtual * larguraFrame}px 0px`;
            }, 100);
        }

        function pararAnimacao() {
            if (animacaoAtiva) {
                clearInterval(animacaoAtiva);
                animacaoAtiva = null;
                frameAtual = 0;
                quadrado.style.backgroundPosition = '0px 0px';
            }
        }

        function mudarDirecao(novaDir) {
            if (direcao !== novaDir) {
                direcao = novaDir;
                // Mudar sprite conforme direção
                if (direcao === 1) {
                    quadrado.style.backgroundImage = "url('src/img/mario.png')";
                } else {
                    quadrado.style.backgroundImage = "url('src/img/mario sprite - Copia.png')";
                }
            }
        }

        function atualizarPosicao() {
            quadrado.style.top = `${posY}px`;
            quadrado.style.left = `${posX}px`;
            cenario.style.backgroundPosition = `-${cenarioX}px 0px`;
        }

        // Loop principal de atualização
        setInterval(() => {
            // Movimento horizontal - controla cenário diretamente
            if (teclasPrecionadas['ArrowLeft'] || teclasPrecionadas['KeyA']) {
                if (cenarioX > 0) {
                    cenarioX -= passo;
                }
                mudarDirecao(-1);
                iniciarAnimacao();
            } else if (teclasPrecionadas['ArrowRight'] || teclasPrecionadas['KeyD']) {
                cenarioX += passo;
                mudarDirecao(1);
                iniciarAnimacao();
            } else {
                pararAnimacao();
            }
            
            // Gravidade
            if (!estaNochao) {
                velocidadeY += gravidade;
                posY += velocidadeY;
            }
            
            // Verificar abismo (caiu muito fundo = morre)
            if (posY > containerAltura + 100) {
                reiniciarJogo();
            }
            
            // Colisão com chão
            if (posY >= chaoY) {
                posY = chaoY;
                velocidadeY = 0;
                estaNochao = true;
            }
            
            atualizarPosicao();
        }, 30);

        // Eventos de teclado
        document.addEventListener('keydown', (event) => {
            teclasPrecionadas[event.code] = true;
            
            if ((event.code === 'Space' || event.code === 'KeyW' || event.code === 'ArrowUp') && estaNochao) {
                velocidadeY = forcaPulo;
                estaNochao = false;
                pararAnimacao();
                quadrado.style.backgroundPosition = '-240px 0px';
            }
        });

        document.addEventListener('keyup', (event) => {
            teclasPrecionadas[event.code] = false;
        });