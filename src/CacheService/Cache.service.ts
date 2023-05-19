import fs from "fs";
import { CacheServiceQueryDTO } from "./models/CacheServiceQuery.dto";
import { CacheServiceResponseDTO } from "./models/CacheServiceResponse.dto";
import { TranslateServiceRequestDTO } from "../TranslateService/models/TranslateServiceRequest.dto";
import { TranslateServiceResponseDTO } from "../TranslateService/models/TranslateServiceResponse.dto";
import express, { NextFunction } from "express";
import { CacheServiceException } from "./exception/CacheService.exception";

export class CacheService {
  constructor(private readonly databaseAdress: string) {
    try {
      this.readCache();
    } catch (err: any) {
      throw new CacheServiceException("Cannot find database at given adress");
    }
  }

  public cacheMiddleware(req: express.Request, res: express.Response, next: NextFunction): void {
    try {
      const { text, target }: TranslateServiceRequestDTO = req.body;
      const query: CacheServiceQueryDTO = { text: text, target: target };
      const cache: TranslateServiceResponseDTO | false = this.returnCachedDataIfExist(query);
      if (!cache) {
        return next();
      }
      res.locals.cache = cache;
      next();
    } catch (err: any) {
      console.log(err);
      next();
    }
  }

  public returnCachedDataIfExist(query: CacheServiceQueryDTO): TranslateServiceResponseDTO | false {
    try {
      const data: CacheServiceResponseDTO[] = this.readCache();
      if (data.length === 0) return false;
      const cache: CacheServiceResponseDTO | undefined = data.find(
        (element) => element.text === query.text && element.target === query.target
      );
      if (!cache) return false;
      return cache.response;
    } catch (err: any) {
      throw new CacheServiceException(err.message);
    }
  }

  public writeCache(data: CacheServiceResponseDTO): void {
    try {
      const currentData: CacheServiceResponseDTO[] = this.readCache();
      currentData.push(data);
      return fs.writeFileSync(this.databaseAdress, JSON.stringify(currentData));
    } catch (err: any) {
      throw new CacheServiceException(err.message);
    }
  }

  public readCache(): CacheServiceResponseDTO[] {
    try {
      const bufferData: string = fs.readFileSync(this.databaseAdress, "utf8");
      const data: CacheServiceResponseDTO[] = JSON.parse(bufferData);
      return data;
    } catch (err: any) {
      throw new CacheServiceException(err.message);
    }
  }
}
