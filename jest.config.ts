export default {
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
