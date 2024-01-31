import type {Config} from 'jest';

const config: Config = {
    coverageDirectory: "./build/coverage",
    coverageReporters: ['text', 'html', 'lcov'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 88,
            lines: 93,
            statements: 93
        }
    },
    collectCoverageFrom: [
        "src/**/*"
    ],
};

export default config;
