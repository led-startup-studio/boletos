import { BankBillet } from "../src/billets/bank"
import { TributeBillet } from "../src/billets/tribute"
import Billets from "../src/index"

describe("Test index", () => {
  it("Bank barcode", () => {
    const billet = Billets.parse("23792813100000123000000000000000000000000000")
    expect(billet instanceof BankBillet).toBe(true)
  })
  it("Bank line", () => {
    const billet = Billets.parse("23790000090000000000000000000000281310000012300")
    expect(billet instanceof BankBillet).toBe(true)
  })
  it("Tribute barcode", () => {
    const billet = Billets.parse("80860000001230000000000000000000000000000000")
    expect(billet instanceof TributeBillet).toBe(true)
  })
  it("Tribute line", () => {
    const billet = Billets.parse("808600000018230000000003000000000000000000000000")
    expect(billet instanceof TributeBillet).toBe(true)
  })
  it("Invalid input", () => {
    // let billet;
    expect(() => Billets.parse("xxx")).toThrowError("Billet format error")
  })

  it("isValid", () => {
    expect(Billets.isValid("23790000090000000000000000000000281310000012300")).toBe(true)
    expect(Billets.isValid("23790000090000000000000000000000281310000012302")).toBe(false)
    expect(Billets.isValid("808600000018230000000003000000000000000000000000")).toBe(true)
    expect(Billets.isValid("808600000018230000000003000000000000000000000002")).toBe(false)
  })

  it("Tribute isValid", () => {
    expect(Billets.isTributeValid("808600000018230000000003000000000000000000000000")).toBe(true)
    expect(Billets.isTributeValid("808600000018230000000003000000000000000000000002")).toBe(false)
  })

  it("Bank isValid", () => {
    expect(Billets.isBankValid("23790000090000000000000000000000281310000012300")).toBe(true)
    expect(Billets.isBankValid("23790000090000000000000000000000281310000012302")).toBe(false)
  })
})
