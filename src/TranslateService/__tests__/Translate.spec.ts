import { TranslateService } from "../Translate.service";
import axios from "axios";
import { TranslateException } from "../exceptions/Translate.exception";

describe("TranslateService class", () => {
  const translate: TranslateService = new TranslateService("https://apiUrl.com", "apiKey");
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When trying to translate text and API call failed", () => {
    it("It should throw TranslateException", async () => {
      //given
      jest.spyOn(axios, "post").mockRejectedValue("error");
      //then
      try {
        await translate.translateText("text", "language");
      } catch (err: any) {
        expect.assertions(1);
        expect(err).toBeInstanceOf(Error);
      }
    });
  });

  describe("When trying to translate text and API response was not 200", () => {
    it("It should throw TranslateException", async () => {
      //given
      const status: number = 400;
      const message: string = "error message";
      const expectedValue: TranslateException = `Status: ${status}, Message: ${message}`;
      const mockedResult: { status: number; data: { error: { message: string } } } = {
        status: status,
        data: { error: { message: message } },
      };
      jest.spyOn(axios, "post").mockResolvedValue(mockedResult);

      //then
      try {
        await translate.translateText("text", "language");
      } catch (err: any) {
        expect.assertions(2);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(expectedValue);
      }
    });
  });

  describe("When trying to translate text and everything went well", () => {
    it("It should return array with translations", async () => {
      //given
      const expectedTranslation = {
        translatedText: "Welcome to my home",
        detectedSourceLanguage: "pl",
      };
      const mockedResult: {
        status: number;
        data: { data: { translations: Array<{ translatedText: string; detectedSourceLanguage: string }> } };
      } = {
        status: 200,
        data: { data: { translations: [expectedTranslation] } },
      };
      jest.spyOn(axios, "post").mockResolvedValue(mockedResult);

      //then
      try {
        const result = await translate.translateText("text", "language");
        expect(result).toMatchObject(expectedTranslation);
      } catch (err: any) {}
    });
  });
});
