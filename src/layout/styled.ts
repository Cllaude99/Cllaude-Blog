import styled from '@emotion/styled';

import { contentMaxWidth, MOBILE_MEDIA_QUERY } from '../styles/const';

export const Wrapper = styled.div`
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  padding-bottom: 0;
  background-color: ${({ theme }) => theme.color.white100};

  @media ${MOBILE_MEDIA_QUERY} {
    padding-bottom: 0;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100%;
  word-break: keep-all;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 60px 15px;
  background-color: ${({ theme }) => theme.color.white100};

  @media ${MOBILE_MEDIA_QUERY} {
    margin-bottom: 0;
    padding-bottom: 30px;
  }
`;

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  max-width: ${contentMaxWidth};
  background-color: ${({ theme }) => theme.color.white100};
`;
