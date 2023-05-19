import axios from "axios";
import { TranslateServiceException } from "./exceptions/TranslateService.exception";

export class TranslateService {
  private readonly translateApiUrl: string | undefined = process.env.API_URL;
  private readonly apiKey: string | undefined = process.env.API_KEY;

  public async translateText(originalText: string, targetLanguage: string) {
    if (!this.translateApiUrl || this.translateApiUrl.length === 0) {
      throw new TranslateServiceException("TranslateApiUrl not provided!");
    }
    if (!this.apiKey || this.apiKey.length === 0) {
      throw new TranslateServiceException("ApiKey not provided");
    }

    let url: URL;
    try {
      url = new URL(this.translateApiUrl);
    } catch (err: any) {
      throw new TranslateServiceException("TranslateApiUrl is not valid!");
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
      }
      throw new TranslateServiceException(`Status: ${response.status}, Message: ${response.data.error.message}`);
    } catch (err: any) {
      throw new TranslateServiceException(err.message);
    }
  }
}
