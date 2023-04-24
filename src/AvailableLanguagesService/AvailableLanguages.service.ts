import axios from "axios";
import { AvailableLanguagesException } from "./exceptions/AvailableLanguages.exception";

export class AvailableLanguagesService {
  constructor(private readonly languageListApiURL: string, private readonly apiKey: string) {}
  private readonly languages: string[] = [];

  public async getListFromAPI() {
    const url: URL = new URL(this.languageListApiURL);
    url.searchParams.append("key", this.apiKey);
    try {
      const response: axios.AxiosResponse = await axios.get(url.toString());
      if (response.status === 200) {
        return response.data.data.languages.forEach((object: { language: string }) =>
          this.languages.push(object.language)
        );
      } else {
        throw new AvailableLanguagesException(`Status: ${response.status}, Message: ${response.data.error.message}`);
      }
    } catch (err: any) {
      throw new AvailableLanguagesException(err.message);
    }
  }
  public getAvailableLanguages() {
    return this.languages;
  }
  public checkIfLanguageIsAvailable(language: string) {
    return this.languages.includes(language);
  }
}
