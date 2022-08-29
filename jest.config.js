export default {
  preset: "ts-jest",
  transformIgnorePatterns: [],
  collectCoverageFrom: ["src/**/*"],
  coverageDirectory: "artifacts/coverage/jest",
  testMatch: ["**/test/jest/**/*.spec.*"],
};
