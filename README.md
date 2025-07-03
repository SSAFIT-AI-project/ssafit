# SSAFIT - 카드 비교 및 AI 추천 서비스

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

### 3. 카드 비교 ✅
- **현재 상태**: 완전히 구현되어 정상 작동
- 최대 3개 카드 동시 비교 기능
- 카드 목록에서 비교 목록 추가/제거
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

## 📦 로컬 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone https://github.com/your-username/ssafit.git
cd ssafit
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

개발 서버가 실행되면 브라우저에서 `http://localhost:3000`으로 접속할 수 있습니다.

### 4. 빌드
```bash
npm run build
```

### 5. 빌드 결과 미리보기
```bash
npm run preview
```

## 🚀 GitHub Pages 배포

### 1. 자동 배포 설정 (추천)

#### GitHub Actions 워크플로우 생성
프로젝트 루트에 `.github/workflows/deploy.yml` 파일을 생성하세요:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### GitHub 저장소 설정
1. GitHub 저장소에서 **Settings** 탭으로 이동
2. 왼쪽 메뉴에서 **Pages** 클릭
3. **Source** 섹션에서 **Deploy from a branch** 선택
4. **Branch**를 `gh-pages`로 설정하고 **Save** 클릭

### 2. 수동 배포

#### 빌드 및 배포
```bash
# 프로젝트 빌드
npm run build

# gh-pages 브랜치 생성 및 배포 (package.json에 deploy 스크립트 포함)
npm run deploy
```

또는 gh-pages 패키지를 직접 사용:
```bash
npm install -g gh-pages
gh-pages -d dist
```

#### GitHub 저장소 설정
1. GitHub 저장소에서 **Settings** → **Pages** 이동
2. **Source**를 **Deploy from a branch**로 설정
3. **Branch**를 `gh-pages`로 설정

### 3. 배포 확인
배포가 완료되면 `https://your-username.github.io/ssafit`에서 접속할 수 있습니다.

## 🔧 환경 변수 설정

### 기본 환경 변수
프로젝트 루트에 `.env` 파일을 생성하세요:

```bash
# API 설정
VITE_API_BASE_URL=/api

# 앱 설정
VITE_APP_TITLE=카드 비교 및 추천 서비스
VITE_APP_DESCRIPTION=삼성전자 브랜드 색상을 활용한 카드 비교 및 AI 추천 웹사이트
```

### GitHub Pages 배포용 환경 변수
GitHub Pages에서는 상대 경로를 사용하므로 `VITE_API_BASE_URL`을 다음과 같이 설정하세요:

```bash
# GitHub Pages 배포용
VITE_API_BASE_URL=/ssafit/api
```

### Vite 설정
`vite.config.ts`에서 GitHub Pages 배포를 위한 base 경로가 설정되어 있습니다:

```typescript
export default defineConfig({
  plugins: [vue()],
  // GitHub Pages 배포를 위한 base 경로
  base: '/ssafit/',
  server: {
    port: 3000
  }
})
```

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
├── stores/          # 상태 관리
│   └── compare.ts        # 카드 비교 스토어
├── router/          # 라우팅 설정
├── App.vue          # 메인 앱 컴포넌트
├── main.ts          # 앱 진입점
└── style.css        # 글로벌 스타일

public/
└── api/             # 더미 API 데이터
    ├── cards.json           # 카드 목록 데이터
    ├── popular-cards.json   # 인기 카드 데이터
    └── chatbot-responses.json # 챗봇 응답 데이터
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

### 카드 비교 (/compare) ✅
- **현재 상태**: 완전히 구현되어 정상 작동
- 선택한 카드들의 상세 비교 기능
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

## 🚀 향후 개선 사항

- [x] 카드 비교 기능 실제 구현
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