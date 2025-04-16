import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import { MOBILE_MEDIA_QUERY } from '@/src/styles/const';

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const blink = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  margin: 130px 0;
  font-family: GmarketSansLight;

  .fade-in {
    animation: ${fadeIn} 1.5s ease-out forwards;
  }

  @media ${MOBILE_MEDIA_QUERY} {
    padding: 0 10px;
    margin-top: 80px;
    margin-bottom: 150px;
  }
`;

export const IntroWrapper = styled.div`
  white-space: normal;
  display: flex;
  justify-content: space-between;
  position: relative;
  font-size: 40px;
  line-height: 1.4;

  @media ${MOBILE_MEDIA_QUERY} {
    flex-direction: column;
  }

  strong {
    display: inline-block;
    font-family: GmarketSansMedium;
  }
`;

export const Title = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 180px;

  @media ${MOBILE_MEDIA_QUERY} {
    font-size: 27px;
    min-height: 120px;
  }
`;

export const TypingLine = styled.p`
  margin: 0;
  line-height: 1.5;
  position: relative;

  &::after {
    content: '|';
    animation: ${blink} 1s infinite;
  }
`;

export const LastLine = styled.p`
  margin: 0;
  line-height: 1.5;
`;

export const BoldText = styled.span`
  font-family: GmarketSansMedium;
  font-weight: 500;
  display: inline-block;
`;

export const SocialWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;

  @media ${MOBILE_MEDIA_QUERY} {
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 15px;
    margin-top: 10px;
  }
`;

export const SocialButton = styled.a`
  color: ${({ theme }) => theme.color.black100};
  font-size: 18px;
  padding: 8px 16px;
  border-radius: 6px;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.color.black100};
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    background-color: ${({ theme }) => theme.color.black100};
    color: ${({ theme }) => theme.color.white100};
  }
`;

export const DropdownButton = styled.div`
  color: ${({ theme }) => theme.color.black100};
  font-size: 18px;
  position: absolute;
  height: 100px;
  bottom: -100px;
  & > div:first-of-type {
    cursor: pointer;
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.color.black100};
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: ${({ theme }) => theme.color.black100};
      color: ${({ theme }) => theme.color.white100};
    }
  }
  @media ${MOBILE_MEDIA_QUERY} {
    left: 0px;
    align-items: flex-start;
    bottom: -110px;
  }
`;

export const Dropdown = styled.div`
  margin-top: 5px;
  position: absolute;
  gap: 10px;
  display: flex;
  flex-direction: column;
  top: 45px;
  right: 0;
  align-items: flex-end;
  z-index: 30;
  @media ${MOBILE_MEDIA_QUERY} {
    left: 0px;
    align-items: flex-start;
  }
`;
