import { BankBillet } from "../src/billets/bank";
import { TributeBillet } from "../src/billets/tribute";
import Billets from "../src/index";

describe("Test index", () => {
    it("Bank barcode", () => {
        const billet = Billets.parse("23792813100000123000000000000000000000000000");
        expect(billet instanceof BankBillet).toBe(true);
    });
    it("Bank line", () => {
        const billet = Billets.parse("23790000090000000000000000000000281310000012300");
        expect(billet instanceof BankBillet).toBe(true);

    });
    it("Tribute barcode", () => {
        const billet = Billets.parse("80860000001230000000000000000000000000000000");
        expect(billet instanceof TributeBillet).toBe(true);
    });
    it("Tribute line", () => {
        const billet = Billets.parse("808600000018230000000003000000000000000000000000");
        expect(billet instanceof TributeBillet).toBe(true);
    });
    it("Invalid input", () => {
        // let billet;
        expect(() => Billets.parse("xxx")).toThrowError("Billet format error");
    });
});
