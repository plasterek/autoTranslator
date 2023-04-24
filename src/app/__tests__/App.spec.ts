import axios from "axios";
import { AvailableLanguagesService } from "../../AvailableLanguagesService/AvailableLanguages.service";

describe("App tests", () => {
  const url: string = "http://localhost:5000";
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("When trying to call get on /", () => {
    it("It should return object and 200 status", async () => {
      //given
      const responseObject: { message: string; description: string } = {
        message: "Welcome to translator APP",
        description: "To translate text use /translate \n To see available languages use /translate/languages",
      };
      //when
      const response = await axios.get(url);
      //then
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(responseObject);
    });
  });

  describe("When trying to call get on /translate/languages", () => {
    it("It should respond with 200 status and string array", async () => {
      //when
      const response = await axios.get(url + "/translate/languages");
      //then
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(expect.any(Array<string>));
    });
  });

  describe("When trying to call post on /translate and sended object isn't proper", () => {
    it("It should respond with 404 and object", async () => {
      //given
      interface responseObject {
        message: string;
        descrpiton: string;
      }
      //when
      try {
        const response = await axios.post(url + "/translate/", { text: "text" });
        //then
        expect(response.status).toBe(404);
        expect(typeof response).toEqual("responseObject");
      } catch (err: any) {}
    });
  });

  describe("When trying to call post on /translate and sended object with inproper language code", () => {
    it("It should respond with 400 and object", async () => {
      //given
      interface responseObject {
        error: string;
        descrpiton: string;
      }
      const body = { text: ["text", "miś"], target: "unavailableLanguage" };
      //when
      try {
        const response = await axios.post(url + "/translate/", body);
        //then
        expect(response.status).toBe(400);
        expect(typeof response).toEqual("responseObject");
      } catch (err) {}
    });
  });

  describe("When trying to call post on /translate and everything goes well", () => {
    it("It should respond with 200 and object with translations", async () => {
      //given
      const body = { text: ["tekst po polsku", "kawa"], target: "en" };
      //when
      try {
        const response = await axios.post(url + "/translate/", body);
        //then
        expect(response.status).toBe(200);
        expect(response).toBe([
          {
            translatedText: "text in Polish",
            detectedSourceLanguage: "pl",
          },
          {
            translatedText: "cofee",
            detectedSourceLanguage: "pl",
          },
        ]);
      } catch (err: any) {}
    });
  });
});
