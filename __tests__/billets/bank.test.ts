import MockDate from "mockdate"
import moment from "moment"
import { BankBillet } from "../../src/billets/bank"

describe("Testing bank due date factor", () => {
  it("Bank due date converter must return errors for values bellow 1000", () => {
    expect(() => BankBillet.bankDate(0)).toThrowError("Invalid bank due date") // Invalid range
    expect(() => BankBillet.bankDate(999)).toThrowError("Invalid bank due date") // Invalid range
    expect(() => BankBillet.bankDate(1000)).not.toThrowError("Invalid bank due date") // Valid range
  })

  it("[2020-01-01] Bank due date converter", () => {
    MockDate.set("2020-01-01T12:00:00-0300")

    expect(() => BankBillet.bankDate(5120)).toThrowError("Invalid bank due date") // Invalid range

    expect(BankBillet.bankDate(5121).format("DD-MM-YYYY")).toBe("15-10-2011") // Minimum valid
    expect(BankBillet.bankDate(6000).format("DD-MM-YYYY")).toBe("12-03-2014")
    expect(BankBillet.bankDate(8000).format("DD-MM-YYYY")).toBe("02-09-2019")
    expect(BankBillet.bankDate(8121).format("DD-MM-YYYY")).toBe("01-01-2020") // Today
    expect(BankBillet.bankDate(9999).format("DD-MM-YYYY")).toBe("21-02-2025")

    expect(BankBillet.bankDate(1000).format("DD-MM-YYYY")).toBe("22-02-2025")
    expect(BankBillet.bankDate(1001).format("DD-MM-YYYY")).toBe("23-02-2025")
    expect(BankBillet.bankDate(4000).format("DD-MM-YYYY")).toBe("11-05-2033")
    expect(BankBillet.bankDate(4621).format("DD-MM-YYYY")).toBe("22-01-2035") // Maximum valid

    expect(() => BankBillet.bankDate(4622)).toThrowError("Invalid bank due date") // Invalid range
  })

  it("[2050-01-01] Bank due date converter", () => {
    MockDate.set("2050-01-01T12:00:00-0300")

    expect(() => BankBillet.bankDate(7078)).toThrowError("Invalid bank due date") // Invalid range

    expect(BankBillet.bankDate(7079).format("DD-MM-YYYY")).toBe("15-10-2041") // Minimum valid
    expect(BankBillet.bankDate(1079).format("DD-MM-YYYY")).toBe("01-01-2050") // Today
    expect(BankBillet.bankDate(6579).format("DD-MM-YYYY")).toBe("22-01-2065") // Maximum valid

    expect(() => BankBillet.bankDate(6580)).toThrowError("Invalid bank due date") // Invalid range
  })
})

describe("Test bank billet creation", () => {
  it("Create simple billet", () => {
    MockDate.set("2020-01-01T12:00:00-0300")
    const bank = BankBillet.createBillet(123, 10, "237")
    const billet = bank.getBillet()

    expect(Number(billet.value)).toBe(12300)
    expect(billet.due).toBe("8131")
    expect(billet.date.format("DD-MM-YYYY")).toBe(moment().add(10, "days").format("DD-MM-YYYY"))
    expect(billet.bank).toBe("237")
    expect(billet.currency).toBe("9")
    expect(billet.dv).toBe("2")
    expect(bank.toBarcode()).toBe("23792813100000123000000000000000000000000000")
    expect(bank.toLine()).toBe("23790000090000000000000000000000281310000012300")
  })

  it("Create billet without bank definition", () => {
    MockDate.set("2020-01-01T12:00:00-0300")
    const bank = BankBillet.createBillet(123, 10)
    const billet = bank.getBillet()

    expect(Number(billet.value)).toBe(12300)
    expect(billet.due).toBe("8131")
    expect(billet.date.format("DD-MM-YYYY")).toBe(moment().add(10, "days").format("DD-MM-YYYY"))
    expect(billet.bank).toBe("237")
    expect(billet.currency).toBe("9")
    expect(billet.dv).toBe("2")
    expect(bank.toBarcode()).toBe("23792813100000123000000000000000000000000000")
    expect(bank.toLine()).toBe("23790000090000000000000000000000281310000012300")
  })

  it("Create invalid billet", () => {
    MockDate.set("2020-01-01T12:00:00-0300")
    expect(() => BankBillet.createBillet(123, 10, "xxx")).toThrowError("Bank unknown")
  })
})

// TODO reacreate this tests with the constructor
describe("Test bank billet parser", () => {
  it("Invalid barcode", () => {
    expect(() => BankBillet.parseBillet("23791880300000010000007000000000000000000000")).toThrowError("Invalid barcode")
  })

  it("Invalid line", () => {
    expect(() => BankBillet.parseBillet("93790000090000000000000000000000281310000012300")).toThrowError("Invalid line")
  })

  it("Billet format error", () => {
    expect(() => BankBillet.parseBillet("237918803000000100000xxxx00000000000000000")).toThrowError(
      "Billet format error"
    )
  })

  it("Parse barcode", () => {
    MockDate.set("2020-01-01T12:00:00-0300")
    const bank = BankBillet.parseBillet("23792813100000123000000000000000000000000000")
    const billet = bank.getBillet()

    expect(Number(billet.value)).toBe(12300)
    expect(billet.due).toBe("8131")
    expect(billet.date.format("DD-MM-YYYY")).toBe(moment("11-01-2020", "DD-MM-YYYY").format("DD-MM-YYYY"))
    expect(billet.bank).toBe("237")
    expect(billet.currency).toBe("9")
    expect(billet.dv).toBe("2")
    expect(bank.toBarcode()).toBe("23792813100000123000000000000000000000000000")
    expect(bank.toLine()).toBe("23790000090000000000000000000000281310000012300")
    expect(BankBillet.parseBillet(bank.toBarcode())).not.toBe(undefined)
  })

  it("Parse line", () => {
    MockDate.set("2020-01-01T12:00:00-0300")
    const bank = BankBillet.parseBillet("23790000090000000000000000000000281310000012300")
    const billet = bank.getBillet()

    expect(Number(billet.value)).toBe(12300)
    expect(billet.due).toBe("8131")
    expect(billet.date.format("DD-MM-YYYY")).toBe(moment("11-01-2020", "DD-MM-YYYY").format("DD-MM-YYYY"))
    expect(billet.bank).toBe("237")
    expect(billet.currency).toBe("9")
    expect(billet.dv).toBe("2")
    expect(bank.toBarcode()).toBe("23792813100000123000000000000000000000000000")
    expect(bank.toLine()).toBe("23790000090000000000000000000000281310000012300")
    expect(BankBillet.parseBillet(bank.toLine())).not.toBe(undefined)
  })

  it("Validate", () => {
    expect(BankBillet.isValid("23790000090000000000000000000000281310000012300")).toBe(true)
    expect(BankBillet.isValid("23790000090000000000000000000000281310000012302")).toBe(false)
  })
})
