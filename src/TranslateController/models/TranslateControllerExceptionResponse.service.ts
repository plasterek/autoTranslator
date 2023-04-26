export class TranslateControllerExceptionResponse {
  constructor(error: string, message: string) {
    return { error: error, messsage: message };
  }
}
