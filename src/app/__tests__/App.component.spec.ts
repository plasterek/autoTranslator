import request from "supertest";
import mockFs from "mock-fs";
const makeRequest = request("http://localhost:5000");
import { TranslateControllerResponseDTO } from "../../TranslateController/models/TranslateControllerResponse.dto";

describe("Testing API endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockDatabase: string = JSON.stringify([{ text: "text", target: "en", response: [{ translatedText: "text", detectedSourceLanguage: "language" }] }]);
    mockFs({
      database: {
        "Cache.database.json": mockDatabase,
      },
    });
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe("When making get request to main adress", () => {
    it("It should respond with 200 status and welcome message", async () => {
      //given
      const responseBody: TranslateControllerResponseDTO = new TranslateControllerResponseDTO(
        "Welcome to translator APP",
        "To translate text use /translate \n To see available languages use /translate/languages"
      );
      //when
      const response = await makeRequest.get("/");
      //then
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(responseBody);
    });
  });

  describe("When making get request to /translate/languages", () => {
    it("It should respond with 200 status and string[]", async () => {
      //when
      const response = await makeRequest.get("/translate/languages");
      //then
      expect(response.status).toEqual(200);
      expect(response.body).toBeInstanceOf(Array<string>);
    });
  });

  describe("When making post request to /translate", () => {
    it("It should respond with 200 and translated text with detected language", async () => {
      const response = await makeRequest.post("/translate").send({ text: "tekst", target: "en" });
      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([{ translatedText: "text", detectedSourceLanguage: "nl" }]);
    });
  });

  describe("When making post request to /translate and text or target is empty string", () => {
    it("It shoudl respond with 404 status", async () => {
      const response = await makeRequest.post("/translate").send({ text: "", target: "" });
      expect(response.status).toEqual(400);
    });
  });

  describe("When making post request to /translate and posting wrong body format", () => {
    it("It shoudl respond with 500 status", async () => {
      const response = await makeRequest.post("/translate").send({});
      expect(response.status).toEqual(500);
    });
  });
});
