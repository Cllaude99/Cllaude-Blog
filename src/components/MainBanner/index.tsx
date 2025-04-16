import { useEffect, useState } from 'react';

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

  const text1 = '변화에 유연한 코드와';
  const text2 = '사용자 관찰로 완성도를 높이는';

  useEffect(() => {
    // 첫 번째 라인 타이핑 효과
    let currentIndex = 0;
    const interval1 = setInterval(() => {
      if (currentIndex <= text1.length) {
        setDisplayText1(text1.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval1);

        // 두 번째 라인 타이핑 효과 시작
        let secondIndex = 0;
        const interval2 = setInterval(() => {
          if (secondIndex <= text2.length) {
            setDisplayText2(text2.substring(0, secondIndex));
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

  return (
    <S.Wrapper>
      <S.IntroWrapper>
        <S.Title>
          <S.TypingLine>{displayText1}</S.TypingLine>
          <S.TypingLine>{displayText2}</S.TypingLine>
          {showLastLine && (
            <S.LastLine className="fade-in">개발자 김태윤 입니다.</S.LastLine>
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
