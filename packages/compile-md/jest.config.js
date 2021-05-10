module.exports = {
  preset: "ts-jest",
  rootDir: __dirname,
  moduleNameMapper: {
    "^lib/(.*)$": "<rootDir>/lib/$1"
  },
  testMatch: ["<rootDir>/__tests__/**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  testEnvironment: "node"
}
