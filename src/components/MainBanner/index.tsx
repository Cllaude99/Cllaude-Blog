import React, { useEffect, useState } from 'react';

import { Author } from '@/src/type';

import * as S from './styled';

type MainBannerProps = {
  author: Author;
};

const MainBanner: React.FC<MainBannerProps> = ({ author }) => {
  const { social, dropdown } = author;

  const [isDropdownOpened, setIsDropdownOpened] = useState(false);
  const [displayText1, setDisplayText1] = useState('');
  const [displayText2, setDisplayText2] = useState('');
  const [showLastLine, setShowLastLine] = useState(false);

  const fullText1 = '변화에 유연한 코드와';
  const fullText2 = '사용자 관찰로 완성도를 높이는';

  // 타이핑 효과를 위한 굵은 단어 부분과 일반 텍스트 부분 분리
  const boldPart1 = '변화에 유연한';
  const normalPart1 = ' 코드와';
  const boldPart2 = '사용자 관찰';
  const normalPart2 = '로 완성도를 높이는';

  useEffect(() => {
    // 첫 번째 라인 타이핑 효과
    let currentIndex = 0;
    const interval1 = setInterval(() => {
      if (currentIndex <= fullText1.length) {
        setDisplayText1(fullText1.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval1);

        // 두 번째 라인 타이핑 효과 시작
        let secondIndex = 0;
        const interval2 = setInterval(() => {
          if (secondIndex <= fullText2.length) {
            setDisplayText2(fullText2.substring(0, secondIndex));
            secondIndex++;
          } else {
            clearInterval(interval2);
            // 마지막 라인 페이드인 효과
            setTimeout(() => {
              setShowLastLine(true);
            }, 300);
          }
        }, 50);
      }
    }, 50);

    return () => {
      clearInterval(interval1);
    };
  }, []);

  // 굵은 텍스트를 처음부터 적용하는 함수
  const renderFirstLine = () => {
    const currentTextLength = displayText1.length;

    if (currentTextLength === 0) return null;

    // boldPart1의 표시할 길이 계산
    const boldLength = Math.min(currentTextLength, boldPart1.length);
    const boldText = boldPart1.substring(0, boldLength);

    // 나머지 일반 텍스트 부분 계산
    let normalText = '';
    if (currentTextLength > boldPart1.length) {
      normalText = normalPart1.substring(
        0,
        currentTextLength - boldPart1.length
      );
    }

    return (
      <>
        <S.BoldText>{boldText}</S.BoldText>
        {normalText}
      </>
    );
  };

  // 두 번째 줄을 위한 함수
  const renderSecondLine = () => {
    const currentTextLength = displayText2.length;

    if (currentTextLength === 0) return null;

    // boldPart2의 표시할 길이 계산
    const boldLength = Math.min(currentTextLength, boldPart2.length);
    const boldText = boldPart2.substring(0, boldLength);

    // 나머지 일반 텍스트 부분 계산
    let normalText = '';
    if (currentTextLength > boldPart2.length) {
      normalText = normalPart2.substring(
        0,
        currentTextLength - boldPart2.length
      );
    }

    return (
      <>
        <S.BoldText>{boldText}</S.BoldText>
        {normalText}
      </>
    );
  };

  return (
    <S.Wrapper>
      <S.IntroWrapper>
        <S.Title>
          <S.TypingLine>{renderFirstLine()}</S.TypingLine>
          <S.TypingLine>{renderSecondLine()}</S.TypingLine>
          {showLastLine && (
            <S.LastLine className="fade-in">
              개발자 <S.BoldText>김태윤</S.BoldText> 입니다.
            </S.LastLine>
          )}
        </S.Title>
        <S.SocialWrapper>
          {Object.keys(social).map(
            (link, index) =>
              social[link as keyof typeof social] && (
                <S.SocialButton
                  key={index}
                  target="_blank"
                  href={social[link as keyof typeof social]}
                >
                  {link}
                </S.SocialButton>
              )
          )}
          {/* space-between을 위한 빈 div */}
          <div />
          <S.DropdownButton onMouseLeave={() => setIsDropdownOpened(false)}>
            <div onMouseEnter={() => setIsDropdownOpened(true)}>etc.</div>
            {isDropdownOpened && (
              <S.Dropdown>
                {Object.keys(dropdown).map(
                  (link, index) =>
                    dropdown[link as keyof typeof dropdown] && (
                      <S.SocialButton
                        key={index}
                        target="_blank"
                        href={dropdown[link as keyof typeof dropdown]}
                      >
                        {link}
                      </S.SocialButton>
                    )
                )}
              </S.Dropdown>
            )}
          </S.DropdownButton>
        </S.SocialWrapper>
      </S.IntroWrapper>
    </S.Wrapper>
  );
};

export default MainBanner;
