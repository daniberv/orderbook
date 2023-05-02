import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
	verbose: true,
	testEnvironment: 'jsdom',
	testMatch: ['**/__tests__/**/*.(ts|tsx)'],
	testPathIgnorePatterns: ['/node_modules/'],
	collectCoverageFrom: ['<rootDir>/**/*.{ts,tsx}'],
	rootDir: './src',
	moduleNameMapper: {
		'@/(.*)': '<rootDir>/components/OrderBook/$1',
	},
	globals: {
		'ts-jest': {
			tsconfig: false,
			useESM: true,
			babelConfig: true,
			plugins: ['babel-plugin-transform-vite-meta-env'],
		},
	},
	transform: {
		'^.+\\.(js|jsx|ts)$': 'babel-jest',
	},
}
export default config
