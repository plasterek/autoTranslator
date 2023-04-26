import axios from "axios";
import { TranslateException } from "./exceptions/Translate.exception";

export class TranslateService {
  private readonly translateApiUrl: string | undefined = process.env.API_URL;
  private readonly apiKey: string | undefined = process.env.API_KEY;

  public async translateText(originalText: string, targetLanguage: string) {
    if (!this.translateApiUrl || this.translateApiUrl.length === 0) {
      throw new TranslateException("TranslateApiUrl not provided!");
    }
    if (!this.apiKey || this.apiKey.length === 0) {
      throw new TranslateException("ApiKey not provided");
    }

    let url: URL;
    try {
      url = new URL(this.translateApiUrl);
    } catch (err: any) {
      throw new TranslateException("TranslateApiUrl is not valid!");
    }
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
