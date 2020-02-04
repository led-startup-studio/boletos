"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var dv_1 = require("../utils/dv");
var dvMod = new Map()
    .set("6", dv_1.mod10)
    .set("7", dv_1.mod10)
    .set("8", dv_1.mod11)
    .set("9", dv_1.mod11);
var TributeBillet = /** @class */ (function () {
    function TributeBillet() {
        this.billet = {};
    }
    /**
     * Parse barcode or digitable line to tribute billet
     * @param billet Barcode (44 digits) or digitable line (48 digits)
     */
    TributeBillet.parseBillet = function (billet) {
        var tribute = new TributeBillet();
        if ((billet.length !== 44 && billet.length !== 48) || !billet.match(/^[0-9]+$/)) {
            throw new Error("Billet format error");
        }
        if (billet.length === 44) {
            if (!TributeBillet.isBarcodeValid(billet)) {
                throw new Error("Invalid barcode");
            }
            tribute.billet = TributeBillet.parseBarcode(billet);
        }
        if (billet.length === 48) {
            if (!TributeBillet.isLineValid(billet)) {
                throw new Error("Invalid line");
            }
            tribute.billet = TributeBillet.parseLine(billet);
        }
        return tribute;
    };
    /**
     * Create a new tribute billet
     * @param value value in following format R$ 0.000,00
     */
    TributeBillet.createBillet = function (value) {
        if (String(value * 100).length > 11) {
            throw new Error("Invalid parameters");
        }
        var tributeBillet = new TributeBillet();
        tributeBillet.billet = {
            identifier: "8",
            segment: "0",
            value_type: "8",
            dv: "0",
            value: String(value * 100).padStart(11, "0"),
            business: "0".repeat(4),
            open_field: "0".repeat(25),
            field_dvs: ["0", "0", "0", "0"],
        };
        var barcode = tributeBillet.toBarcode();
        tributeBillet.billet.dv = dv_1.mod11(barcode.slice(0, 3) + barcode.slice(4, 44));
        barcode = tributeBillet.toBarcode();
        tributeBillet.billet.field_dvs = [
            dv_1.mod10(barcode.slice(0, 11)),
            dv_1.mod10(barcode.slice(11, 22)),
            dv_1.mod10(barcode.slice(22, 33)),
            dv_1.mod10(barcode.slice(33, 44)),
        ];
        return tributeBillet;
    };
    /**
     * Get billet information
     */
    TributeBillet.prototype.getBillet = function () {
        return this.billet;
    };
    TributeBillet.parseBarcode = function (barcode) {
        return {
            identifier: barcode.slice(0, 1),
            segment: barcode.slice(1, 2),
            value_type: barcode.slice(2, 3),
            dv: barcode.slice(3, 4),
            value: barcode.slice(4, 15),
            business: barcode.slice(15, 19),
            open_field: barcode.slice(19, 44),
            field_dvs: [
                dv_1.mod10(barcode.slice(0, 11)),
                dv_1.mod10(barcode.slice(11, 22)),
                dv_1.mod10(barcode.slice(22, 33)),
                dv_1.mod10(barcode.slice(33, 44)),
            ],
        };
    };
    TributeBillet.parseLine = function (line) {
        return {
            identifier: line.slice(0, 1),
            segment: line.slice(1, 2),
            value_type: line.slice(2, 3),
            dv: line.slice(3, 4),
            value: line.slice(4, 11) + line.slice(12, 16),
            business: line.slice(16, 20),
            open_field: line.slice(20, 23) + line.slice(24, 35) + line.slice(36, 47),
            field_dvs: [
                line.slice(11, 12),
                line.slice(23, 24),
                line.slice(35, 36),
                line.slice(47, 48),
            ],
        };
    };
    TributeBillet.prototype.toBarcode = function () {
        return this.billet.identifier
            + this.billet.segment
            + this.billet.value_type
            + this.billet.dv
            + this.billet.value
            + this.billet.business
            + this.billet.open_field;
    };
    TributeBillet.prototype.toLine = function () {
        var barcode = this.toBarcode();
        return barcode.slice(0, 11) + this.billet.field_dvs[0]
            + barcode.slice(11, 22) + this.billet.field_dvs[1]
            + barcode.slice(22, 33) + this.billet.field_dvs[2]
            + barcode.slice(33, 44) + this.billet.field_dvs[3];
    };
    /**
     * Check if the given barcode is valid by comparing the given DV with a calculated one
     * @param barcode 44 digits code
     */
    TributeBillet.isBarcodeValid = function (barcode) {
        if (barcode[0] !== "8") {
            return false;
        }
        // tslint:disable-next-line: variable-name
        var value_type = barcode[2];
        var dv = barcode[3];
        var sliced = barcode.slice(0, 3) + barcode.slice(4, 44);
        if (dv === dvMod.get(value_type)(sliced)) {
            return true;
        }
        return false;
    };
    /**
     * Check if the given line is valid by comparing the given DVs with a calculated one
     * @param line 48 digits code
     */
    TributeBillet.isLineValid = function (line) {
        if (line[0] !== "8") {
            return false;
        }
        // tslint:disable-next-line: variable-name
        var value_type = line[2];
        var dvs = [line[3], line[11], line[23], line[35], line[47]];
        var entries = [line.slice(0, 11), line.slice(12, 23), line.slice(24, 35), line.slice(36, 47)];
        var sliced = entries.join("").slice(0, 3) + entries.join("").slice(4, 44);
        if (dvs[0] === dvMod.get(value_type)(sliced) &&
            dvs[1] === dv_1.mod10(entries[0]) &&
            dvs[2] === dv_1.mod10(entries[1]) &&
            dvs[3] === dv_1.mod10(entries[2]) &&
            dvs[4] === dv_1.mod10(entries[3])) {
            return true;
        }
        return false;
    };
    return TributeBillet;
}());
exports.TributeBillet = TributeBillet;
//# sourceMappingURL=tribute.js.map