import { verifyGivenString } from "../verifyGivenString.utils";

describe("verifyGivenString function", () => {
  describe("When trying to verify string but given string is empty", () => {
    it("It shoudl throw an exception", () => {
      //given
      const string: string = "";
      //then
      expect(() => verifyGivenString(string, "message")).toThrow();
    });
  });
  describe("When undefined is passed to function", () => {
    it("It should throw an exception", () => {
      //given
      const string: undefined = undefined;
      //then
      expect(() => verifyGivenString(string, "message")).toThrow();
    });
  });
  describe("When proper string is given to function", () => {
    it("It shoudl return given string", () => {
      //given
      const string: string = "string";
      //then
      expect(verifyGivenString(string, "message")).toBe(string);
    });
  });
});
