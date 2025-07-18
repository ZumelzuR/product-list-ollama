import { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleDirectories: ['node_modules'],
  rootDir: '.',
  modulePaths: ['.'],
  modulePathIgnorePatterns: ['<rootDir>/dist/*'],
};

export default config;
