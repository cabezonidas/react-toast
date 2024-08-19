module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
  globals: {},
  transform: {
    "^.+\\.ts?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
};
