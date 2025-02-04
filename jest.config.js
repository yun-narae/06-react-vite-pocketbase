module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',  // JSX 및 JS 파일을 babel-jest로 변환
  },
  testEnvironment: 'jsdom',         // DOM 환경에서 실행
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',  // CSS 파일 처리
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,  // 커버리지 수집을 활성화
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx,ts,tsx}',  // 커버리지를 수집할 파일 확장자
    '!src/**/*.test.{js,jsx,ts,tsx}',  // 테스트 파일 제외
  ],
  coverageDirectory: 'coverage',  // 커버리지 결과를 저장할 디렉토리
  coverageReporters: ['text', 'lcov', 'json', 'html'],  // 다양한 포맷으로 커버리지 결과 출력
};
