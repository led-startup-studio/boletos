/**
 * The document specification can be found in:
 * https://febraban.org.br/pagina/3166/33/pt-br/layour-arrecadacao
 * http://wiki.biserp.com.br/index.php/Especifica%C3%A7%C3%A3o_de_Guias_e_Boletos
 *
 * ====================
 *       LAYOUT
 * ====================
 *
 * Barcode: [ ABCDEEEEEEE ]   [ EEEEFFFFGGG ]   [ GGGGGGGGGGG ]   [ GGGGGGGGGGG ]
 * Line:    [ ABCDEEEEEEE W ] [ EEEEFFFFGGG X ] [ GGGGGGGGGGG Y ] [ GGGGGGGGGGG Z ]
 * A - '8' Identificação de arrecadação
 * B - Identificação de segmento
 * C - Identificação de valor real ou referência:
 *      '6' -> valor efetivo; '7' -> quantidade de moedas;
 *      '8' -> valor efetivo; '9' -> quantidade de moedas.
 * D - DV:
 *     Para C = '6' ou '7' => Mod10; Para C = '8' ou '9' => Mod11;
 * E - Valor:
 *     Para C = '6' ou '8' => Valor a ser cobrado em centavos;
 *     Para C = '7' ou '9' => Valor de referência, neste campo poderá
 *                             conter uma quantidade de moeda, zeros,
 *                             ou um valor a ser reajustado por um índice, etc..
 * F - Idenficação da empresa/orgão
 * G - Campo livre (Obs.: Se existir data de vencimento no campo livre, ela
 *                        deverá vir em primeiro lugar e em formato AAAAMMDD)
 * [ W,X,Y,Z ] - Mod10 de cada campo anterior
 *
 */
export interface ITribute {
    identifier: string;
    segment: string;
    value_type: string;
    dv: string;
    value: string;
    business: string;
    open_field: string;
    field_dvs: string[];
}
export declare class TributeBillet {
    private billet;
    constructor();
    /**
     * Parse barcode or digitable line to tribute billet
     * @param billet Barcode (44 digits) or digitable line (48 digits)
     */
    static parseBillet(billet: string): TributeBillet;
    /**
     * Create a new tribute billet
     * @param value value in following format R$ 0.000,00
     */
    static createBillet(value: number): TributeBillet;
    /**
     * Get billet information
     */
    getBillet(): ITribute;
    private static parseBarcode;
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
     * @param line 48 digits code
     */
    private static isLineValid;
}
