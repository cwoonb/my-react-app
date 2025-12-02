# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
# my-react-app

React + TypeScript + Vite로 만든 멀티 페이지 웹 애플리케이션입니다.

## 주요 기능

### 1. 홈 페이지
- 환영 메시지와 프로젝트 소개
- 뉴스와 채팅 페이지로 이동하는 카드

### 2. 뉴스 페이지
- 카테고리별 뉴스 필터링 (전체, 기술, 정치, 스포츠, 경제, 연예, 건강, 교육)
- 카테고리별 통계 분석 (뉴스 개수, 평균 조회수, 평균 좋아요)
- 뉴스 목록 표시 (제목, 내용, 날짜, 조회수, 좋아요)

### 3. 채팅 페이지
- 틴더 스타일 프로필 카드
- 좋아요(❤️) / 패스(✕) 버튼으로 매칭
- 매칭된 프로필과 실시간 채팅
- 메시지 저장 기능 (localStorage)

## 기술 스택

- **React 19.2.0** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Vite 7.2.4** - 빌드 도구
- **React Router DOM 7.9.6** - 라우팅

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   └── Navigation.tsx   # 상단 네비게이션 바
├── pages/              # 페이지 컴포넌트
│   ├── Home.tsx        # 홈 페이지
│   ├── News.tsx        # 뉴스 페이지
│   └── Chat.tsx        # 채팅 페이지
├── data/               # 데이터 파일
│   ├── newsData.ts     # 뉴스 데이터
│   └── chatProfiles.ts # 채팅 프로필 데이터
├── types/              # TypeScript 타입 정의
│   └── index.ts
├── App.tsx             # 메인 앱 컴포넌트
└── main.tsx            # 진입점
```

## 사용 방법

### 1. [서버 올리기]

```bash
cd /Users/woonbaecho/Desktop/pages/my-react-app
npm run dev
```

브라우저에서 `http://localhost:5173/` 접속

---

### 2. [깃허브 올리기]

```bash
cd /Users/woonbaecho/Desktop/pages/my-react-app
git add .
git commit -m "update"
git push
```

---

### 3. [Netlify 배포 확인]

- GitHub에 푸시하면 자동으로 배포됩니다
- 배포 URL: `https://forge-echo.netlify.app`
- Netlify 대시보드에서 배포 상태 확인 가능

---

### 4. [빌드 테스트]

```bash
cd /Users/woonbaecho/Desktop/pages/my-react-app
npm run build
```

빌드 결과물은 `dist/` 폴더에 생성됩니다.

---

## 다른 컴퓨터에서 작업하기

### 1. [다른 컴퓨터에서 프로젝트 가져오기]

```bash
# GitHub 저장소 클론
git clone https://github.com/cwoonb/my-react-app.git

# 프로젝트 폴더로 이동
cd my-react-app

# 패키지 설치
npm install
```

### 2. [수정 후 다시 올리기]

```bash
# 변경사항 확인
git status

# 변경사항 추가
git add .

# 커밋
git commit -m "수정 내용 설명"

# GitHub에 푸시
git push
```

### 3. [다시 원래 컴퓨터에서 가져오기]

```bash
cd /Users/woonbaecho/Desktop/pages/my-react-app

# 최신 변경사항 가져오기
git pull
```

---

## 주의사항

- 다른 컴퓨터에서 작업하기 전에 **반드시 `git push`로 현재 작업을 올려놓기**
- 다른 컴퓨터에서 작업 후에도 **`git push`로 올려야** 원래 컴퓨터에서 `git pull`로 받을 수 있음
- `node_modules` 폴더는 자동으로 무시되므로 각 컴퓨터에서 `npm install` 필요

## 주요 파일 설명

- `netlify.toml` - Netlify 빌드 설정
- `public/_redirects` - React Router SPA 리다이렉트 설정
- `vite.config.ts` - Vite 빌드 설정
- `tsconfig.json` - TypeScript 설정



