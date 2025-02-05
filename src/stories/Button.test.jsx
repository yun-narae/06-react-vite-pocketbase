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

  test('소셜 로그인 버튼에서 구글 아이콘 렌더링 확인', () => {
    render(<Button type="social" label="Login with Google" icon="google" showIcon={true} />);
    const button = screen.getByRole('button');
    
    // 구글 아이콘이 렌더링되어야 함
    const icon = button.querySelector('.mr-2'); // mr-2 클래스를 사용한 아이콘
    expect(icon).toBeInTheDocument();
  });
  
  test('소셜 로그인 버튼에서 페이스북 아이콘 렌더링 확인', () => {
    render(<Button type="social" label="Login with Facebook" icon="facebook" showIcon={true} />);
    const button = screen.getByRole('button');
    
    // 페이스북 아이콘이 렌더링되어야 함
    const icon = button.querySelector('.mr-2'); // mr-2 클래스를 사용한 아이콘
    expect(icon).toBeInTheDocument();
  });
  
  test('아이콘이 없을 때 렌더링되지 않음', () => {
    render(<Button type="social" label="Login with Google" icon="google" showIcon={false} />);
    const button = screen.getByRole('button');
    
    // 아이콘이 렌더링되지 않음
    const icon = button.querySelector('.mr-2');
    expect(icon).not.toBeInTheDocument();
  });
  

  test('로그인/로그아웃 버튼 (login) 렌더링 확인', () => {
    render(<Button type="login" label="Login" />);
    const button = screen.getByRole('button');
    
    // 버튼 텍스트 확인
    expect(button).toHaveTextContent('Login');
    
    // 로그인 버튼 스타일 확인
    expect(button).toHaveClass('bg-blue-500');
    expect(button).toHaveClass('text-black');
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
    
    // 다크모드 상태에 따라 텍스트가 변경되는지 확인
    expect(darkButton).toHaveTextContent('Dark');
    expect(lightButton).toHaveTextContent('Light');
  });

  test('로딩 상태일 때 버튼 텍스트 "Loading..." 확인', () => {
    render(<Button type="default" label="Submit" isLoading={true} />);
    const button = screen.getByRole('button');
    
    // 로딩 중일 때 텍스트가 "Loading..."이어야 함
    expect(button).toHaveTextContent('Loading...');
    
    // 버튼이 비활성화 상태일 때 클릭이 불가능한지 확인
    expect(button).toBeDisabled(); // 이제 정상적으로 disabled 상태 확인 가능
  });
  
  test('로딩 상태가 아닐 때 버튼 텍스트 확인', () => {
    render(<Button type="default" label="Submit" isLoading={false} />);
    const button = screen.getByRole('button');
    
    // 로딩 중이 아니면 원래 텍스트를 표시해야 함
    expect(button).toHaveTextContent('Submit');
    
    // 버튼이 활성화 상태여야 함
    expect(button).not.toBeDisabled();
  });
  
  test('disabled 상태일 때 버튼 비활성화 확인', () => {
    render(<Button type="default" label="Submit" isLoading={true} />);
    const button = screen.getByRole('button');
    
    // 버튼이 비활성화되어야 함
    expect(button).toBeDisabled(); // isLoading이 true일 때 버튼이 비활성화되어야 함
    
    // 버튼 텍스트 확인 (로딩 중에는 'Loading...' 텍스트가 있어야 함)
    expect(button).toHaveTextContent('Loading...');
  });
  
  test('로딩 상태가 아닐 때 버튼 텍스트 확인', () => {
    render(<Button type="default" label="Submit" isLoading={false} />);
    const button = screen.getByRole('button');
    
    // 버튼이 활성화되어야 함
    expect(button).not.toBeDisabled(); // isLoading이 false일 때 버튼은 활성화되어야 함
    
    // 버튼 텍스트 확인 (로딩 상태가 아니면 원래 텍스트가 있어야 함)
    expect(button).toHaveTextContent('Submit');
  });
});