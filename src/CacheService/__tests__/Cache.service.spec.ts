import { CacheService } from "../Cache.service";
import { CacheServiceException } from "../exception/CacheService.exception";
import { CacheServiceResponseDTO } from "../models/CacheServiceResponse.dto";
import { TranslateServiceResponseDTO } from "../../TranslateService/models/TranslateServiceResponse.dto";
import fs from "fs";
import { CacheServiceQueryDTO } from "../models/CacheServiceQuery.dto";

jest.createMockFromModule("fs");

describe("CacheService class", () => {
  const databaseAdress: string = "./src/CacheService/__tests__/TestCache.database.json";
  const cache: CacheService = new CacheService(databaseAdress);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When trying to create new CacheService class and provided database adress is incorrect", () => {
    it("It should throw an CacheServiceException", () => {
      //then
      expect(() => new CacheService("wrongAdress")).toThrow(CacheServiceException);
    });
  });

  describe("When trying to write to database and everything goes well", () => {
    it("fs.writeFileSync should be called", () => {
      //given
      const response: TranslateServiceResponseDTO = { translatedText: "text", detectedSourceLanguage: "language" };
      const data: CacheServiceResponseDTO = {
        text: "text",
        target: "target",
        response: response,
      };
      //when
      const write = jest.spyOn(fs, "writeFileSync");
      cache.writeCache(data);
      //then
      expect(write).toBeCalled();
    });
  });

  describe("When trying to read from database and everything goes well", () => {
    it("fs.readFileSync should be called", () => {
      //when
      const read = jest.spyOn(fs, "readFileSync");
      cache.readCache();
      //then
      expect(read).toBeCalled();
    });
  });

  describe("When trying to get given data from database and it does not exist in database", () => {
    it("It should return false", () => {
      //given
      const readFileMockData = JSON.stringify("");
      const query: CacheServiceQueryDTO = { text: "text", target: "target" };
      //when
      jest.spyOn(fs, "readFileSync").mockReturnValue(readFileMockData);
      expect(cache.returnCachedDataIfExist(query)).toBe(false);
    });
  });

  describe("When trying to get given data from database and everything goes well", () => {
    it("It should return given data", () => {
      //given
      const response: TranslateServiceResponseDTO = { translatedText: "text", detectedSourceLanguage: "language" };
      const readFileMockData = JSON.stringify([{ text: "text", target: "target", response: response }]);
      const query: CacheServiceQueryDTO = { text: "text", target: "target" };
      //when
      jest.spyOn(fs, "readFileSync").mockReturnValue(readFileMockData);
      expect(cache.returnCachedDataIfExist(query)).toMatchObject(response);
    });
  });
});
