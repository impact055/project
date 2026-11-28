# World Wide Bar

세계 23개국의 대표 술을 인터랙티브 세계지도와 3페이지 팜플렛으로 소개하는 팀 프로젝트입니다.

## 실행 방법

1. 이 폴더 전체를 VS Code로 엽니다.
2. VS Code에서 Live Server 확장 기능을 설치합니다.
3. `index.html`을 열고 **Open with Live Server**를 실행합니다.
4. 지도 데이터와 글꼴을 CDN에서 불러오므로 실행 중 인터넷 연결이 필요합니다.

## 파일 구조

```text
world-wide-bar/
├── index.html
├── README.md
├── css/style.css
├── js/
│   ├── main.js
│   └── data/
│       ├── oceania.js
│       ├── asia.js
│       ├── europe.js
│       ├── africa.js
│       └── americas.js
├── images/
│   ├── oceania/
│   ├── asia/
│   ├── europe/
│   ├── africa/
│   └── americas/
└── research/sources.md
```

## 팀원이 데이터를 추가하는 방법

1. 담당 지역의 `js/data/지역.js` 파일을 엽니다.
2. 파일 맨 아래에 기존 데이터와 같은 형식으로 `window.alcoholData.push({...});`를 추가합니다.
3. `countryCode`는 `main.js`에 등록된 ISO 숫자 3자리 코드를 그대로 사용합니다.
4. 이미지 파일은 `images/담당지역/` 폴더에 넣고 `image` 경로와 파일명을 정확히 맞춥니다.
5. 저장 후 브라우저를 새로고침합니다.

### 데이터 입력 템플릿

```js
window.alcoholData.push({
    countryCode: "036",
    countryName: "호주",
    flag: "🇦🇺",
    drinkName: "럼 (Rum)",
    type: "증류주",
    ingredient: "주요 재료 설명",
    method: "제조 방법 설명",
    history: "역사적 배경 설명",
    culture: "문화적 의미 설명",
    image: "images/oceania/australia-rum.jpg"
});
```

- 필드명은 반드시 `drinkName` 등 템플릿 그대로 사용합니다.
- 모든 문자열은 큰따옴표로 감쌉니다.
- 각 데이터 객체에는 쉼표 누락이나 중복 국가 코드가 없어야 합니다.
- 사진이 아직 없어도 팜플렛은 표시되며, 깨진 이미지 대신 준비 중 안내가 나타납니다.
- 사진은 `object-fit: contain`으로 표시되어 원본 비율이 유지됩니다.

## 지도 동작

- D3.js v7과 TopoJSON Client를 사용합니다.
- 지도 국가 영역은 ISO 숫자 3자리 코드로 상세 데이터와 연결됩니다.
- 마커는 `main.js`의 23개국 카탈로그를 기준으로 생성되므로 상세 설명이 일부 비어 있어도 국가 선택은 가능합니다.
- 지역별 데이터 파일 5개를 모두 로드한 뒤 `main.js`가 실행되도록 `index.html`의 스크립트 순서를 유지해야 합니다.
- 스코틀랜드는 지도상 별도 국가 도형이 없으므로 영국 코드 `826`을 지도 위치에 사용하고, 팜플렛 국가명은 스코틀랜드로 표시합니다.

## 사진 파일명

현재 각 데이터 파일에는 사진 경로가 미리 작성되어 있습니다. 팀원이 준비한 사진을 그 경로와 동일한 이름으로 해당 이미지 폴더에 저장하면 됩니다. 사진이 없으면 해당 영역은 안내 문구로 대체됩니다.

## 주의

피지 토디 설명은 코코넛 수액을 발효한 팜 와인 계열 음료를 다룹니다. Rabi섬 Banaban 공동체의 toddy tapping과 코코넛 수액 시럽인 `kamaimai`를 구분해 서술했습니다. 각 지역의 제조법은 공동체·생산자별로 차이가 있을 수 있습니다.
