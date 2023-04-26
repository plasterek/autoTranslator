import express from "express";
import { AvailableLanguagesService } from "../AvailableLanguagesService/AvailableLanguages.service";
import { TranslateService } from "../TranslateService/Translate.service";
import { TranslateRequestDTO } from "../TranslateService/models/TranslateRequest.dto";
import { TranslateResponseDTO } from "../TranslateService/models/TranslateResponse.dto";
import { TranslateControllerExceptionResponse } from "./models/TranslateControllerExceptionResponse.service";
import { TranslateGetReponseService } from "./models/TranslateGetResponse.service";
import dotenv from "dotenv";

dotenv.config();

export class TranslateController {
  constructor(
    private readonly translateService: TranslateService,
    private readonly availableLanguages: AvailableLanguagesService
  ) {
    this.availableLanguages.getListFromAPI();
  }

  public initRoutes(app: express.Application): void {
    // Main site
    app.get("/", (req: express.Request, res: express.Response): void => {
      const reponse: TranslateGetReponseService = new TranslateGetReponseService(
        "Welcome to translator APP",
        "To translate text use /translate \n To see available languages use /translate/languages"
      );
      res.status(200).send(reponse);
    });

    // Available languages
    app.get("/translate/languages", (req: express.Request, res: express.Response): void => {
      const languages: string[] = this.availableLanguages.getAvailableLanguages();
      res.status(200).send(languages);
    });

    // Translator
    app.post("/translate", async (req: express.Request, res: express.Response): Promise<any> => {
      const { text, target }: TranslateRequestDTO = req.body;
      if (text.length === 0 || target.length === 0) {
        const response: TranslateControllerExceptionResponse = new TranslateControllerExceptionResponse(
          "Missing parameters",
          "Missing 'text' or 'target' parameter"
        );
        return res.status(422).send(response);
      }
      if (!this.availableLanguages.checkIfLanguageIsAvailable(target)) {
        const response: TranslateControllerExceptionResponse = new TranslateControllerExceptionResponse(
          "Wrong language code",
          "To see available languages add /languages to current URL"
        );
        return res.status(400).send(response);
      }
      try {
        const translation: TranslateResponseDTO[] = await this.translateService.translateText(text, target);
        res.status(200).send(translation);
      } catch (err: any) {
        res.status(404).send(err);
      }
    });
  }
}
