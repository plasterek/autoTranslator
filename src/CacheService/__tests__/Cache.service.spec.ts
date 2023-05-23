import { CacheService } from "../Cache.service";
import { CacheServiceException } from "../exception/CacheService.exception";
import { CacheServiceResponseDTO } from "../models/CacheServiceResponse.dto";
import { TranslateServiceResponseDTO } from "../../TranslateService/models/TranslateServiceResponse.dto";
import fs from "fs/promises";
import { CacheServiceQueryDTO } from "../models/CacheServiceQuery.dto";

describe("CacheService class", () => {
  const cache: CacheService = new CacheService();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When trying to write to database and everything goes well", () => {
    it("It should not throw an exception", async () => {
      //given
      const response: TranslateServiceResponseDTO = { translatedText: "text", detectedSourceLanguage: "language" };
      const data: CacheServiceResponseDTO = {
        text: "randomText",
        target: "randomTarget",
        response: response,
      };
      //when
      jest.spyOn(fs, "writeFile").mockImplementation();
      //then
      expect(async () => await cache.writeCache(data)).not.toThrow();
    });
  });

  describe("When trying to read from database and everything goes well", () => {
    it("It should not throw an exception", () => {
      //then
      expect(async () => await cache.readCachedData()).not.toThrow();
    });
  });

  describe("When trying to get given data from database and it does not exist in database", () => {
    it("It should return null", async () => {
      //given
      const query: CacheServiceQueryDTO = { text: "text", target: "target" };
      //then
      expect(await cache.returnCachedDataIfExist(query)).toBe(null);
    });
  });

  describe("When trying to get given data from database and everything goes well", () => {
    it("It should return given data", async () => {
      //given
      const response: TranslateServiceResponseDTO = { translatedText: "text", detectedSourceLanguage: "language" };
      const readFileMockData = JSON.stringify([{ text: "text", target: "target", response: response }]);
      const query: CacheServiceQueryDTO = { text: "text", target: "target" };
      //when
      jest.spyOn(fs, "readFile").mockResolvedValue(readFileMockData);
      expect(await cache.returnCachedDataIfExist(query)).toMatchObject(response);
    });
  });
});
