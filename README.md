# API de Boletos

API para analizar código de barras e linha digitáveis de boletos bancários e de tributação.

***Atenção:*** Essa API não realiza transcrições de campos abertos por bancos ou empresas, portanto não realiza cálculos de boletos atrasados ou afins.

## Descrição

No Brasil há dois tipos de boletos para realizar pagamentos de produtos ou pessoas, sendo boleto bancário e boleto de tributo. O primeiro é utilizado pelos bancos para arrecadação monetária ou mesmo transferencia de valores entre pessoas. O segundo é utilizado por empresas para recebimento de pagamentos por prestação de serviço, como internet, telefone, energia, água, entre outros.

Apesar de ambos boletos terem a mesma função de estipular valores a serem pagos, tipo de moeda, data de vencimento entre outras informações, cada um possuí informações específicas em seu código de barra e linhas editáveis, como descritas abaixo.


## Boletos Bancários


### Formato

    Código de barras:
    [ AAABK.UUUUVV ] [ VVVVV.VVVCCC ] [ CCDDD.DDDDDD ] [ DEEEE.EEEEEE ]

    Linha digiátvel:
    [ AAABC.CCCCX ] [ DDDDD.DDDDDY ] [ EEEEE.EEEEEZ ]  [ K ]  [ UUUUVVVVVVVVVV ]

    • A - Código do Banco na Compentação - Campo: 01-03 do código de barras
    • B - Código da moeda - Campo: 04-04 do código de barras
    • C - Campo Livre - Campo: 20-24 do código de barras
    • X - DV do Bloco 1 - Módulo 10
    • D - Campo Livre - Campo: 25-34 do código de barras
    • Y - DV do Bloco 2 - Módulo 10
    • E - Campo Livre - Campo: 35-44 do código de barras
    • Z - DV do Bloco 3 - Módulo 10
    • K - DV do código de barras - Campo: 05-05 do código de barras
    • U - Fator de Vencimento - Campo: 06-09 do código de barras
    • V - Valor - Campo: 10-19 do código de barras

## Boletos Tributários


    Código de barras:
    [ ABCDEEEEEEE ]   [ EEEEFFFFGGG ]   [ GGGGGGGGGGG ]   [ GGGGGGGGGGG ]

    Linha digitável:
    [ ABCDEEEEEEE W ] [ EEEEFFFFGGG X ] [ GGGGGGGGGGG Y ] [ GGGGGGGGGGG Z ]


    • A - '8' Identificação de arrecadação
    • B - Identificação de segmento
    • C - Identificação de valor real ou referência:
        ◦ '6' -> valor efetivo; '7' -> quantidade de moedas;
        ◦ '8' -> valor efetivo; '9' -> quantidade de moedas.
    • D - Tipo de cálculo do dígito verificador
        ◦ Para C = '6' ou '7' => Mod10; Para C = '8' ou '9' => Mod11;
    • E - Tipo de valor a ser cobrado
        ◦ Para C = '6' ou '8' => Valor a ser cobrado em centavos;
        ◦ Para C = '7' ou '9' => Valor de referência, neste campo poderá conter uma quantidade de moeda, zeros, ou um valor a ser reajustado por um índice, etc.
    • F - Idenficação da empresa/orgão (informação específica da FEBRABAN)
    • G - Campo livre (Obs.: Se existir data de vencimento no campo livre, ela deverá vir em primeiro lugar e em formato AAAAMMDD)
    • [ W,X,Y,Z ] - Mod10 de cada campo anterior


## Exemplo Web

[Boletos Web](https://led-startup-studio.github.io/boletos-web/) contém um exemplo de utilização dessa API para aplicações React. Acesse o código fonte nesse [link](https://led-startup-studio.github.io/boletos-web/).


## License

MIT
