# 카드 비교 및 추천 서비스

삼성전자 브랜드 색상을 활용한 깔끔하고 모던한 카드 비교 및 AI 추천 웹사이트입니다.

## 🚀 주요 기능

### 1. 홈페이지
- 히어로 섹션과 서비스 소개
- 인기 카드 TOP 3 표시 (API에서 동적 로딩)
- AI 추천 서비스 안내

### 2. 카드 목록
- 다양한 카드 정보 제공 (API에서 동적 로딩)
- 카테고리, 연회비, 정렬 필터링
- 카드 상세 정보 모달
- 비교하기 기능

### 3. 카드 비교
- 최대 3개 카드 동시 비교
- 기본 정보, 혜택 비교 테이블
- AI 추천 결과 표시
- 직관적인 비교 인터페이스

### 4. AI 챗봇 추천
- 실시간 대화형 카드 추천 (API 기반 응답)
- 타이핑 애니메이션 효과
- 빠른 응답 버튼
- 추천 결과 실시간 표시

## 🎨 디자인 특징

- **삼성전자 브랜드 색상**: 파란색 계열의 전문적이고 신뢰감 있는 디자인
- **모던한 UI**: 깔끔하고 화려하지 않은 세련된 인터페이스
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기 지원
- **사용자 친화적**: 직관적인 네비게이션과 인터랙션

## 🛠️ 기술 스택

- **Frontend**: Vue.js 3 + TypeScript
- **Styling**: CSS3 (CSS Variables, Grid, Flexbox)
- **State Management**: Pinia
- **Routing**: Vue Router
- **Build Tool**: Vite
- **API**: Fetch API (더미 JSON 데이터)
- **Environment**: Vite 환경 변수

## 📦 설치 및 실행

### 1. 환경 변수 설정
프로젝트 루트에 환경 변수 파일을 생성하세요:

```bash
# 기본 환경 변수 (env.example을 복사)
cp env.example .env

# 개발 환경 (선택사항)
cp env.development.example .env.development

# 프로덕션 환경 (선택사항)
cp env.production.example .env.production
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 빌드
```bash
npm run build
```

### 5. 미리보기
```bash
npm run preview
```

## 🔧 환경 변수 설정

### 기본 환경 변수
```bash
# API 설정
VITE_API_BASE_URL=/api

# 앱 설정
VITE_APP_TITLE=카드 비교 및 추천 서비스
VITE_APP_DESCRIPTION=삼성전자 브랜드 색상을 활용한 카드 비교 및 AI 추천 웹사이트
```

### 환경별 설정

#### 개발 환경 (`.env.development`)
```bash
VITE_API_BASE_URL=/api
# 또는 로컬 백엔드 서버
# VITE_API_BASE_URL=http://localhost:3000/api
```

#### 프로덕션 환경 (`.env.production`)
```bash
VITE_API_BASE_URL=https://api.example.com/api
VITE_APP_TITLE=카드 비교 및 추천 서비스
```

### 환경 변수 우선순위
1. `.env.local` (로컬 개발용, git에 커밋되지 않음)
2. `.env.development` (개발 환경)
3. `.env.production` (프로덕션 환경)
4. `.env` (기본값)

## 📁 프로젝트 구조

```
src/
├── views/           # 페이지 컴포넌트
│   ├── HomeView.vue      # 홈페이지
│   ├── CardsView.vue     # 카드 목록
│   ├── CompareView.vue   # 카드 비교
│   └── ChatbotView.vue   # AI 챗봇
├── services/        # API 서비스
│   └── api.ts            # API 호출 및 타입 정의
├── router/          # 라우팅 설정
├── App.vue          # 메인 앱 컴포넌트
├── main.ts          # 앱 진입점
└── style.css        # 글로벌 스타일

# 루트 파일들
env.d.ts                 # Vue 컴포넌트 및 환경 변수 타입 정의

public/
└── api/             # 더미 API 데이터
    ├── cards.json           # 카드 목록 데이터
    ├── popular-cards.json   # 인기 카드 데이터
    └── chatbot-responses.json # 챗봇 응답 데이터

# 환경 변수 파일들
env.example              # 기본 환경 변수 예시
env.development.example  # 개발 환경 예시
env.production.example   # 프로덕션 환경 예시
```

## 🔌 API 서비스 구조

### 더미 데이터 구조
프로젝트는 실제 백엔드 API를 시뮬레이션하기 위해 `public/api/` 폴더에 JSON 파일들을 제공합니다:

#### 1. 카드 목록 API (`/api/cards.json`)
```json
{
  "success": true,
  "data": {
    "cards": [...],
    "categories": [...],
    "total": 6
  }
}
```

#### 2. 인기 카드 API (`/api/popular-cards.json`)
```json
{
  "success": true,
  "data": {
    "popularCards": [...]
  }
}
```

#### 3. 챗봇 응답 API (`/api/chatbot-responses.json`)
```json
{
  "success": true,
  "data": {
    "responses": {
      "greeting": {...},
      "daily_life": {...},
      "transportation": {...},
      ...
    }
  }
}
```

### API 서비스 기능
- **실제 API 호출 시뮬레이션**: fetch API를 사용하여 더미 JSON 파일 호출
- **로딩 상태 관리**: 각 API 호출에 대한 로딩 스피너 제공
- **에러 처리**: 네트워크 오류 및 데이터 로딩 실패 처리
- **타입 안전성**: TypeScript 인터페이스를 통한 타입 정의
- **지연 시뮬레이션**: 실제 API처럼 약간의 지연 시간 추가
- **환경 변수 지원**: `VITE_API_BASE_URL`을 통한 API 엔드포인트 설정

### 주요 API 함수
- `getCards()`: 전체 카드 목록 조회
- `getPopularCards()`: 인기 카드 TOP 3 조회
- `getCardById(id)`: 특정 카드 상세 정보 조회
- `getChatbotResponse(type)`: 챗봇 응답 조회
- `searchCards(params)`: 카드 검색 및 필터링

## 🎯 주요 페이지

### 홈페이지 (/)
- 서비스 소개 및 주요 기능 안내
- 인기 카드 미리보기 (API에서 동적 로딩)
- AI 추천 서비스 CTA

### 카드 목록 (/cards)
- 전체 카드 목록 표시 (API에서 동적 로딩)
- 필터링 및 정렬 기능
- 카드 상세 정보 모달
- 로딩 상태 및 에러 처리

### 카드 비교 (/compare)
- 선택한 카드들의 상세 비교
- 비교 테이블 형태로 정보 제공
- AI 추천 결과 표시
- 카드 선택 모달

### AI 추천 (/chatbot)
- 대화형 카드 추천 시스템 (API 기반 응답)
- 실시간 채팅 인터페이스
- 추천 결과 실시간 업데이트
- 빠른 응답 버튼

## 🎨 색상 팔레트

- **Primary Blue**: #1428a0 (삼성전자 메인 블루)
- **Light Blue**: #1e3a8a
- **Dark Blue**: #0f172a
- **Gray**: #64748b
- **Light Gray**: #f1f5f9
- **White**: #ffffff
- **Black**: #0f172a

## 📱 반응형 지원

- **Desktop**: 1200px 이상
- **Tablet**: 768px - 1199px
- **Mobile**: 767px 이하

## 🔧 커스터마이징

### 색상 변경
`src/style.css` 파일의 CSS 변수를 수정하여 색상을 변경할 수 있습니다:

```css
:root {
  --samsung-blue: #1428a0;
  --samsung-light-blue: #1e3a8a;
  /* ... */
}
```

### 카드 데이터 추가
`public/api/cards.json` 파일에 새로운 카드 정보를 추가할 수 있습니다.

### 챗봇 응답 수정
`public/api/chatbot-responses.json` 파일에서 챗봇의 응답을 수정할 수 있습니다.

### API 엔드포인트 변경
실제 백엔드 API로 전환할 때는 환경 변수 파일에서 `VITE_API_BASE_URL`을 수정하면 됩니다:

```bash
# 개발 환경
VITE_API_BASE_URL=http://localhost:3000/api

# 프로덕션 환경
VITE_API_BASE_URL=https://api.example.com/api
```

## 🚀 향후 개선 사항

- [ ] 실제 백엔드 API 연동
- [ ] 사용자 인증 시스템
- [ ] 카드 신청 기능
- [ ] 실시간 알림 시스템
- [ ] 성능 최적화
- [ ] PWA 지원

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.

## 🚀 배포 가이드

### 1. **GitHub Pages 배포 (추천 - 무료)**

#### 자동 배포 설정
1. GitHub 저장소에서 **Settings** → **Pages** 이동
2. **Source**를 **GitHub Actions**로 설정
3. `main` 브랜치에 푸시하면 자동으로 배포됨

#### 수동 배포
```bash
# 프로젝트 빌드
npm run build

# dist 폴더의 내용을 GitHub Pages에 업로드
# 또는 GitHub Actions가 자동으로 처리
```

### 2. **Netlify 배포**

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로그인
netlify login

# 프로젝트 빌드
npm run build

# 배포
netlify deploy --prod --dir=dist
```

### 3. **Vercel 배포**

```bash
# Vercel CLI 설치
npm install -g vercel

# 로그인 (브라우저에서 인증)
vercel login

# 프로젝트 빌드
npm run build

# 배포
vercel --prod
```

### 4. **서버 배포**

#### Nginx 설정
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your-project/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
    }
}
```

### 5. **환경 변수 설정**

배포 시 환경 변수를 설정해야 합니다:

#### GitHub Pages
- 환경 변수는 빌드 시점에 포함되므로 `.env.production` 파일 사용

#### Netlify/Vercel
- 대시보드에서 환경 변수 설정
- `VITE_API_BASE_URL` 설정 필요

## 📦 설치 및 실행 