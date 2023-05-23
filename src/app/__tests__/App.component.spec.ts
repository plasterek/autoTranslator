import { TranslateService } from "../../TranslateService/Translate.service";
import { CacheService } from "../../CacheService/Cache.service";
import request from "supertest";
const makeRequest = request("http://localhost:5000");
import fs from "fs/promises";

describe("Testing API endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("When making get request to main adress", () => {
    it("It should respond with 200 status and welcome message", async () => {
      const response = await makeRequest.get("/");
      const body = response.body;
      expect(response.status).toEqual(200);
    });
  });

  describe("When making get request to /translate/languages", () => {
    it("It should respond with 200 status and string[]", async () => {
      const response = await makeRequest.get("/translate/languages");
      expect(response.status).toEqual(200);
      expect(response.body).toBeInstanceOf(Array<string>);
    });
  });

  describe("When making post request to /translate", () => {
    it("It should respond with 200 and translated text with detected language", async () => {
      const response = await makeRequest.post("/translate").send({ text: "tekst", target: "en" });
      expect(response.status).toEqual(200);
    });
  });

  describe("When making post request to /translate and text or target is empty string", () => {
    it("It shoudl respond with 404 status", async () => {
      const response = await makeRequest.post("/translate").send({ text: "", target: "" });
      expect(response.status).toEqual(404);
    });
  });

  describe("When making post request to /translate and posting wrong body format", () => {
    it("It shoudl respond with 500 status", async () => {
      const response = await makeRequest.post("/translate").send({});
      expect(response.status).toEqual(500);
    });
  });
});
