module.exports = {
  preset: "ts-jest",
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*spec.ts'],
  testPathIgnorePatterns: ["/node_modules/"],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleNameMapper: {
    '^@poyoho/md-loader-compile': '<rootDir>/packages/compile/src',
  },
}
