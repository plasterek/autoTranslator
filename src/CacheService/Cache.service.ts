import fs from "fs/promises";
import { CacheServiceQueryDTO } from "./models/CacheServiceQuery.dto";
import { CacheServiceResponseDTO } from "./models/CacheServiceResponse.dto";
import { TranslateServiceRequestDTO } from "../TranslateService/models/TranslateServiceRequest.dto";
import { TranslateServiceResponseDTO } from "../TranslateService/models/TranslateServiceResponse.dto";
import express, { NextFunction } from "express";
import { CacheServiceException } from "./exception/CacheService.exception";
import { verifyGivenString } from "../utils/verifyGivenString.utils";

export class CacheService {
  constructor(private readonly databaseAdress: string = verifyGivenString(process.env.DATABASE, "You need to provide database adress!")) {}

  public async cacheMiddleware(req: express.Request, res: express.Response, next: NextFunction) {
    try {
      const { text, target }: TranslateServiceRequestDTO = req.body;
      const query: CacheServiceQueryDTO = { text: text, target: target };
      const cachedData: TranslateServiceResponseDTO | null = await this.returnCachedDataIfExist(query);
      if (!cachedData) {
        next();
      } else {
        res.status(200).send(cachedData);
      }
    } catch (err: any) {
      throw new CacheServiceException(err);
    }
  }

  public async returnCachedDataIfExist(query: CacheServiceQueryDTO): Promise<TranslateServiceResponseDTO | null> {
    try {
      const data: CacheServiceResponseDTO[] = await this.readCachedData();
      const cachedData: CacheServiceResponseDTO | undefined = data.find((element) => element.text === query.text && element.target === query.target);
      if (cachedData) {
        return cachedData.response;
      }
      return null;
    } catch (err: any) {
      throw new CacheServiceException(err);
    }
  }

  public async writeCache(data: CacheServiceResponseDTO): Promise<void> {
    try {
      const currentData: CacheServiceResponseDTO[] = await this.readCachedData();
      currentData.push(data);
      return fs.writeFile(this.databaseAdress, JSON.stringify(currentData));
    } catch (err: any) {
      throw new CacheServiceException(err);
    }
  }

  public async readCachedData(): Promise<CacheServiceResponseDTO[]> {
    try {
      const bufferData: Buffer = await fs.readFile(this.databaseAdress);
      const stringData: string = bufferData.toString("utf8");
      const data: CacheServiceResponseDTO[] = JSON.parse(stringData);
      return data;
    } catch (err: any) {
      throw new CacheServiceException(err);
    }
  }
}
