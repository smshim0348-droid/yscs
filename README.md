# YSCS — The HISTORY of YSCS

용산 CS를 기념하는 단일 화면 웹사이트의 1차 골격입니다.

## 프로젝트 위치

모든 프로젝트 파일과 실행 기준 경로: `E:\00)gpt\YSCS`

## 미리보기

이 폴더에서 `npm run dev`를 실행한 후 http://127.0.0.1:4173 에 접속합니다.
별도의 패키지 설치와 빌드는 필요하지 않습니다. 소스를 저장하고 새로고침하면 반영됩니다.

## 구성

- 인트로 애니메이션 → Y / S / C / S의 2×2 메인 메뉴
- Y: Yongsan Championship — 대회 소개
- S: Status Page — 플레이어 및 현황
- C: Champion’s History — 우승 기록
- S: Season Schedule — 시즌 일정
- 모든 콘텐츠는 URL 변경 없이 고정 모달로 표시됩니다.
- 닫기, 메인으로 돌아가기, Escape, 배경 클릭 지원. 닫으면 원래 메뉴에 키보드 초점이 돌아갑니다.
- 모바일 반응형 및 동작 줄이기 설정 지원

## 수정 위치

- `site/index.html`: 메인 화면 구조
- `site/styles.css`: 디자인, 반응형, 인트로 애니메이션
- `site/app.js`: 네 팝업의 내용과 동작
- `scripts/preview.mjs`: 로컬 미리보기 서버
- `netlify.toml`: 정적 배포 설정 (publish: site)

실제 이름·순위·기록·일정은 제공되기 전까지 빈 상태로 표시합니다.
현재 데이터 저장, 관리자 화면, 외부 대회 정보 자동 동기화는 포함하지 않습니다.
웹폰트는 Google Fonts에서 로드하며 연결되지 않으면 시스템 글꼴로 대체됩니다.

## 확인 / 배포

`npm run check`로 JavaScript 구문을 확인합니다.
GitHub에는 소스를 커밋하고 Netlify에는 `site` 폴더를 배포합니다.
원본 워크플로우 이미지와 로컬 검증 파일은 배포하지 않습니다.

## 현재 공개 배포

- 홈페이지: https://yscs-history.netlify.app/
- GitHub: https://github.com/smshim0348-droid/yscs
- Netlify 프로젝트 ID: c59a0cb3-0aa7-44e2-834d-5aad8f59a233
- 최초 공개 버전: e980418 (2026-10-29)

현재 Netlify Drop으로 `site` 폴더 안의 4개 파일을 직접 배포했습니다.
GitHub 자동 배포는 아직 연결되지 않았습니다. 기존 Netlify GitHub 앱은 raw-sorter 저장소만 접근할 수 있습니다.
자동 연결 시 GitHub의 Netlify 앱에 yscs 저장소를 추가한 뒤 기존 Netlify 프로젝트에서 연결하고, 배포 브랜치 main / 빌드 명령 없음 / 게시 폴더 site로 설정합니다. 새 Netlify 프로젝트를 중복 생성하지 않습니다.

검증: JavaScript 구문 검사, 네 팝업 열기와 Escape 닫기, 메인 복귀와 초점 복원, 390px 모바일 렌더링, 공개 URL에서 시즌 일정 팝업 동작 확인.
