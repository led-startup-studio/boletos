/**
 * The document specification can be found in:
 * https://febraban.org.br/pagina/3166/33/pt-br/layour-arrecadacao
 * http://wiki.biserp.com.br/index.php/Especifica%C3%A7%C3%A3o_de_Guias_e_Boletos
 *
 * ====================
 *       LAYOUT
 * ====================
 *
 * Barcode: [ AAABK.UUUUVV ] [ VVVVV.VVVCCC ] [ CCDDD.DDDDDD ] [ DEEEE.EEEEEE ]
 * Line:    [ AAABC.CCCCX ] [ DDDDD.DDDDDY ] [ EEEEE.EEEEEZ ]  [ K ]  [ UUUUVVVVVVVVVV ]
 *              FIELD 1          FIELD 2          FIELD 3     FIELD 4      FIELD 5
 *  A - Código do Banco na Compentação - Campo: 01-03 do código de barras
 *  B - Código da moeda - Campo: 04-04 do código de barras
 *  C - Campo Livre - Campo: 20-24 do código de barras
 *  X - DV do Bloco 1 - Módulo 10
 *  D - Campo Livre - Campo: 25-34 do código de barras
 *  Y - DV do Bloco 2 - Módulo 10
 *  E - Campo Livre - Campo: 35-44 do código de barras
 *  Z - DV do Bloco 3 - Módulo 10
 *  K - DV do código de barras - Campo: 05-05 do código de barras
 *  U - Fator de Vencimento - Campo: 06-09 do código de barras (verificar método 'bankDate')
 *  V - Valor - Campo: 10-19 do código de barras
 *
 */
import moment, { Moment } from "moment";
export interface IBank {
    bank: string;
    currency: string;
    dv: string;
    due: string;
    date: Moment;
    value: string;
    open_fields: string[];
    field_dvs: string[];
}
export declare const rootFactorDate: moment.Moment;
export declare const firstFactorDate: moment.Moment;
export declare class BankBillet {
    private billet;
    constructor();
    /**
     * Parse barcode or digitable line to bank billet
     * @param billet Barcode (44 digits) or digitable line (47 digits)
     */
    static parseBillet(billet: string): BankBillet;
    /**
     * Create a new bank billet
     * @param value value in following format R$ 0.000,00
     * @param expiry how many days to be expired
     * @param bank is a key for a choosen bank (e.g.: "237", "001", etc.)
     */
    static createBillet(value: number, expiry: number, bank?: string): BankBillet;
    /**
     * Get billet information
     */
    getBillet(): IBank;
    /**
     * Parse the barcode reding each property
     * @param barcode 44 digits number
     */
    private static parseBarcode;
    /**
     * Parse a 47 number bank billet
     * @param line 47 digitable line from the bank billet
     */
    private static parseLine;
    toBarcode(): string;
    toLine(): string;
    /**
     * Check if the given barcode is valid by comparing the given DV with a calculated one
     * @param barcode 44 digits code
     */
    private static isBarcodeValid;
    /**
     * Check if the given line is valid by comparing the given DVs with a calculated one
     * @param line 47 digits code
     */
    private static isLineValid;
    /**
     * This method calculates what is the most probable billet due date
     *  ...   -3001  -3000    -1      0       1              5500  5501    ...
     *  [ invalid ]  [ overdue ]  [ today ]   [ to be processed ]  [ invalid ]
     *                     │                     └──> current factor date or next
     *                     └──> current factor date or previous
     *
     * Check for more information:
     *  http://www.abbc.org.br/images/content/manual%20operacional.pdf
     *  https://www.bb.com.br/docs/pub/emp/empl/dwn/Doc5175Bloqueto.pdf
     */
    static bankDate(due: number): Moment;
}
