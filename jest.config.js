export default {
  testEnvironment: "jsdom",
  rootDir: "src",
  coverageDirectory: "../coverage",
  collectCoverageFrom: ["**/*.ts"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        diagnostics: false,
        tsConfig: "./tsconfig.test.json",
      },
    ],
  },
  testRegex: "/__tests__/.*.ts$",
  moduleFileExtensions: ["ts", "js"],
};
