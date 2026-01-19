# Spotify Copy

Spotify 곡 URL에서 제목과 아티스트 정보를 추출하여 클릭 한 번으로 복사할 수 있는 웹 애플리케이션입니다.

## Features

- **곡 정보 추출** - Spotify 트랙 URL을 입력하면 제목, 아티스트, 앨범 커버 이미지를 자동으로 추출
- **원클릭 복사** - 전체 정보, 곡명만, 아티스트만 선택하여 복사
- **History** - 검색한 곡 목록을 세션 내에서 저장하고 빠르게 재복사
- **뒤로가기** - 곡 정보 표시 시 왼쪽 상단 버튼으로 메인 화면 복귀
- **이미지 보호** - 앨범 자켓 이미지 우클릭/드래그 방지
- **다크/라이트 모드** - 시스템 테마 자동 감지 및 수동 전환 지원
- **다국어 지원** - English, 한국어, 日本語 (브라우저 언어 자동 감지)

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/itku3/title-copy.git
cd title-copy

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm run start
```

## Usage

1. Spotify에서 곡의 공유 링크를 복사합니다
2. URL을 입력창에 붙여넣고 검색 버튼을 클릭합니다
3. 원하는 정보를 클릭하여 복사합니다
   - **전체 복사**: `제목 - 아티스트` 형식
   - **곡명**: 제목만 복사
   - **아티스트**: 아티스트명만 복사

## Deployment

이 프로젝트는 [Vercel](https://vercel.com)에 배포되어 있습니다.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/itku3/title-copy)

## License

MIT License
