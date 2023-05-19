import { TranslateServiceResponseDTO } from "../../TranslateService/models/TranslateServiceResponse.dto";

export class CacheServiceResponseDTO {
  constructor(readonly text: string, readonly target: string, readonly response: TranslateServiceResponseDTO) {}
}
