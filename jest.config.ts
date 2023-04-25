import { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testMatch: ["<rootDir>src/**/*.spec.ts"],
  testEnvironment: "node",
  collectCoverage: true,
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
};

export default config;
