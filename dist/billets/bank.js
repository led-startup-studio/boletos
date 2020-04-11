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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line
var moment_1 = __importDefault(require("moment"));
var banks_1 = require("../utils/banks");
var dv_1 = require("../utils/dv");
// This is the factor used by the banks to start the due date counter
exports.rootFactorDate = moment_1.default("07-10-1997", "DD-MM-YYYY").utcOffset("America/Sao_Paulo");
exports.firstFactorDate = moment_1.default("03-07-2000", "DD-MM-YYYY").utcOffset("America/Sao_Paulo");
var BankBillet = /** @class */ (function () {
    function BankBillet() {
        this.billet = {};
    }
    /**
     * Parse barcode or digitable line to bank billet
     * @param billet Barcode (44 digits) or digitable line (47 digits)
     */
    BankBillet.parseBillet = function (billet) {
        var bank = new BankBillet();
        if ((billet.length !== 44 && billet.length !== 47) || !billet.match(/^[0-9]+$/)) {
            throw new Error("Billet format error");
        }
        if (billet.length === 44) {
            if (!BankBillet.isBarcodeValid(billet)) {
                throw new Error("Invalid barcode");
            }
            bank.billet = BankBillet.parseBarcode(billet);
        }
        if (billet.length === 47) {
            if (!BankBillet.isLineValid(billet)) {
                throw new Error("Invalid line");
            }
            bank.billet = BankBillet.parseLine(billet);
        }
        return bank;
    };
    /**
     * Create a new bank billet
     * @param value value in following format R$ 0.000,00
     * @param expiry how many days to be expired
     * @param bank is a key for a choosen bank (e.g.: "237", "001", etc.)
     */
    BankBillet.createBillet = function (value, expiry, bank) {
        var isBellowMaximumValue = String(value * 100).length <= 10;
        var hasValidExpireDate = expiry <= 5500;
        var bankIsValid = !bank || banks_1.list.has(bank);
        if (!isBellowMaximumValue || !hasValidExpireDate || !bankIsValid) {
            throw new Error("Invalid parameters");
        }
        var today = moment_1.default().utcOffset("America/Sao_Paulo");
        // Calculates the current, previous and next factor dates based on the current date
        var passedDaysFromFactor = today.diff(exports.firstFactorDate, "days") + Number(expiry);
        var dueDays = (passedDaysFromFactor % 9000) + 1000;
        var bankBillet = new BankBillet();
        bankBillet.billet = {
            value: String(value * 100).padStart(10, "0"),
            currency: "9",
            due: String(dueDays).padStart(4, "0"),
            date: today.clone().add(Number(expiry), "days"),
            bank: bank ? bank : "237",
            dv: "0",
            open_fields: [
                "0".repeat(5),
                "0".repeat(10),
                "0".repeat(10),
            ],
            field_dvs: [
                "0",
                "0",
                "0",
            ],
        };
        var barcode = bankBillet.toBarcode();
        bankBillet.billet.dv = dv_1.mod11(barcode.slice(0, 4) + barcode.slice(5, 44));
        bankBillet.billet.field_dvs = [
            dv_1.mod10(bankBillet.billet.bank + bankBillet.billet.currency + bankBillet.billet.open_fields[0]),
            dv_1.mod10(bankBillet.billet.open_fields[1]),
            dv_1.mod10(bankBillet.billet.open_fields[2]),
        ];
        return bankBillet;
    };
    /**
     * Get billet information
     */
    BankBillet.prototype.getBillet = function () {
        return this.billet;
    };
    /**
     * Parse the barcode reding each property
     * @param barcode 44 digits number
     */
    BankBillet.parseBarcode = function (barcode) {
        var bank = {
            bank: barcode.slice(0, 3),
            currency: barcode.slice(3, 4),
            dv: barcode.slice(4, 5),
            due: barcode.slice(5, 9),
            date: BankBillet.bankDate(Number(barcode.slice(5, 9))),
            value: barcode.slice(9, 19),
            open_fields: [
                barcode.slice(19, 24),
                barcode.slice(24, 34),
                barcode.slice(34, 44),
            ],
            field_dvs: [],
        };
        bank.field_dvs = [
            dv_1.mod10(bank.bank + bank.currency + bank.open_fields[0]),
            dv_1.mod10(bank.open_fields[1]),
            dv_1.mod10(bank.open_fields[2]),
        ];
        return bank;
    };
    /**
     * Parse a 47 number bank billet
     * @param line 47 digitable line from the bank billet
     */
    BankBillet.parseLine = function (line) {
        return {
            bank: line.slice(0, 3),
            currency: line.slice(3, 4),
            dv: line.slice(32, 33),
            due: line.slice(33, 37),
            date: BankBillet.bankDate(Number(line.slice(33, 37))),
            value: line.slice(37, 47),
            open_fields: [
                line.slice(4, 9),
                line.slice(10, 20),
                line.slice(21, 31),
            ],
            field_dvs: [
                line.slice(9, 10),
                line.slice(20, 21),
                line.slice(31, 32),
            ],
        };
    };
    BankBillet.prototype.toBarcode = function () {
        return this.billet.bank
            + this.billet.currency
            + this.billet.dv
            + this.billet.due
            + this.billet.value
            + this.billet.open_fields[0]
            + this.billet.open_fields[1]
            + this.billet.open_fields[2];
    };
    BankBillet.prototype.toLine = function () {
        return this.billet.bank
            + this.billet.currency
            + this.billet.open_fields[0]
            + this.billet.field_dvs[0]
            + this.billet.open_fields[1]
            + this.billet.field_dvs[1]
            + this.billet.open_fields[2]
            + this.billet.field_dvs[2]
            + this.billet.dv
            + this.billet.due
            + this.billet.value;
    };
    /**
     * Check if the given barcode is valid by comparing the given DV with a calculated one
     * @param barcode 44 digits code
     */
    // tslint:disable-next-line: member-ordering
    BankBillet.isBarcodeValid = function (barcode) {
        var givenDV = barcode[4];
        var sliced = barcode.slice(0, 4) + barcode.slice(5, 44);
        if (givenDV === dv_1.mod11(sliced)) {
            return true;
        }
        return false;
    };
    /**
     * Check if the given line is valid by comparing the given DVs with a calculated one
     * @param line 47 digits code
     */
    BankBillet.isLineValid = function (line) {
        var entries = [line.slice(0, 4), line.slice(33, 47), line.slice(4, 9), line.slice(10, 20), line.slice(21, 31)];
        var dvs = [line[9], line[20], line[31], line[32]]; // X Y Z K
        if (dvs[0] === dv_1.mod10(entries[0] + entries[2]) &&
            dvs[1] === dv_1.mod10(entries[3]) &&
            dvs[2] === dv_1.mod10(entries[4]) &&
            dvs[3] === dv_1.mod11(entries.join(""))) {
            return true;
        }
        return false;
    };
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
    /// todo change to protected
    BankBillet.bankDate = function (due) {
        if (due >= 1000) {
            var today = moment_1.default().utcOffset("America/Sao_Paulo");
            // Calculates the current, previous and next factor dates based on the current date
            var passedDaysFromFactor = today.diff(exports.firstFactorDate, "days");
            var todaysFactorDays = (passedDaysFromFactor % 9000) + 1000;
            var todaysFactorDate = today.clone().subtract(todaysFactorDays - 1000, "days");
            var previousFactorDate = todaysFactorDate.clone().subtract(9000, "days");
            var nextFactorDate = todaysFactorDate.clone().add(9000, "days");
            // Number of days passed of the factor date
            var daysFromFactor = due - 1000;
            // Check if the due days is in the same factor of current date
            var diff = todaysFactorDate.clone().add(daysFromFactor, "days").diff(today, "days");
            if (diff >= -3000 && diff <= 5500) {
                return todaysFactorDate.clone().add(daysFromFactor, "days");
            }
            // Check if the due days is in the preivous factor of current date
            diff = previousFactorDate.clone().add(daysFromFactor, "days").diff(today, "days");
            if (diff >= -3000 && diff <= 5500) {
                return previousFactorDate.clone().add(daysFromFactor, "days");
            }
            // Check if the due days is in the next factor of current date
            diff = nextFactorDate.clone().add(daysFromFactor, "days").diff(today, "days");
            if (diff >= -3000 && diff <= 5500) {
                return nextFactorDate.clone().add(daysFromFactor, "days");
            }
        }
        // If none of the conditions above is met, then it is returned a "invalid" date
        throw new Error("Invalid bank due date");
    };
    return BankBillet;
}());
exports.BankBillet = BankBillet;
//# sourceMappingURL=bank.js.map