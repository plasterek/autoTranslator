import express from "express";
import { AvailableLanguagesService } from "../AvailableLanguagesService/AvailableLanguages.service";
import { TranslateService } from "../TranslateService/Translate.service";
require("dotenv").config();

const PORT: string = process.env.PORT || "5000";
const apiKey: string | undefined = process.env.API_KEY;
const translateApiUrl: string | undefined = process.env.API_URL;
const availableLanguagesApiUrl: string | undefined = process.env.LANG_API_URL;
if (!apiKey || !translateApiUrl || !availableLanguagesApiUrl || !PORT) throw new Error("Data missing in .env file");

const translate: TranslateService = new TranslateService(translateApiUrl, apiKey);
const availableLanguages: AvailableLanguagesService = new AvailableLanguagesService(availableLanguagesApiUrl, apiKey);
availableLanguages.getListFromAPI();

// App
const app = express();
app.listen(PORT, () => console.log(`Server started on ${PORT}`));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Main site
app.get("/", (req, res) => {
  const reponse: { message: string; description: string } = {
    message: "Welcome to translator APP",
    description: "To translate text use /translate \n To see available languages use /translate/languages",
  };
  res.status(200).send(reponse);
});

// Available languages
app.get("/translate/languages", (req, res) => {
  const languages: string[] = availableLanguages.getAvailableLanguages();
  res.status(200).send(languages);
});

// Translator
app.post("/translate", async (req, res) => {
  const text: string = req.body.text;
  const target: string = req.body.target;
  if (!availableLanguages.checkIfLanguageIsAvailable(target)) {
    return res
      .status(400)
      .send({ error: "Wrong language code", description: "To see available languages add /languages to current URL" });
  }
  try {
    const translation: {
      translatedText: string;
      detectedSourceLanguage: string;
    }[] = await translate.translateText(text, target);
    res.status(200).send(translation);
  } catch (err: any) {
    res.status(404).send({ message: "Something went wrong", descrpiton: err.message });
  }
});
