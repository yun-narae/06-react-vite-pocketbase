import React from 'react';
import PropTypes from 'prop-types';

/** 사용자 상호작용을 위한 기본 UI 컴포넌트 */
export const Button = ({
  primary = false,
  backgroundColor = null,
  size = 'medium',
  label,
  ...props
}) => {
  // `primary` 값에 따라 버튼의 스타일을 결정
  const mode = primary
    ? 'bg-indigo-600 text-white hover:bg-indigo-700' // primary 스타일
    : 'bg-transparent text-gray-800 border border-gray-300 hover:bg-gray-100'; // secondary 스타일

  // 크기에 맞는 Tailwind 클래스 설정
  const sizeClasses = {
    small: 'px-4 py-2 text-sm', // 작은 버튼
    medium: 'px-5 py-3 text-base', // 중간 버튼
    large: 'px-6 py-4 text-lg', // 큰 버튼
  };

  // 배경색이 있을 경우 인라인 스타일로 적용
  const backgroundStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <button
      type="button"
      className={`inline-block cursor-pointer border-0 rounded-full font-semibold ${mode} ${sizeClasses[size]} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      style={backgroundStyle}
      {...props}
    >
      {label}
    </button>
  );
};

Button.propTypes = {
  primary: PropTypes.bool,
  backgroundColor: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
