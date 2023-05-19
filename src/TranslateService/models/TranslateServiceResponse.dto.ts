export class TranslateServiceResponseDTO {
  constructor(readonly translatedText: string, readonly detectedSourceLanguage: string) {}
}
