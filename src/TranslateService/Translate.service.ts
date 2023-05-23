import axios from "axios";
import { TranslateServiceException } from "./exceptions/TranslateService.exception";
import { verifyGivenString } from "../utils/verifyGivenString.utils";

export class TranslateService {
  constructor(
    private readonly translateApiUrl: string = verifyGivenString(process.env.API_URL, "You need to provide translate API url!"),
    private readonly apiKey: string = verifyGivenString(process.env.API_KEY, "You need to provide API key!")
  ) {}

  public async translateText(originalText: string, targetLanguage: string): Promise<any> {
    try {
      const url = new URL(this.translateApiUrl);
      url.searchParams.append("key", this.apiKey);
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
      throw new Error(`Status: ${response.status}, Message: ${response.data.error.message}`);
    } catch (err: any) {
      throw new TranslateServiceException(err);
    }
  }
}
