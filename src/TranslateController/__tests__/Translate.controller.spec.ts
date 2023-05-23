import { AvailableLanguagesService } from "../../AvailableLanguagesService/AvailableLanguages.service";
import { CacheService } from "../../CacheService/Cache.service";
import { TranslateService } from "../../TranslateService/Translate.service";
import { TranslateController } from "../Translate.controller";

describe("Translate controller class", () => {
  const cacheAdress: string = "./src/CacheService/__tests__/TestCache.database.json";
  const translateService: TranslateService = new TranslateService();
  const languages: AvailableLanguagesService = new AvailableLanguagesService();
  const cache: CacheService = new CacheService(cacheAdress);
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When creating new Translaslate controller class", () => {
    it("getListFromAPI from AvailableLanguagesService should be called", () => {
      //when
      const getList = jest.spyOn(languages, "getListFromAPI");
      new TranslateController(translateService, languages, cache);
      //then
      expect(getList).toBeCalled();
    });
  });
});
