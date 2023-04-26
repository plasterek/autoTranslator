import express from "express";
import cookieParser from "cookie-parser";
import { TranslateController } from "../TranslateController/Translate.controller";
import { AvailableLanguagesService } from "../AvailableLanguagesService/AvailableLanguages.service";
import { TranslateService } from "../TranslateService/Translate.service";
import dotenv from "dotenv";
dotenv.config();

const PORT: string = process.env.PORT || "5000";
const app = express();
app.listen(PORT, () => console.log(`Server started on ${PORT}`));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookies? - do czego to wykorzystać?
app.use(cookieParser());
app.use(function (req, res, next) {
  var cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    var randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);
    res.cookie("cookieName", randomNumber, { maxAge: 900000, httpOnly: true });
    console.log("cookie created successfully");
  } else {
    console.log("Cookie exist: ", cookie);
  }
  next();
});
app.use(express.static(__dirname + "/dist"));

// Init App
const translateService: TranslateService = new TranslateService();
const availableLanguagesService: AvailableLanguagesService = new AvailableLanguagesService();
const translateApp: TranslateController = new TranslateController(translateService, availableLanguagesService);
translateApp.initRoutes(app);
