import { fn } from '@storybook/test';
import { Button } from '../components/Button';

export default {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    backgroundColor: { control: 'color' },
    borderColor: { control: 'color' },
    onClick: { action: 'clicked' },
    label: { control: 'text' }, // 버튼 텍스트 입력을 위해 control 추가
    size: { control: 'radio', options: ['small', 'medium', 'large'] }, // 사이즈 선택
    // 'showIcon'과 'icon'을 SocialButton에서만 사용하도록 설정
    showIcon: { table: { disable: true } }, // 기본적으로 showIcon 숨기기
    icon: { table: { disable: true } }, // 기본적으로 icon 숨기기
  },
  args: {
    label: 'Button',
    isLoading: false,
    size: 'medium',
    onClick: fn(),
    // 기본적으로 showIcon과 icon을 숨기도록 설정
    showIcon: false,
    icon: '',
  },
};

export const Primary = {
  args: {
    label: 'Primary Button',
    // `type`을 명시적으로 지정하여 변경하지 않도록 설정
    type: 'login',
  },
  argTypes: {
    // `isDarkMode`를 제외하여 Primary 버튼에서는 이를 제어할 수 없도록 함
    isDarkMode: { table: { disable: true } },
    // `showIcon`과 `icon`은 Primary에서 사용하지 않도록 설정
    showIcon: { table: { disable: true } },
    icon: { table: { disable: true } },
  },
};

export const SocialButton = {
  args: {
    label: 'Login with Google',
    showIcon: true, // 아이콘 표시
    icon: 'google', // 구글 아이콘
    type: 'social',
  },
  argTypes: {
    // SocialButton에서만 showIcon과 icon을 사용할 수 있도록 설정
    showIcon: { control: 'boolean' },
    icon: { control: 'radio', options: ['google', 'facebook'] },
    // `isDarkMode`를 제외하여 SocialButton에서는 이를 제어할 수 없도록 함
    isDarkMode: { table: { disable: true } },
    // `type`은 강제로 'social'로 설정
    type: { table: { disable: true } },
  },
};

export const DarkModeButton = {
  args: {
    type: 'darkMode',
    isDarkMode: true, // 다크모드 기본 상태
  },
  argTypes: {
    // DarkModeButton에서만 `isDarkMode`를 제어할 수 있도록 노출
    isDarkMode: { control: 'boolean' },
    // `showIcon`과 `icon`은 DarkModeButton에서 사용하지 않도록 설정
    showIcon: { table: { disable: true } },
    icon: { table: { disable: true } },
    // `type`은 'darkMode'로 강제 설정
    type: { table: { disable: true } },
  },
};

export const LoadingButton = {
  args: {
    label: 'Loading Button',
    isLoading: true,
    type: 'login',
  },
  argTypes: {
    // `isDarkMode`를 제외하여 LoadingButton에서는 이를 제어할 수 없도록 함
    isDarkMode: { table: { disable: true } },
    // `showIcon`과 `icon`은 LoadingButton에서 사용하지 않도록 설정
    showIcon: { table: { disable: true } },
    icon: { table: { disable: true } },
    // `type`은 'login'으로 고정
    type: { table: { disable: true } },
  },
};
