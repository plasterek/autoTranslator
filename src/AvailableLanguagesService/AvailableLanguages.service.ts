import axios from "axios";
import { AvailableLanguagesServiceException } from "./exceptions/AvailableLanguages.exception";

export class AvailableLanguagesService {
  private readonly languageListApiURL: string | undefined = process.env.LANG_API_URL;
  private readonly apiKey: string | undefined = process.env.API_KEY;
  private readonly languages: string[] = [];

  public async getListFromAPI(): Promise<axios.AxiosResponse> {
    if (!this.languageListApiURL || this.languageListApiURL.length === 0) {
      throw new AvailableLanguagesServiceException("LanguageListApiURL not provided!");
    }
    if (!this.apiKey || this.apiKey.length === 0) {
      throw new AvailableLanguagesServiceException("ApiKey not provided");
    }

    try {
      const url: URL = new URL(this.languageListApiURL);
      url.searchParams.append("key", this.apiKey);
      const response: axios.AxiosResponse = await axios.get(url.toString());
      if (response.status === 200) {
        return response.data.data.languages.forEach((object: { language: string }) =>
          this.languages.push(object.language)
        );
      }
      throw new AvailableLanguagesServiceException(
        `Status: ${response.status}, Message: ${response.data.error.message}`
      );
    } catch (err: any) {
      throw new AvailableLanguagesServiceException(err.message);
    }
  }
  public getAvailableLanguages(): string[] {
    return this.languages;
  }
  public checkIfLanguageIsAvailable(language: string): boolean {
    return this.languages.includes(language);
  }
}
