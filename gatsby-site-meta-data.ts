export default {
  /**
   * basic Information
   */
  title: `Cllaude`,
  description: `태윤 블로그`,
  language: `ko`,
  siteUrl: `https://Cllaude.com/`,
  ogImage: `profile-image.jpeg`,

  /**
   * comments setting
   */
  comments: {
    utterances: {
      repo: `Cllaude99/Cllaude-s-Blog`,
    },
  },

  /**
   * introduce yourself
   */
  author: {
    name: `김태윤`,
    nickname: `Cllaude`,
    stack: ['Frontend', 'React', 'TypeScript'],
    bio: {
      email: `cllaude1025@gmail.com`,
      residence: 'Seoul, South Korea',
      bachelorDegree: 'Dongguk Univ. Computer Engineering (2019.03 - 2026.02)',
    },
    social: {
      github: `https://github.com/Cllaude99`,
      linkedIn: `https://www.linkedin.com/in/%ED%83%9C%EC%9C%A4-%EA%B9%80-a94635301/`,
      resume: `https://www.figma.com/design/ECIxHfNqXzkvm2TPPL3WSB/%EA%B9%80%ED%83%9C%EC%9C%A4-%EC%9D%B4%EB%A0%A5%EC%84%9C?node-id=0-1&t=YuzXOzTZz08GcqY4-1`,
    },
    dropdown: {
      velog: 'https://velog.io/@cllaude/posts',
    },
  },

  /**
   * definition of featured posts
   */
  featured: [
    {
      title: 'Dev',
      category: 'featured-Dev',
    },
    {
      title: 'Experience',
      category: 'featured-Experience',
    },
    {
      title: '회고',
      category: 'featured-회고',
    },
  ],

  /**
   * metadata for About Page
   */
  timestamps: [
    {
      category: 'Career',
      date: '2024.08.11 - 2024.11.11',
      en: 'Daangn.',
      kr: '당근(인턴)',
      info: 'SummerTech Internship',
      link: '',
    },
    {
      category: 'Activity',
      date: '2025.03 ~',
      en: 'Farm System',
      kr: 'Farm System 보안/웹',
      info: '교내 자율 학습 동아리',
      link: 'https://www.farmsystem.kr/',
    },
    {
      category: 'Activity',
      date: '2025.03 ~ ',
      en: '9roomthon Univ',
      kr: '9roomthon Univ',
      info: 'IT 연합 동아리',
      link: 'https://9oormthon.university/',
    },
    {
      category: 'Activity',
      date: '2024.06.24 - 2024.12.06',
      en: 'Naver Boostcamp.',
      kr: '네이버 부스트캠프',
      info: '부스트캠프 9기',
      link: 'https://boostcamp.connect.or.kr/',
    },
    {
      category: 'Activity',
      date: '2023.09 - 2024.09',
      en: 'Cotato.',
      kr: '코테이토',
      info: 'IT 동아리',
      link: 'https://www.cotato.kr/',
    },
    ,
  ],

  /**
   * metadata for Playground Page
   */
  projects: [
    {
      title: 'Syncspot',
      description: '모임의 중간 지점을 찾아주는 서비스',
      techStack: ['React', 'TS'],
      thumbnailUrl: 'syncspot.png', // Path to your in the 'assets' folder
      links: {
        post: '',
        github: 'https://github.com/Cotato-Syncspot/Syncspot-FE',
        demo: 'https://syncspot.kr/',
        googlePlay: '',
        appStore: '',
      },
    },
    {
      title: 'Pinoco',
      description: '실시간으로 즐기는 라이어 게임',
      techStack: ['React', 'TS'],
      thumbnailUrl: 'pinoco.png', // Path to your in the 'assets' folder
      links: {
        post: '',
        github: 'https://github.com/boostcampwm-2024/web23-Pinoco',
        demo: 'https://pinoco.site/',
        googlePlay: '',
        appStore: '',
      },
    },
    {
      title: 'Cotato FE Networking',
      description: 'IT 동아리 프론트엔드 네트워킹 사이트',
      techStack: ['Next.js', 'TS'],
      thumbnailUrl: 'cotato-fe-networking.png', // Path to your in the 'assets' folder
      links: {
        post: '',
        github: 'https://github.com/Cllaude99/Cotato-FE-Networking',
        demo: 'https://cotato-fe-networking-kimtaeyoons-projects.vercel.app/',
        googlePlay: '',
        appStore: '',
      },
    },
    {
      title: 'Flow Bit',
      description: 'AI모델을 통해 비트코인 가격을 예측하는 서비스',
      techStack: ['React', 'TS'],
      thumbnailUrl: 'flow-bit.png', // Path to your in the 'assets' folder
      links: {
        post: '',
        github: 'https://github.com/flowbit-team',
        demo: '',
        googlePlay: '',
        appStore: '',
      },
    },
  ],

  /**
   * metadata for Buy Me A Coffee
   */
  remittances: {
    toss: {
      link: 'https://toss.me/danmin',
      qrCode: 'toss_qr.svg', // Path to your in the 'assets' folder
    },
    kakaopay: {
      qrCode: 'kakao_qr.svg', // Path to your in the 'assets' folder
    },
  },
};
