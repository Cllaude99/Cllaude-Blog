import { LightningBoltIcon, StarIcon } from '@radix-ui/react-icons';
import { ThemeManagerContext } from 'gatsby-emotion-dark-mode';
import { useContext } from 'react';

import * as S from './styled';

const ThemeToggle: React.FC = () => {
  const theme = useContext(ThemeManagerContext);

  return (
    <S.Wrapper onClick={() => theme.toggleDark()} isDark={theme.isDark}>
      <StarIcon className="theme-icon moon-icon" />
      <LightningBoltIcon className="theme-icon sun-icon" />
    </S.Wrapper>
  );
};

export default ThemeToggle;
