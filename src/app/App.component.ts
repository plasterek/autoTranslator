import express from "express";
import { TranslateController } from "../TranslateController/Translate.controller";
import { AvailableLanguagesService } from "../AvailableLanguagesService/AvailableLanguages.service";
import { TranslateService } from "../TranslateService/Translate.service";
import { CacheService } from "../CacheService/Cache.service";
import dotenv from "dotenv";
dotenv.config();

const PORT: string = process.env.PORT || "5000";
const app = express();
app.listen(PORT, () => console.log(`Server started on ${PORT}`));

const cacheService = new CacheService("./database/Cache.database.json");
const translateService: TranslateService = new TranslateService();
const availableLanguagesService: AvailableLanguagesService = new AvailableLanguagesService();
const translateApp: TranslateController = new TranslateController(
  translateService,
  availableLanguagesService,
  cacheService
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Init App
translateApp.initRoutes(app);
