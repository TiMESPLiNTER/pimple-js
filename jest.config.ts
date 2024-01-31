import type {Config} from 'jest';

const config: Config = {
    coverageDirectory: "./build/coverage",
    coverageReporters: ['clover', 'json', 'lcov', ['text', {skipFull: true}]],
    coverageThreshold: {
        global: {
            "branches": 80,
            "functions": 88,
            "lines": 93,
            "statements": 93
        }
    }
};

export default config;
