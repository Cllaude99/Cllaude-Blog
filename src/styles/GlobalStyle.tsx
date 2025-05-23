import { css, Global, Theme } from '@emotion/react';
import React from 'react';

import { MOBILE_MEDIA_QUERY } from './const';

const style = (theme: Theme) => css`
  * {
    box-sizing: border-box;
    appearance: none;
    margin: 0;
    padding: 0;
  }

  html,
  body,
  #___gatsby,
  #gatsby-focus-wrapper {
    font-family: 'GmarketSansMedium';
    width: 100%;
    height: 100%;
    font-size: 14px;
    color: ${theme.color.black100};
    background-color: ${theme.color.white100};
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  html {
    overflow-y: scroll;
  }

  body {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  a {
    color: ${theme.color.black100};
    text-decoration: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .pc-only {
    display: block;
    @media ${MOBILE_MEDIA_QUERY} {
      display: none;
    }
  }

  .mobile-only {
    display: none;
    @media ${MOBILE_MEDIA_QUERY} {
      display: block;
    }
  }

  .markdown {
    font-family: 'Noto Sans KR', sans-serif;
  }

  .scroll-locked {
    overflow: hidden;
  }
`;

const GlobalStyle: React.FC = () => <Global styles={style} />;

export default GlobalStyle;
