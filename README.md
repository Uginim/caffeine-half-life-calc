# ☕ 카페인 반감기 계산기

내 몸속 카페인이 언제 사라질까요? 카페인 섭취량과 시간을 입력하면 실시간으로 체내 카페인 수치를 확인할 수 있습니다.

## ✨ 주요 기능

- 📊 실시간 카페인 잔량 계산
- 📈 시간별 카페인 감소 그래프
- ⏱️ 타임라인으로 보는 카페인 제거 과정
- 📱 모바일 친화적인 반응형 디자인
- 🌙 다크모드 자동 지원
- 💯 100% 정적 웹사이트 (서버 불필요)

## 🚀 Cloudflare Pages 배포 방법

### 방법 1: Git 연동 (추천)

1. GitHub에 이 저장소를 push합니다
2. [Cloudflare Dashboard](https://dash.cloudflare.com/)에 로그인
3. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git** 선택
4. GitHub 저장소 선택
5. 빌드 설정:
   - **Framework preset**: None
   - **Build command**: (비워두기)
   - **Build output directory**: `/`
6. **Save and Deploy** 클릭

### 방법 2: 직접 업로드

1. [Cloudflare Dashboard](https://dash.cloudflare.com/)에 로그인
2. **Workers & Pages** → **Create application** → **Pages** → **Upload assets** 선택
3. 프로젝트 이름 입력
4. `index.html`, `style.css`, `app.js` 파일을 업로드
5. **Deploy site** 클릭

## 📁 파일 구조

```
caffeine-half-life-calc/
├── index.html      # 메인 HTML 파일
├── style.css       # 스타일시트 (모바일 반응형)
├── app.js          # 카페인 계산 로직
└── README.md       # 이 파일
```

## 🧮 카페인 반감기 계산 원리

카페인의 체내 잔량은 다음 공식으로 계산됩니다:

```
C(t) = C₀ × (1/2)^(t/t_half)
```

- `C(t)`: t 시간 후 카페인 양
- `C₀`: 초기 카페인 양
- `t`: 경과 시간
- `t_half`: 반감기 (평균 5시간)

## 📱 음료별 카페인 함량 참고

| 음료 | 카페인 함량 (평균) |
|------|-------------------|
| 에스프레소 (1샷) | 63mg |
| 아메리카노 | 150mg |
| 카페라떼 | 150mg |
| 카푸치노 | 75mg |
| 녹차 | 28mg |
| 홍차 | 47mg |
| 에너지 드링크 | 80mg |
| 콜라 (355ml) | 34mg |

## 💡 사용 팁

- **반감기 조정**: 개인차가 있으므로 3-7시간 사이에서 조정 가능
- **수면 관리**: 잠들기 6시간 전에는 카페인 섭취를 피하는 것이 좋습니다
- **1일 권장량**: 성인 기준 400mg 이하

## 🛠️ 기술 스택

- HTML5
- CSS3 (Grid, Flexbox, 애니메이션)
- Vanilla JavaScript (ES6+)
- Chart.js 4.4.0 (그래프 시각화)

## 📄 라이선스

MIT License

## 🤝 기여하기

이슈 및 풀 리퀘스트는 언제나 환영합니다!

---

Made with ☕ and ❤️
