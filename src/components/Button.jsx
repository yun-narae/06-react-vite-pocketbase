import React from 'react';
import PropTypes from 'prop-types';
import { FaGoogle, FaFacebook } from 'react-icons/fa';

export const Button = ({
  type = 'default',
  size = 'medium',
  label,
  title,
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
        ? 'hover:bg-yellow-600 hover:font-bold'
        : 'hover:bg-yellow-200 hover:font-bold';
      break;

    case 'login':
      buttonStyles = isDarkMode
        ? 'bg-blue-700 text-white'
        : 'bg-blue-500 text-black';
      hoverStyles = isDarkMode
        ? 'hover:bg-blue-500 hover:font-bold'
        : 'hover:bg-blue-400 hover:font-bold';
      break;

    case 'darkMode':
      buttonStyles = isDarkMode
        ? 'bg-gray-700 text-white'
        : 'bg-gray-300 text-black';
      hoverStyles = isDarkMode
        ? 'hover:bg-gray-600 hover:font-bold'
        : 'hover:bg-gray-400 hover:font-bold';
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
      const iconClasses = "absolute top-1/2 w-auto transform -translate-x-6 -translate-y-1/2"; // 공통 스타일
  
      switch (icon) {
        case 'google':
          return <FaGoogle className={`${iconClasses}`} />;
        case 'facebook':
          return <FaFacebook className={`${iconClasses}`} />;
        default:
          return null;
      }
    }
    return null;
  };

  // showIcon이 true일 때 각 크기별로 padding을 추가한 class 설정
  const iconPaddingClass = {
    small: 'relative pl-10',  // 작은 버튼은 아이콘 왼쪽에 8px padding
    medium: 'relative pl-11', // 중간 버튼은 아이콘 왼쪽에 10px padding
    large: 'relative pl-12',  // 큰 버튼은 아이콘 왼쪽에 12px padding
  };

  return (
    <button
      type="button"
      className={`items-center rounded-full ${buttonStyles} ${hoverStyles} ${sizeClasses[size]} ${showIcon ? iconPaddingClass[size] : ''} ${className}`}
      onClick={!isLoading && !disabled ? onClick : undefined} // 로딩 중이나 disabled일 때 클릭 불가
      {...props}
      disabled={isLoading || disabled} // 로딩 중일 때도 비활성화 상태로 처리
      title={label}
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
  title: PropTypes.string,
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
