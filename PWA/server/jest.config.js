module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }],
  },
  transformIgnorePatterns: [],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/'],
};
