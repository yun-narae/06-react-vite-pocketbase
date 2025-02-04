import React from 'react';
import PropTypes from 'prop-types';
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // 예시 아이콘 (react-icons 패키지)

export const Button = ({
  type = 'default', // 버튼 타입 (Social Login, 로그인/로그아웃, 다크모드 토글)
  size = 'medium', // 버튼 크기 (sm, md, lg)
  label,
  onClick,
  isLoading = false, // 로딩 상태
  isDarkMode = false, // 다크 모드 상태
  backgroundColor = null, // 배경색
  borderColor = null, // 테두리 색상
  showIcon = false, // 아이콘 표시 여부 (SocialButton에서만 사용)
  icon = '', // 사용할 아이콘 종류 (google, facebook 등)
  ...props
}) => {
  // `type` 값에 따라 버튼 스타일 결정
  let buttonStyles = '';
  switch (type) {
    case 'social': // 소셜 로그인 버튼
      buttonStyles = 'bg-blue-600 text-white hover:bg-blue-700';
      break;
    case 'login': // 로그인/로그아웃 버튼
      buttonStyles = 'bg-green-600 text-white hover:bg-green-700';
      break;
    case 'darkMode': // 다크모드 토글 버튼
      buttonStyles = isDarkMode
        ? 'bg-gray-700 text-white hover:bg-gray-600'
        : 'bg-gray-300 text-black hover:bg-gray-400';
      label = isDarkMode ? 'Light' : 'Dark';
      break;
    default:
      buttonStyles = 'bg-gray-600 text-white hover:bg-gray-700'; // 기본 버튼
  }

  // 크기에 맞는 Tailwind 클래스 설정
  const sizeClasses = {
    small: 'px-4 py-2 text-sm', // 작은 버튼
    medium: 'px-5 py-3 text-base', // 중간 버튼
    large: 'px-6 py-4 text-lg', // 큰 버튼
  };

  // 배경색이 있을 경우 인라인 스타일로 적용
  const backgroundStyle = backgroundColor ? { backgroundColor } : {};

  // 선색이 있을 경우 인라인 스타일로 적용
  const borderStyle = borderColor ? { border: `1px solid ${borderColor}` } : {};

  // 버튼 텍스트와 스타일
  const buttonDisabled = isLoading; // 로딩 중 버튼 비활성화

  // 아이콘 설정
  const renderIcon = () => {
    if (showIcon) {
      switch (icon) {
        case 'google':
          return <FaGoogle className="mr-2" />; // 구글 아이콘
        case 'facebook':
          return <FaFacebook className="mr-2" />; // 페이스북 아이콘
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <button
      type="button"
      className={`flex items-center cursor-pointer rounded-full font-semibold ${buttonStyles} ${sizeClasses[size]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      style={{ ...backgroundStyle, ...borderStyle }} // 객체 결합
      onClick={!buttonDisabled ? onClick : undefined} // 로딩 중에는 클릭 불가
      disabled={buttonDisabled} // disabled 속성 적용
      {...props}
    >
      {renderIcon()}
      {isLoading ? 'Loading...' : label } {/* 로딩 중 텍스트 변경 */}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['default', 'social', 'login', 'darkMode']), // 버튼 타입
  size: PropTypes.oneOf(['small', 'medium', 'large']), // 버튼 크기
  label: PropTypes.string.isRequired, // 버튼 텍스트
  onClick: PropTypes.func, // 클릭 핸들러
  isLoading: PropTypes.bool, // 로딩 상태
  isDarkMode: PropTypes.bool, // 다크 모드 상태
  backgroundColor: PropTypes.string, // 배경색
  borderColor: PropTypes.string, // 테두리 색상
  showIcon: PropTypes.bool, // 아이콘 표시 여부 (SocialButton에서만 사용)
  icon: PropTypes.oneOf(['google', 'facebook']), // 사용할 아이콘 종류
};
