(() => {
    const BTN_REINICIAR = 'btnReiniciar';
    const ID_CONTADOR = 'contador';
    const VALOR_CONTADOR = 5;
    const PERIODO_INTERVALO = 1000;

    class ContadorComponent {
        constructor() {
            this.inicializar();
        }

        prepararContadorProxy() {
            const handler = {
                set: (currentContext, propertyKey, newValue) => {
                    console.log({ currentContext, propertyKey, newValue });

                    // Parar o processamento
                    if (!currentContext.valor) {
                        currentContext.efetuarParada();
                    }

                    currentContext[propertyKey] = newValue;

                    return true;
                },
                get: (currentContext, propertyKey) => {
                    return currentContext[propertyKey];
                }
            };

            const contador = new Proxy(
                {
                    valor: VALOR_CONTADOR,
                    efetuarParada: () => {}
                },
                handler
            );

            return contador;
        }

        atualizarTexto({ elementoContador, contador }) {
            return () => (elementoContador.innerHTML = `Começando em <strong>${contador.valor--}</strong> segundos...`);
        }

        agendarParadaContador({ elementoContador, idIntervalo }) {
            return () => {
                clearInterval(idIntervalo);
                elementoContador.innerHTML = '';
                this.desabilitarBotao(false);
            };
        }

        prepararBotao(elementBotao, iniciarFn) {
            elementBotao.addEventListener('click', iniciarFn.bind(this));

            return (valor = true) => {
                const atributo = 'disabled';
                elementBotao.removeEventListener('click', iniciarFn.bind(this));

                if (valor) {
                    elementBotao.setAttribute(atributo, valor);
                    return;
                }

                elementBotao.removeAttribute(atributo);
            };
        }

        inicializar() {
            const elementoContador = document.getElementById(ID_CONTADOR);
            const contador = this.prepararContadorProxy();
            const argumentos = {
                elementoContador,
                contador
            };

            const idIntervalo = setInterval(this.atualizarTexto(argumentos), PERIODO_INTERVALO);

            {
                const elementoBotao = document.getElementById(BTN_REINICIAR);
                const desabilitarBotao = this.prepararBotao(elementoBotao, this.inicializar);
                desabilitarBotao();

                const argumentos = { elementoContador, idIntervalo };
                const pararContadorFn = this.agendarParadaContador.apply({ desabilitarBotao }, [argumentos]);
                contador.efetuarParada = pararContadorFn;
            }
        }
    }

    window.ContadorComponent = ContadorComponent;
})();
