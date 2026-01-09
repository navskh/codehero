// 스킬트리 타입 정의

export interface ISkillTree {
  branches: ISkillBranch[];
}

export interface ISkillBranch {
  id: string;
  name: string;
  icon: string;
  color: string;
  skills: ISkill[];
}

export interface ISkill {
  id: string;
  branchId: string;
  name: string;
  description: string;
  icon: string;
  tier: number; // 1-5
  maxLevel: number;
  currentLevel: number;
  cost: number;
  prerequisites: string[];
  effects: ISkillEffect[];
  position: { x: number; y: number };
}

export interface ISkillEffect {
  type: 'xp_multiplier' | 'unlock_item' | 'streak_bonus' | 'special';
  value: number | string;
  description: string;
}

// 기본 스킬트리 정의
export const DEFAULT_SKILL_TREE: ISkillTree = {
  branches: [
    {
      id: 'frontend',
      name: '프론트엔드 마스터리',
      icon: '🎨',
      color: '#61DAFB',
      skills: [
        {
          id: 'fe_basics',
          branchId: 'frontend',
          name: 'HTML/CSS 기초',
          description: '웹의 기본을 마스터합니다',
          icon: '🌐',
          tier: 1,
          maxLevel: 3,
          currentLevel: 0,
          cost: 1,
          prerequisites: [],
          effects: [
            { type: 'xp_multiplier', value: 1.05, description: '프론트엔드 태스크 XP +5%' },
          ],
          position: { x: 100, y: 50 },
        },
        {
          id: 'fe_javascript',
          branchId: 'frontend',
          name: 'JavaScript',
          description: '웹의 언어를 정복합니다',
          icon: '📜',
          tier: 2,
          maxLevel: 3,
          currentLevel: 0,
          cost: 2,
          prerequisites: ['fe_basics'],
          effects: [
            { type: 'xp_multiplier', value: 1.1, description: 'JS 태스크 XP +10%' },
          ],
          position: { x: 100, y: 120 },
        },
        {
          id: 'fe_react',
          branchId: 'frontend',
          name: 'React',
          description: '컴포넌트의 세계로',
          icon: '⚛️',
          tier: 3,
          maxLevel: 3,
          currentLevel: 0,
          cost: 3,
          prerequisites: ['fe_javascript'],
          effects: [
            { type: 'xp_multiplier', value: 1.15, description: 'React 태스크 XP +15%' },
          ],
          position: { x: 100, y: 190 },
        },
        {
          id: 'fe_typescript',
          branchId: 'frontend',
          name: 'TypeScript',
          description: '타입의 힘을 얻습니다',
          icon: '📘',
          tier: 3,
          maxLevel: 3,
          currentLevel: 0,
          cost: 3,
          prerequisites: ['fe_javascript'],
          effects: [
            { type: 'xp_multiplier', value: 1.15, description: 'TS 태스크 XP +15%' },
          ],
          position: { x: 200, y: 190 },
        },
        {
          id: 'fe_master',
          branchId: 'frontend',
          name: '프론트엔드 마스터',
          description: 'UI의 달인',
          icon: '👑',
          tier: 5,
          maxLevel: 1,
          currentLevel: 0,
          cost: 5,
          prerequisites: ['fe_react', 'fe_typescript'],
          effects: [
            { type: 'xp_multiplier', value: 1.25, description: '모든 프론트엔드 XP +25%' },
            { type: 'unlock_item', value: 'bg_modern_office', description: '배경 해금: 모던 오피스' },
          ],
          position: { x: 150, y: 280 },
        },
      ],
    },
    {
      id: 'backend',
      name: '백엔드 전문가',
      icon: '⚙️',
      color: '#68A063',
      skills: [
        {
          id: 'be_basics',
          branchId: 'backend',
          name: '서버 기초',
          description: '서버의 세계에 입문합니다',
          icon: '🖥️',
          tier: 1,
          maxLevel: 3,
          currentLevel: 0,
          cost: 1,
          prerequisites: [],
          effects: [
            { type: 'xp_multiplier', value: 1.05, description: '백엔드 태스크 XP +5%' },
          ],
          position: { x: 100, y: 50 },
        },
        {
          id: 'be_nodejs',
          branchId: 'backend',
          name: 'Node.js',
          description: 'JavaScript로 서버를 구축합니다',
          icon: '💚',
          tier: 2,
          maxLevel: 3,
          currentLevel: 0,
          cost: 2,
          prerequisites: ['be_basics'],
          effects: [
            { type: 'xp_multiplier', value: 1.1, description: 'Node.js 태스크 XP +10%' },
          ],
          position: { x: 100, y: 120 },
        },
        {
          id: 'be_database',
          branchId: 'backend',
          name: '데이터베이스',
          description: '데이터의 세계를 정복합니다',
          icon: '🗄️',
          tier: 2,
          maxLevel: 3,
          currentLevel: 0,
          cost: 2,
          prerequisites: ['be_basics'],
          effects: [
            { type: 'xp_multiplier', value: 1.1, description: 'DB 태스크 XP +10%' },
          ],
          position: { x: 200, y: 120 },
        },
        {
          id: 'be_api',
          branchId: 'backend',
          name: 'API 설계',
          description: 'RESTful API의 달인',
          icon: '🔌',
          tier: 3,
          maxLevel: 3,
          currentLevel: 0,
          cost: 3,
          prerequisites: ['be_nodejs', 'be_database'],
          effects: [
            { type: 'xp_multiplier', value: 1.15, description: 'API 태스크 XP +15%' },
          ],
          position: { x: 150, y: 190 },
        },
        {
          id: 'be_master',
          branchId: 'backend',
          name: '백엔드 마스터',
          description: '서버의 지배자',
          icon: '👑',
          tier: 5,
          maxLevel: 1,
          currentLevel: 0,
          cost: 5,
          prerequisites: ['be_api'],
          effects: [
            { type: 'xp_multiplier', value: 1.25, description: '모든 백엔드 XP +25%' },
            { type: 'unlock_item', value: 'bg_server', description: '배경 해금: 서버룸' },
          ],
          position: { x: 150, y: 280 },
        },
      ],
    },
    {
      id: 'devops',
      name: 'DevOps 엔지니어',
      icon: '🚀',
      color: '#FF6B6B',
      skills: [
        {
          id: 'do_basics',
          branchId: 'devops',
          name: '인프라 기초',
          description: '인프라의 세계에 입문합니다',
          icon: '🏗️',
          tier: 1,
          maxLevel: 3,
          currentLevel: 0,
          cost: 1,
          prerequisites: [],
          effects: [
            { type: 'xp_multiplier', value: 1.05, description: 'DevOps 태스크 XP +5%' },
          ],
          position: { x: 100, y: 50 },
        },
        {
          id: 'do_docker',
          branchId: 'devops',
          name: 'Docker',
          description: '컨테이너의 마법사',
          icon: '🐳',
          tier: 2,
          maxLevel: 3,
          currentLevel: 0,
          cost: 2,
          prerequisites: ['do_basics'],
          effects: [
            { type: 'xp_multiplier', value: 1.1, description: 'Docker 태스크 XP +10%' },
          ],
          position: { x: 100, y: 120 },
        },
        {
          id: 'do_kubernetes',
          branchId: 'devops',
          name: 'Kubernetes',
          description: '오케스트레이션의 대가',
          icon: '☸️',
          tier: 3,
          maxLevel: 3,
          currentLevel: 0,
          cost: 3,
          prerequisites: ['do_docker'],
          effects: [
            { type: 'xp_multiplier', value: 1.15, description: 'K8s 태스크 XP +15%' },
          ],
          position: { x: 100, y: 190 },
        },
        {
          id: 'do_cicd',
          branchId: 'devops',
          name: 'CI/CD',
          description: '자동화의 달인',
          icon: '🔄',
          tier: 3,
          maxLevel: 3,
          currentLevel: 0,
          cost: 3,
          prerequisites: ['do_docker'],
          effects: [
            { type: 'xp_multiplier', value: 1.15, description: 'CI/CD 태스크 XP +15%' },
          ],
          position: { x: 200, y: 190 },
        },
        {
          id: 'do_master',
          branchId: 'devops',
          name: 'DevOps 마스터',
          description: '인프라의 지배자',
          icon: '👑',
          tier: 5,
          maxLevel: 1,
          currentLevel: 0,
          cost: 5,
          prerequisites: ['do_kubernetes', 'do_cicd'],
          effects: [
            { type: 'xp_multiplier', value: 1.25, description: '모든 DevOps XP +25%' },
            { type: 'unlock_item', value: 'effect_cloud', description: '이펙트 해금: 클라우드 오라' },
          ],
          position: { x: 150, y: 280 },
        },
      ],
    },
    {
      id: 'softskill',
      name: '소프트 스킬',
      icon: '💬',
      color: '#9B59B6',
      skills: [
        {
          id: 'ss_communication',
          branchId: 'softskill',
          name: '커뮤니케이션',
          description: '효과적인 소통의 기술',
          icon: '💬',
          tier: 1,
          maxLevel: 3,
          currentLevel: 0,
          cost: 1,
          prerequisites: [],
          effects: [
            { type: 'xp_multiplier', value: 1.05, description: '리뷰/문서 태스크 XP +5%' },
          ],
          position: { x: 100, y: 50 },
        },
        {
          id: 'ss_teamwork',
          branchId: 'softskill',
          name: '팀워크',
          description: '함께 성장하는 힘',
          icon: '🤝',
          tier: 2,
          maxLevel: 3,
          currentLevel: 0,
          cost: 2,
          prerequisites: ['ss_communication'],
          effects: [
            { type: 'streak_bonus', value: 5, description: '연속 출석 보너스 +5 XP' },
          ],
          position: { x: 100, y: 120 },
        },
        {
          id: 'ss_leadership',
          branchId: 'softskill',
          name: '리더십',
          description: '팀을 이끄는 능력',
          icon: '👔',
          tier: 3,
          maxLevel: 3,
          currentLevel: 0,
          cost: 3,
          prerequisites: ['ss_teamwork'],
          effects: [
            { type: 'xp_multiplier', value: 1.1, description: '모든 태스크 XP +10%' },
          ],
          position: { x: 100, y: 190 },
        },
        {
          id: 'ss_mentor',
          branchId: 'softskill',
          name: '멘토링',
          description: '지식을 나누는 기쁨',
          icon: '🎓',
          tier: 4,
          maxLevel: 3,
          currentLevel: 0,
          cost: 4,
          prerequisites: ['ss_leadership'],
          effects: [
            { type: 'xp_multiplier', value: 1.15, description: '학습 노트 XP +15%' },
          ],
          position: { x: 100, y: 260 },
        },
        {
          id: 'ss_master',
          branchId: 'softskill',
          name: '인간관계의 달인',
          description: '모두가 인정하는 리더',
          icon: '👑',
          tier: 5,
          maxLevel: 1,
          currentLevel: 0,
          cost: 5,
          prerequisites: ['ss_mentor'],
          effects: [
            { type: 'xp_multiplier', value: 1.2, description: '모든 XP +20%' },
            { type: 'unlock_item', value: 'outfit_leader', description: '의상 해금: 리더의 정장' },
          ],
          position: { x: 100, y: 330 },
        },
      ],
    },
  ],
};
