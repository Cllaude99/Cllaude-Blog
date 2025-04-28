import styled from '@emotion/styled';

import { MOBILE_MEDIA_QUERY } from '@/src/styles/const';

export const Wrapper = styled.div<{ isDark: boolean }>`
  cursor: pointer;
  position: fixed;
  z-index: 1000;
  top: 20px;
  right: 20px;
  background-color: ${({ isDark, theme }) =>
    isDark ? theme.color.black40 : theme.color.black60};
  border-radius: 30px;
  width: 60px;
  height: 30px;
  display: flex;
  align-items: center;
  padding: 0 5px;
  transition: background-color 0.4s ease;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    left: ${({ isDark }) => (isDark ? '30px' : '5px')};
    width: 24px;
    height: 24px;
    background-color: ${({ isDark, theme }) =>
      isDark ? theme.color.white100 : '#FFFFFF'};
    border-radius: 50%;
    transition: left 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    box-shadow: ${({ isDark }) =>
      isDark ? 'none' : '0 0 3px rgba(0,0,0,0.2)'};
    z-index: 2;
  }

  .theme-icon {
    color: ${({ isDark, theme }) =>
      isDark ? theme.color.white100 : theme.color.white100};
    width: 16px;
    height: 16px;
    position: absolute;
    z-index: 1;
    transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55),
      opacity 0.2s ease-in-out;
  }

  .moon-icon {
    transform: ${({ isDark }) =>
      isDark
        ? 'translateX(4px) rotate(0)'
        : 'translateX(-24px) rotate(-90deg)'};
    opacity: ${({ isDark }) => (isDark ? '1' : '0')};
  }

  .sun-icon {
    color: ${({ isDark, theme }) =>
      isDark ? theme.color.white100 : theme.color.white100};
    transform: ${({ isDark }) =>
      isDark ? 'translateX(28px) rotate(90deg)' : 'translateX(33px) rotate(0)'};
    opacity: ${({ isDark }) => (!isDark ? '1' : '0')};
  }

  @media ${MOBILE_MEDIA_QUERY} {
    top: 40px;
    right: 15px;
    width: 50px;
    height: 25px;

    &:before {
      width: 20px;
      height: 20px;
      left: ${({ isDark }) => (isDark ? '25px' : '5px')};
    }

    .theme-icon {
      width: 14px;
      height: 14px;
    }

    .sun-icon {
      transform: ${({ isDark }) =>
        isDark
          ? 'translateX(23px) rotate(90deg)'
          : 'translateX(28px) rotate(0)'};
    }
  }
`;
