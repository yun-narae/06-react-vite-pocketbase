import React from 'react';
import PropTypes from 'prop-types';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export const Button = ({
  type = 'default',
  size = 'medium',
  label,
  className,
  disabled = false, // disabled 기본값 설정
  onClick,
  isLoading = false,
  isDarkMode = false,
  backgroundColor = null,
  borderColor = null,
  showIcon = false,
  icon = '',
  ...props
}) => {
  let buttonStyles = '';
  let hoverStyles = ''; // hover 스타일을 따로 설정

  // 각 버튼 타입별 기본 스타일과 hover 스타일을 분리
  switch (type) {
    case 'social':
      buttonStyles = isDarkMode
        ? 'bg-yellow-700 text-white'
        : 'bg-yellow-300 text-black';
      hoverStyles = isDarkMode
        ? 'hover:bg-yellow-600'
        : 'hover:bg-yellow-200';
      break;

    case 'login':
      buttonStyles = isDarkMode
        ? 'bg-blue-700 text-white'
        : 'bg-blue-500 text-black';
      hoverStyles = isDarkMode
        ? 'hover:bg-blue-500'
        : 'hover:bg-blue-400';
      break;

    case 'darkMode':
      buttonStyles = isDarkMode
        ? 'bg-gray-700 text-white'
        : 'bg-gray-300 text-black';
      hoverStyles = isDarkMode
        ? 'hover:bg-gray-600 hover:font-light'
        : 'hover:bg-gray-400 hover:font-light';
      label = isDarkMode ? 'Light' : 'Dark';
      break;

    default:
      buttonStyles = 'bg-gray-600 text-white';
      hoverStyles = 'hover:bg-gray-700';
  }

  // isLoading 또는 disabled일 경우 비활성화 처리
  if (isLoading || disabled) {
    buttonStyles += 'pointer-events-none cursor-not-allowed opacity-50';
    hoverStyles = ''; // hover 스타일 비활성화
  }

  // 크기 클래스 설정
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-5 py-3 text-base',
    large: 'px-6 py-4 text-lg',
  };

  // 아이콘 설정
  const renderIcon = () => {
    if (showIcon) {
      switch (icon) {
        case 'google':
          return <FaGoogle className="mr-2" />;
        case 'facebook':
          return <FaFacebook className="mr-2" />;
        default:
          return null;
      }
    }
    return null;
  };

  return (
    <button
      type="button"
      className={`flex items-center rounded-full ${buttonStyles} ${hoverStyles} ${sizeClasses[size]} ${className}`}
      onClick={!isLoading && !disabled ? onClick : undefined} // 로딩 중이나 disabled일 때 클릭 불가
      {...props}
      disabled={isLoading || disabled} // 로딩 중일 때도 비활성화 상태로 처리
    >
      {renderIcon()}
      {isLoading ? 'Loading...' : label}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['default', 'social', 'login', 'darkMode']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  isDarkMode: PropTypes.bool,
  backgroundColor: PropTypes.string,
  borderColor: PropTypes.string,
  showIcon: PropTypes.bool,
  icon: PropTypes.oneOf(['google', 'facebook']),
  disabled: PropTypes.bool, // disabled props 정의
};
