module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/__tests__/**/*.test.ts"],
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/$1",
	},
	setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
	transform: {
		"^.+\\.tsx?$": [
			"ts-jest",
			{
				tsconfig: "tsconfig.jest.json",
				useESM: true,
			},
		],
	},
	extensionsToTreatAsEsm: [".ts"],
};
