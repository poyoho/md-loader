module.exports = {
  preset: "ts-jest",
  rootDir: __dirname,
  testMatch: ["<rootDir>/src/**/__tests__/**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/"]
}
  