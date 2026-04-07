export default {
  testEnvironment: 'jsdom',

  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },

  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};