import axios from "axios";
import { TranslateException } from "./exceptions/Translate.exception";

export class TranslateService {
  constructor(private readonly translateApiUrl: string, private readonly apiKey: string) {}
  public async translateText(originalText: string, targetLanguage: string) {
    const url: URL = new URL(this.translateApiUrl);
    url.searchParams.append("key", this.apiKey);
    try {
      const response: axios.AxiosResponse = await axios.post(
        url.toString(),
        { q: originalText, target: targetLanguage },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        return response.data.data.translations;
      } else {
        throw new TranslateException(`Status: ${response.status}, Message: ${response.data.error.message}`);
      }
    } catch (err: any) {
      throw new TranslateException(err.message);
    }
  }
}
