import { CacheService } from "../Cache.service";
import { CacheServiceResponseDTO } from "../models/CacheServiceResponse.dto";
import { TranslateServiceResponseDTO } from "../../TranslateService/models/TranslateServiceResponse.dto";
import mockFs from "mock-fs";
import { CacheServiceQueryDTO } from "../models/CacheServiceQuery.dto";
import { CacheServiceException } from "../exception/CacheService.exception";

describe("CacheService class", () => {
  let cache: CacheService = new CacheService();

  beforeEach(() => {
    const mockDatabaseData: string = JSON.stringify([
      { text: "text", target: "target", response: [{ translatedText: "text", detectedSourceLanguage: "language" }] },
    ]);
    mockFs({ "database/Cache.database.json": mockDatabaseData });
  }),
    afterEach(() => {
      mockFs.restore();
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
      const write: void = await cache.writeCache(data);
      //then
      expect(async () => write).not.toThrow();
    });
  });

  describe("When trying to write to database and there is error with file system", () => {
    it("It should throw an exception", async () => {
      //given
      const response: TranslateServiceResponseDTO = { translatedText: "text", detectedSourceLanguage: "language" };
      const data: CacheServiceResponseDTO = {
        text: "randomText",
        target: "randomTarget",
        response: response,
      };
      //when
      mockFs({});
      //then
      expect(async () => cache.writeCache(data)).rejects.toThrow(CacheServiceException);
    });
  });

  describe("When trying to read from database and everything goes well", () => {
    it("It should not throw an exception", async () => {
      //when
      const read: CacheServiceResponseDTO[] = await cache.readCachedData();
      //then
      expect(async () => read).not.toThrow();
    });
  });

  describe("When trying to read from database and ther is file system error", () => {
    it("It should throw an exception", async () => {
      //when
      mockFs({ database: {} });
      //then
      expect(async () => await cache.readCachedData()).rejects.toThrow(CacheServiceException);
    });
  });

  describe("When trying to get given data from database and it does not exist in database", () => {
    it("It should return null", async () => {
      //given
      const query: CacheServiceQueryDTO = { text: "t", target: "t" };
      const result: TranslateServiceResponseDTO | null = await cache.returnCachedDataIfExist(query);
      //then
      expect(result).toBe(null);
    });
  });

  describe("When trying to get given data from database and everything goes well", () => {
    it("It should return given data", async () => {
      //given
      const response: TranslateServiceResponseDTO = { translatedText: "text", detectedSourceLanguage: "language" };
      const query: CacheServiceQueryDTO = { text: "text", target: "target" };
      const result: TranslateServiceResponseDTO | null = await cache.returnCachedDataIfExist(query);
      //when
      expect(result).toMatchObject([response]);
    });
  });
});
