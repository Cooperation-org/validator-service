module.exports = {
  // Specify the test environment
  testEnvironment: 'node',

  // Use ts-jest preset to handle TypeScript files
  preset: 'ts-jest',

  // Define the test file patterns
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],

  // Transform TypeScript files using ts-jest
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Path to a module that runs some code to configure or set up the testing framework before each test
  setupFilesAfterEnv: ['./jest.setup.ts'],

  // Collect coverage information
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],

  // Specify the directories to ignore during testing
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Automatically reset mock state before every test
  resetMocks: true,

  // Automatically clear mock calls and instances before every test
  clearMocks: true
}
