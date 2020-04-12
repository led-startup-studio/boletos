/**
 * This module parses the billet of banks (bancário) and collection (arrecadação) as described in:
 *  http://wiki.biserp.com.br/index.php/Especifica%C3%A7%C3%A3o_de_Guias_e_Boletos
 *  http://www.febraban.org.br/7Rof7SWg6qmyvwJcFwF7I0aSDf9jyV/sitefebraban/Codbar4-v28052004.pdf
 *  https://www.ttrix.com/apple/iphone/boletoscan/boletoanatomia.html
 *  https://gerencianet.com.br/blog/campos-dos-boletos-linha-digitavel/
 *  https://www.bb.com.br/docs/pub/emp/empl/dwn/Doc5175Bloqueto.pdf
 *
 * Validation tools:
 *  http://www.veloso.adm.br/checkboleto/#/
 *  https://boletobancario-codigodebarras.blogspot.com/
 *  http://www.meusutilitarios.com.br/2015/05/boleto-bancario-validacao-do-codigo-de.html
 *
 */
import { BankBillet } from "./billets/bank";
import { TributeBillet } from "./billets/tribute";
export * from "./utils/banks";
export * from "./utils/dv";
export * from "./billets/bank";
export * from "./billets/tribute";
export default class Billets {
    static parse(billet: string): TributeBillet | BankBillet | undefined;
}
