# Spotify Copy

Spotify 곡 URL에서 제목과 아티스트 정보를 추출하여 클립보드에 복사하는 웹 애플리케이션.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **UI Components**: Radix UI, Lucide React icons
- **Toast**: Sonner
- **Scraping**: Axios + Cheerio

## Project Structure

```
title-copy/
├── app/
│   ├── api/fetch/route.ts    # Spotify URL 스크래핑 API
│   ├── components/
│   │   ├── AlbumBackground.tsx # 블러 처리된 앨범 배경 컴포넌트
│   │   ├── Info.tsx          # 곡 정보 카드 컴포넌트
│   │   ├── InputLink.tsx     # URL 입력 컴포넌트
│   │   └── Settings.tsx      # 테마/언어 설정 버튼
│   ├── globals.css           # 전역 스타일 + 테마 변수
│   ├── layout.tsx            # 루트 레이아웃
│   ├── page.tsx              # 메인 페이지
│   └── providers.tsx         # Context Providers 래퍼
├── components/ui/            # shadcn/ui 컴포넌트
├── context/
│   ├── ThemeContext.tsx      # 다크/라이트 모드 상태 관리
│   ├── LanguageContext.tsx   # 다국어 상태 관리
│   └── DynamicColorContext.tsx # 동적 색상 테마 상태 관리
├── lib/
│   ├── clipboard.ts          # 클립보드 복사 유틸리티
│   ├── color-extractor.ts    # 앨범 색상 추출 유틸리티
│   ├── i18n.ts               # 번역 데이터 (EN/KO/JA)
│   └── utils.ts              # cn() 유틸리티
└── tailwind.config.ts        # Tailwind 설정
```

## Features

### 1. Spotify 곡 정보 추출
- Spotify 트랙 URL 입력 시 제목, 아티스트, 앨범 이미지 추출
- `/api/fetch` 엔드포인트에서 Cheerio로 HTML 파싱

### 2. 복사 기능
- 전체 정보 복사: `{제목} - {아티스트}`
- 개별 복사: 곡명만, 아티스트만
- 네이티브 Clipboard API 사용 (`lib/clipboard.ts`)

### 3. History
- 검색한 곡 목록 저장 (세션 내)
- 각 항목에서 바로 복사 가능

### 4. 뒤로가기 버튼
- 곡 정보 표시 시 왼쪽 상단에 뒤로가기 버튼 표시
- 클릭 시 메인 화면으로 복귀

### 5. 앨범 자켓 이미지 보호
- 우클릭 방지
- 드래그 방지

### 6. 다크/라이트 모드
- `ThemeContext`로 상태 관리
- `html` 요소에 `light`/`dark` 클래스 적용
- localStorage에 설정 저장
- 시스템 테마 자동 감지

### 7. 다국어 지원 (i18n)
- 지원 언어: English, 한국어, 日本語
- 브라우저 언어 자동 감지
- localStorage에 설정 저장

### 8. 동적 색상 테마 (Dynamic Color Theming)
- 앨범 자켓에서 대표 색상 자동 추출
- Canvas API를 사용한 클라이언트 사이드 색상 분석
- 추출된 색상으로 UI 전체 테마 동적 변경
- 부드러운 색상 전환 애니메이션

### 9. 앨범 배경 효과
- 앨범 자켓을 블러 처리하여 전체 배경으로 사용
- 글래스모피즘 효과로 콘텐츠 가독성 유지
- 라이트/다크 모드에 따른 적응형 밝기 조절
- 부드러운 페이드 인/아웃 전환

## Styling

### CSS Variables (globals.css)
테마별 색상 변수가 `:root`와 `html.light`에 정의됨:
- `--background`, `--foreground`: 배경/텍스트 색상
- `--card`, `--muted`, `--border`: UI 요소 색상
- `--primary`, `--accent`: 파스텔 민트 그린 (다크: #6FC7A7, 라이트: #3B9B73)

### Custom Utilities
- `.glass`: 글래스모피즘 효과
- `.glow-accent`: 민트 그린 글로우 효과
- `.glow-text`: 텍스트 글로우
- `.album-bg`: 앨범 배경 블러 효과
- `.album-bg-image`: 배경 이미지 스타일
- `.album-bg-overlay`: 적응형 오버레이

## Commands

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사
```

## Deployment

- **Platform**: Vercel
- **Branch**: master
- GitHub 연동 자동 배포

## Notes

- `react-copy-to-clipboard` 패키지는 React 19 미지원으로 제거됨
- 네이티브 `navigator.clipboard.writeText()` API 사용
- Next.js 이미지 최적화를 위해 `next.config.mjs`에 Spotify 이미지 도메인 설정 필요
