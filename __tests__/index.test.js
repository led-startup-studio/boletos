"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var bank_1 = require("../src/billets/bank");
var tribute_1 = require("../src/billets/tribute");
var index_1 = __importDefault(require("../src/index"));
describe("Test index", function () {
    it("Bank barcode", function () {
        var billet = index_1.default.parse("23792813100000123000000000000000000000000000");
        console.log(billet);
        expect(billet instanceof bank_1.BankBillet).toBe(true);
    });
    it("Bank line", function () {
        var billet = index_1.default.parse("23790000090000000000000000000000281310000012300");
        expect(billet instanceof bank_1.BankBillet).toBe(true);
    });
    it("Tribute barcode", function () {
        var billet = index_1.default.parse("80860000001230000000000000000000000000000000");
        expect(billet instanceof tribute_1.TributeBillet).toBe(true);
    });
    it("Tribute line", function () {
        var billet = index_1.default.parse("808600000018230000000003000000000000000000000000");
        expect(billet instanceof tribute_1.TributeBillet).toBe(true);
    });
    it("Invalid input", function () {
        // let billet;
        var r = function () { return (index_1.default.parse("xxx")); };
        expect(r()).toThrow("Billet format error");
        // expect(billet).toBe(undefined);
    });
});
//# sourceMappingURL=index.test.js.map