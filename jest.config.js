export const preset = 'ts-jest';
export const testEnvironment = 'node';
export const transform = {
  '^.+\\.(t|j)s$': 'ts-jest',
};
export const transformIgnorePatterns = ['/node_modules/'];
export const moduleFileExtensions = ['ts', 'js'];