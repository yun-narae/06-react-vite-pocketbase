import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button';  // Button 컴포넌트 임포트

describe('Button Component', () => {
  test('기본 타입 버튼 (default) 렌더링 확인', () => {
    render(<Button type="default" label="Default Button" />);
    const button = screen.getByRole('button');
    
    // 버튼 텍스트 확인
    expect(button).toHaveTextContent('Default Button');
    
    // 기본 버튼 스타일 확인
    expect(button).toHaveClass('bg-gray-600');
    expect(button).toHaveClass('text-white');
  });

  test('소셜 로그인 버튼 (social) 렌더링 확인', () => {
    render(<Button type="social" label="Login with Google" icon="google" showIcon={true} />);
    const button = screen.getByRole('button');
    
    // 버튼 텍스트 확인
    expect(button).toHaveTextContent('Login with Google');
    
    // 아이콘이 있는지 확인
    const icon = button.querySelector('.mr-2'); // 아이콘 클래스 확인
    expect(icon).toBeInTheDocument();
    
    // 소셜 버튼 스타일 확인
    expect(button).toHaveClass('bg-blue-600');
    expect(button).toHaveClass('text-white');
  });

  test('로그인/로그아웃 버튼 (login) 렌더링 확인', () => {
    render(<Button type="login" label="Login" />);
    const button = screen.getByRole('button');
    
    // 버튼 텍스트 확인
    expect(button).toHaveTextContent('Login');
    
    // 로그인 버튼 스타일 확인
    expect(button).toHaveClass('bg-green-600');
    expect(button).toHaveClass('text-white');
  });

  test('다크모드 토글 버튼 (darkMode) 렌더링 확인', () => {
    // 다크모드 비활성화 상태일 때
    render(<Button type="darkMode" label="Dark" isDarkMode={false} />);
    const darkButton = screen.getByRole('button', { name: /dark/i }); // "Dark" 버튼 찾기
    
    // 다크모드 비활성화 스타일 확인
    expect(darkButton).toHaveClass('bg-gray-300');
    expect(darkButton).toHaveClass('text-black');
    
    // 다크모드 활성화 상태일 때
    render(<Button type="darkMode" label="Light" isDarkMode={true} />);
    const lightButton = screen.getByRole('button', { name: /light/i }); // "Light" 버튼 찾기
    
    // 다크모드 활성화 스타일 확인
    expect(lightButton).toHaveClass('bg-gray-700');
    expect(lightButton).toHaveClass('text-white');
  });
});