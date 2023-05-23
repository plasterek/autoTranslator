import express from "express";
import { AvailableLanguagesService } from "../AvailableLanguagesService/AvailableLanguages.service";
import { TranslateService } from "../TranslateService/Translate.service";
import { TranslateServiceRequestDTO } from "../TranslateService/models/TranslateServiceRequest.dto";
import { TranslateServiceResponseDTO } from "../TranslateService/models/TranslateServiceResponse.dto";
import { TranslateControllerResponseDTO } from "./models/TranslateControllerResponse.dto";
import { CacheService } from "../CacheService/Cache.service";

export class TranslateController {
  constructor(
    private readonly translateService: TranslateService,
    private readonly availableLanguages: AvailableLanguagesService,
    private readonly cacheService: CacheService
  ) {
    this.availableLanguages.getListFromAPI();
  }

  public initRoutes(app: express.Application): void {
    // Main site
    app.get("/", (req: express.Request, res: express.Response): void => {
      const reponse: TranslateControllerResponseDTO = new TranslateControllerResponseDTO(
        "Welcome to translator APP",
        "To translate text use /translate \n To see available languages use /translate/languages"
      );
      res.status(200).send(reponse);
    });

    // Available languages
    app.get("/translate/languages", (req: express.Request, res: express.Response): void => {
      try {
        const languages: string[] = this.availableLanguages.getAvailableLanguages();
        res.status(200).send(languages);
      } catch (err: any) {
        const response: TranslateControllerResponseDTO = new TranslateControllerResponseDTO("Error", `${err.message}`);
        res.status(500).send(response);
      }
    });

    app.post(
      "/translate",
      (req, res, next) => this.cacheService.cacheMiddleware(req, res, next),
      async (req: express.Request, res: express.Response): Promise<any> => {
        try {
          const { text, target }: TranslateServiceRequestDTO = req.body;
          if (text.length === 0 || target.length === 0) {
            const response: TranslateControllerResponseDTO = new TranslateControllerResponseDTO("Error", "Missing 'text' or 'target' parameter in body");
            return res.status(404).send(response);
          }

          if (!this.availableLanguages.checkIfLanguageIsAvailable(target)) {
            const response: TranslateControllerResponseDTO = new TranslateControllerResponseDTO(
              "Error",
              "Wrong language code. To see available languages add /languages to current URL"
            );
            return res.status(404).send(response);
          }

          const translation: TranslateServiceResponseDTO = await this.translateService.translateText(text, target);
          this.cacheService.writeCache({ text: text, target: target, response: translation });
          return res.status(200).send(translation);
        } catch (err: any) {
          const response: TranslateControllerResponseDTO = new TranslateControllerResponseDTO("Error", err.message);
          res.status(500).send(response);
        }
      }
    );
  }
}
