import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest",
  setupFiles: ["dotenv/config"],
};

export default jestConfig;
