import { AvailableLanguagesService } from "../AvailableLanguages.service";
import axios from "axios";
import { AvailableLanguagesException } from "../exceptions/AvailableLanguages.exception";
require("dotenv").config();

describe("AvailableLanguagesService class", () => {
  let languages: AvailableLanguagesService;
  beforeEach(() => {
    jest.clearAllMocks;
    languages = new AvailableLanguagesService("http://apiUrl.com", "apiKey");
  });

  describe("When trying to get list of available languages from API", () => {
    it("It should make call to API with get method", async () => {
      //given
      const get = jest.spyOn(axios, "get");
      //when
      try {
        await languages.getListFromAPI();
      } catch (err: any) {}
      //then
      expect.assertions(1);
      expect(get).toBeCalled();
    });
  });

  describe("When trying to get list of available languages from API and response from API is not 200", () => {
    it("It should throw AvailableLanguagesException", async () => {
      //given
      const status: number = 400;
      const message: string = "error message";
      const expectedValue: AvailableLanguagesException = `Status: ${status}, Message: ${message}`;
      const mockedResult: { status: number; data: { error: { message: string } } } = {
        status: status,
        data: { error: { message: message } },
      };
      jest.spyOn(axios, "get").mockResolvedValue(mockedResult);
      //then
      try {
        await languages.getListFromAPI();
      } catch (err: any) {
        expect.assertions(2);
        expect(err).toBeInstanceOf(Error);
        expect(err.message).toBe(expectedValue);
      }
    });
  });

  describe("When trying to get list of available languages from API and API call fails", () => {
    it("It shoudl throw AvailableLanguagesException", async () => {
      //given
      jest.spyOn(axios, "get").mockRejectedValue("error");
      //then
      try {
        await languages.getListFromAPI();
      } catch (err: any) {
        expect.assertions(1);
        expect(err).toBeInstanceOf(Error);
      }
    });
  });

  describe("When trying to get list of available languages and everything goes well", () => {
    it("It should return string array", async () => {
      //given
      const expectedValue: string = "value";
      const mockedResult: { status: number; data: { data: { languages: Array<{ language: string }> } } } = {
        status: 200,
        data: { data: { languages: [{ language: expectedValue }] } },
      };
      jest.spyOn(axios, "get").mockResolvedValue(mockedResult);
      //when
      await languages.getListFromAPI();
      //then
      expect.assertions(1);
      expect(languages.getAvailableLanguages()).toMatchObject([expectedValue]);
    });
  });

  describe("When trying to get list of available languages and call to API failed", () => {
    it("It should return empty array", async () => {
      //given
      jest.spyOn(axios, "get").mockRejectedValue("error");
      //when
      try {
        await languages.getListFromAPI();
      } catch (err: any) {}
      //then
      expect.assertions(1);
      expect(languages.getAvailableLanguages()).toMatchObject([]);
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
      jest.spyOn(axios, "get").mockResolvedValue(mockedResult);
      //when
      try {
        await languages.getListFromAPI();
      } catch (err: any) {}
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
      jest.spyOn(axios, "get").mockResolvedValue(mockedResult);
      //when
      try {
        await languages.getListFromAPI();
      } catch (err: any) {}
      //then
      expect.assertions(1);
      expect(languages.checkIfLanguageIsAvailable("anyValue")).toBe(false);
    });
  });
});
