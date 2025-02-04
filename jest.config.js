module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',  // JSX 및 JS 파일을 babel-jest로 변환
  },
  testEnvironment: 'jsdom',         // DOM 환경에서 실행
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',  // CSS 파일 처리
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
