import axios from "axios";
import { AvailableLanguagesService } from "../AvailableLanguages.service";
import { AvailableLanguagesServiceException } from "../exceptions/AvailableLanguages.exception";

describe("AvailableLanguagesService class", () => {
  const languages: AvailableLanguagesService = new AvailableLanguagesService();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When trying to get list of available languages from API", () => {
    it("It should make call to API with get method", async () => {
      //given
      const get = jest.spyOn(axios, "get");
      //when
      //then
      expect(async () => await languages.getListFromAPI()).not.toThrow();
      expect(get).toBeCalled();
    });
  });

  describe("When trying to get list of available languages from API and response from API is not 200", () => {
    it("It should throw AvailableLanguagesServiceException", () => {
      //given
      const status: number = 400;
      const mockedResult: { status: number } = { status: status };
      //when
      jest.spyOn(axios, "get").mockResolvedValue(mockedResult);
      //then
      expect.assertions(1);
      expect(async () => await languages.getListFromAPI()).rejects.toThrow(AvailableLanguagesServiceException);
    });
  });

  describe("When trying to check if language is available and it is", () => {
    it("It should return true", async () => {
      //given
      const lang = "language";
      const mockedResult: { status: number; data: { data: { languages: Array<{ language: string }> } } } = {
        status: 200,
        data: { data: { languages: [{ language: lang }] } },
      };
      //when
      jest.spyOn(axios, "get").mockResolvedValue(mockedResult);
      await languages.getListFromAPI();
      //then
      expect.assertions(1);
      expect(languages.checkIfLanguageIsAvailable(lang)).toBe(true);
    });
  });

  describe("When trying to check if language is available and it is not", () => {
    it("It should return false", async () => {
      //given
      const lang = "language";
      const mockedResult: { status: number; data: { data: { languages: Array<{ language: string }> } } } = {
        status: 200,
        data: { data: { languages: [{ language: lang }] } },
      };
      //when
      jest.spyOn(axios, "get").mockResolvedValue(mockedResult);
      await languages.getListFromAPI();
      //then
      expect.assertions(1);
      expect(languages.checkIfLanguageIsAvailable("anyValue")).toBe(false);
    });
  });
});
