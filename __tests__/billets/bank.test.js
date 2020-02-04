"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mockdate_1 = __importDefault(require("mockdate"));
var moment_1 = __importDefault(require("moment"));
var bank_1 = require("../../src/billets/bank");
describe("Testing bank due date factor", function () {
    it("[2020-01-01] Bank due date converter", function () {
        mockdate_1.default.set("2020-01-01T12:00:00-0300");
        expect(bank_1.BankBillet.bankDate(5120).format("DD-MM-YYYY")).toBe("07-10-1997"); // Invalid range
        expect(bank_1.BankBillet.bankDate(5121).format("DD-MM-YYYY")).toBe("15-10-2011"); // Minimum valid
        expect(bank_1.BankBillet.bankDate(6000).format("DD-MM-YYYY")).toBe("12-03-2014");
        expect(bank_1.BankBillet.bankDate(8000).format("DD-MM-YYYY")).toBe("02-09-2019");
        expect(bank_1.BankBillet.bankDate(8121).format("DD-MM-YYYY")).toBe("01-01-2020"); // Today
        expect(bank_1.BankBillet.bankDate(9999).format("DD-MM-YYYY")).toBe("21-02-2025");
        expect(bank_1.BankBillet.bankDate(1000).format("DD-MM-YYYY")).toBe("22-02-2025");
        expect(bank_1.BankBillet.bankDate(1001).format("DD-MM-YYYY")).toBe("23-02-2025");
        expect(bank_1.BankBillet.bankDate(4000).format("DD-MM-YYYY")).toBe("11-05-2033");
        expect(bank_1.BankBillet.bankDate(4621).format("DD-MM-YYYY")).toBe("22-01-2035"); // Maximum valid
        expect(bank_1.BankBillet.bankDate(4622).format("DD-MM-YYYY")).toBe("07-10-1997"); // Invalid range
    });
    it("[2050-01-01] Bank due date converter", function () {
        mockdate_1.default.set("2050-01-01T12:00:00-0300");
        expect(bank_1.BankBillet.bankDate(7078).format("DD-MM-YYYY")).toBe("07-10-1997"); // Invalid range
        expect(bank_1.BankBillet.bankDate(7079).format("DD-MM-YYYY")).toBe("15-10-2041"); // Minimum valid
        expect(bank_1.BankBillet.bankDate(1079).format("DD-MM-YYYY")).toBe("01-01-2050"); // Today
        expect(bank_1.BankBillet.bankDate(6579).format("DD-MM-YYYY")).toBe("22-01-2065"); // Maximum valid
        expect(bank_1.BankBillet.bankDate(6580).format("DD-MM-YYYY")).toBe("07-10-1997"); // Invalid range
    });
});
describe("Test bank billet creation", function () {
    it("Create simple billet", function () {
        mockdate_1.default.set("2020-01-01T12:00:00-0300");
        var bank = bank_1.BankBillet.createBillet(123, 10, "237");
        var billet = bank.getBillet();
        expect(Number(billet.value)).toBe(12300);
        expect(billet.due).toBe("8131");
        expect(billet.date.format("DD-MM-YYYY")).toBe(moment_1.default().add(10, "days").format("DD-MM-YYYY"));
        expect(billet.bank).toBe("237");
        expect(billet.currency).toBe("9");
        expect(billet.dv).toBe("2");
        expect(bank.toBarcode()).toBe("23792813100000123000000000000000000000000000");
        expect(bank.toLine()).toBe("23790000090000000000000000000000281310000012300");
    });
    it("Create billet without bank definition", function () {
        mockdate_1.default.set("2020-01-01T12:00:00-0300");
        var bank = bank_1.BankBillet.createBillet(123, 10);
        var billet = bank.getBillet();
        expect(Number(billet.value)).toBe(12300);
        expect(billet.due).toBe("8131");
        expect(billet.date.format("DD-MM-YYYY")).toBe(moment_1.default().add(10, "days").format("DD-MM-YYYY"));
        expect(billet.bank).toBe("237");
        expect(billet.currency).toBe("9");
        expect(billet.dv).toBe("2");
        expect(bank.toBarcode()).toBe("23792813100000123000000000000000000000000000");
        expect(bank.toLine()).toBe("23790000090000000000000000000000281310000012300");
    });
    it("Create invalid billet", function () {
        mockdate_1.default.set("2020-01-01T12:00:00-0300");
        expect(function () { return bank_1.BankBillet.createBillet(123, 10, "xxx"); }).toThrowError("Invalid parameters");
    });
});
// TODO reacreate this tests with the constructor
describe("Test bank billet parser", function () {
    it("Invalid barcode", function () {
        expect(function () { return bank_1.BankBillet.parseBillet("23791880300000010000007000000000000000000000"); })
            .toThrowError("Invalid barcode");
    });
    it("Invalid line", function () {
        expect(function () { return bank_1.BankBillet.parseBillet("93790000090000000000000000000000281310000012300"); })
            .toThrowError("Invalid line");
    });
    it("Billet format error", function () {
        expect(function () { return bank_1.BankBillet.parseBillet("237918803000000100000xxxx00000000000000000"); }).toThrowError("Billet format error");
    });
    it("Parse barcode", function () {
        mockdate_1.default.set("2020-01-01T12:00:00-0300");
        var bank = bank_1.BankBillet.parseBillet("23792813100000123000000000000000000000000000");
        var billet = bank.getBillet();
        expect(Number(billet.value)).toBe(12300);
        expect(billet.due).toBe("8131");
        expect(billet.date.format("DD-MM-YYYY")).toBe(moment_1.default("11-01-2020", "DD-MM-YYYY").format("DD-MM-YYYY"));
        expect(billet.bank).toBe("237");
        expect(billet.currency).toBe("9");
        expect(billet.dv).toBe("2");
        expect(bank.toBarcode()).toBe("23792813100000123000000000000000000000000000");
        expect(bank.toLine()).toBe("23790000090000000000000000000000281310000012300");
        expect(bank_1.BankBillet.parseBillet(bank.toBarcode())).not.toBe(undefined);
    });
    it("Parse line", function () {
        mockdate_1.default.set("2020-01-01T12:00:00-0300");
        var bank = bank_1.BankBillet.parseBillet("23790000090000000000000000000000281310000012300");
        var billet = bank.getBillet();
        expect(Number(billet.value)).toBe(12300);
        expect(billet.due).toBe("8131");
        expect(billet.date.format("DD-MM-YYYY")).toBe(moment_1.default("11-01-2020", "DD-MM-YYYY").format("DD-MM-YYYY"));
        expect(billet.bank).toBe("237");
        expect(billet.currency).toBe("9");
        expect(billet.dv).toBe("2");
        expect(bank.toBarcode()).toBe("23792813100000123000000000000000000000000000");
        expect(bank.toLine()).toBe("23790000090000000000000000000000281310000012300");
        expect(bank_1.BankBillet.parseBillet(bank.toLine())).not.toBe(undefined);
    });
});
//# sourceMappingURL=bank.test.js.map