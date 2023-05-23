import axios from "axios";
import { AvailableLanguagesServiceException } from "./exceptions/AvailableLanguages.exception";
import { verifyGivenString } from "../utils/verifyGivenString.utils";

export class AvailableLanguagesService {
  constructor(
    private readonly languageListApiURL: string = verifyGivenString(process.env.LANG_API_URL, "You need to provide API url!"),
    private readonly apiKey: string = verifyGivenString(process.env.API_KEY, "You need to provide API key!")
  ) {}

  private readonly languages: string[] = [];

  public async getListFromAPI(): Promise<string[]> {
    try {
      const url: URL = new URL(this.languageListApiURL);
      url.searchParams.append("key", this.apiKey);
      const response: axios.AxiosResponse = await axios.get(url.toString());
      if (response.status === 200) {
        response.data.data.languages.forEach((object: { language: string }) => this.languages.push(object.language));
        return this.languages;
      }
      throw new AvailableLanguagesServiceException(`Status: ${response.status}, Message: ${response.data.error.message}`);
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
