import axios from "axios";
import { TranslateService } from "../Translate.service";
import { TranslateServiceException } from "../exceptions/TranslateService.exception";

describe("TranslateService class", () => {
  const translate: TranslateService = new TranslateService();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When trying to translate text and API response was not 200", () => {
    it("It should throw TranslateException", async () => {
      //given
      const status: number = 400;
      const mockedResult: { status: number } = {
        status: status,
      };
      //when
      jest.spyOn(axios, "post").mockResolvedValue(mockedResult);
      //then
      expect(() => translate.translateText("text", "language")).rejects.toThrow(TranslateServiceException);
    });
  });

  describe("When trying to translate text and string provided as API key was not valid", () => {
    it("It should throw TranslateException", async () => {
      //given
      process.env.API_KEY = "";
      //when
      jest.spyOn(axios, "post");
      //then
      expect(() => translate.translateText("text", "language")).rejects.toThrow(TranslateServiceException);
    });
  });

  describe("When trying to translate text and string provided as API url was not valid", () => {
    it("It should throw TranslateException", async () => {
      //given
      process.env.API_URL = "";
      //when
      jest.spyOn(axios, "post");
      //then
      expect(() => translate.translateText("text", "language")).rejects.toThrow(TranslateServiceException);
    });
  });

  describe("When trying to translate text and everything went well", () => {
    it("It should return array with translations", async () => {
      //given
      const expectedTranslation = [
        {
          translatedText: "Welcome to my home",
          detectedSourceLanguage: "pl",
        },
      ];
      const mockedResult: {
        status: number;
        data: { data: { translations: Array<{ translatedText: string; detectedSourceLanguage: string }> } };
      } = {
        status: 200,
        data: { data: { translations: expectedTranslation } },
      };
      //when
      jest.spyOn(axios, "post").mockResolvedValue(mockedResult);
      //then
      const result = await translate.translateText("text", "language");
      expect(result).toMatchObject(expectedTranslation);
    });
  });
});
