module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.[jt]sx?$': 'babel-jest',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.cjs'],
    moduleNameMapper: {
        '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^.+\\.(png|jpg|jpeg|gif|svg|webp|avif)$': '<rootDir>/src/__mocks__/fileMock.cjs',
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}