export default {
  /**
   * basic Information
   */
  title: `Cllaude.com`,
  description: `개발자 태윤`,
  language: `ko`,
  siteUrl: `https://Cllaude.com/`,
  ogImage: `/profile-image.jpeg`,

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
    stack: ['Frontend', 'React', 'Typescript'],
    bio: {
      email: `cllaude1025@gmail.com`,
      residence: 'Seoul, South Korea',
      bachelorDegree: 'Dongguk Univ. Computer Engineering (2019.03 - 2026.02)',
    },
    social: {
      github: `https://github.com/danmin20`,
      linkedIn: `https://www.linkedin.com/in/jeonming-lee/`,
      resume: `https://www.figma.com/file/dtkCl6G7G5DVe18DN2LWny/%EC%9D%B4%EC%A0%95%EB%AF%BC-%EC%9D%B4%EB%A0%A5%EC%84%9C?node-id=0%3A1`,
    },
    dropdown: {
      tistory: 'https://danminblog.tistory.com/',
      velog: 'https://velog.io/@danmin20',
    },
  },

  /**
   * definition of featured posts
   */
  featured: [
    {
      title: 'category1',
      category: 'featured-category1',
    },
    {
      title: 'category2',
      category: 'featured-category2',
    },
  ],

  /**
   * metadata for About Page
   */
  timestamps: [
    {
      category: 'Career',
      date: '2022.01.04 - NOW',
      en: 'A Corp.',
      kr: 'A 회사',
      info: 'A 팀',
      link: '',
    },
    {
      category: 'Career',
      date: '2021.01.04 - 2022.01.04',
      en: 'B Corp.',
      kr: 'B 회사',
      info: 'B 팀',
      link: '',
    },
    {
      category: 'Activity',
      date: '2023.07 - NOW',
      en: 'Community',
      kr: '커뮤니티',
      info: 'IT 커뮤니티',
      link: '',
    },
  ],

  /**
   * metadata for Playground Page
   */
  projects: [
    {
      title: 'Portfolio',
      description: '포트폴리오',
      techStack: ['React', 'Next.js', 'Typescript'],
      thumbnailUrl: '', // Path to your in the 'assets' folder
      links: {
        post: '',
        github: '',
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
