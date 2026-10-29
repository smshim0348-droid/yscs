const sections = {
  championship: {
    letter: 'Y', index: '01 / TOURNAMENT', korean: '용산 챔피언십', title: 'Yongsan Championship',
    description: '일곱 명의 유희왕 OCG 플레이어가 모여, 우승을 향해 펼치는 우리만의 대회.',
    content: `<dl class="overview"><div><dt>참여 플레이어</dt><dd>7 <small>PLAYERS</small></dd></div><div><dt>플레이 종목</dt><dd>유희왕 OCG</dd></div><div><dt>운영 방식</dt><dd>정기 자체 대회</dd></div></dl><section class="placeholder"><span class="placeholder-tag">ABOUT THE CHAMPIONSHIP</span><h3>용산에서 이어지는 우리의 듀얼</h3><p>YSCS, 일명 ‘용씨’는 국내 유희왕 OCG 한국 공인 대회의 포맷을 따라 진행하는 비공식 자체 대회입니다. 모든 플레이어는 하나의 목표, 우승을 향해 플레이합니다.</p><div class="placeholder-empty">대회 안내와 진행 내용을 담을 공간입니다.<br>세부 내용은 추후 추가됩니다.</div></section>`
  },
  status: {
    letter: 'S', index: '02 / STATUS', korean: '플레이어 & 현황', title: 'Status Page',
    description: '같은 테이블에서 만나는 일곱 플레이어. 이곳에서 각자의 이야기를 이어갑니다.',
    content: `<div class="player-slots" aria-label="등록 예정인 플레이어 7명">${Array.from({length: 7}, (_, i) => `<div class="player-slot"><strong>0${i + 1}</strong><span>PLAYER</span></div>`).join('')}</div><section class="placeholder"><span class="placeholder-tag">PLAYER STATUS</span><h3>일곱 명의 플레이어, 일곱 개의 이야기</h3><p>플레이어 소개와 대회 현황을 담을 공간입니다. 표시할 정보와 구성은 다음 제작 단계에서 정해집니다.</p><div class="placeholder-empty">아직 등록된 플레이어 정보가 없습니다.</div></section>`
  },
  history: {
    letter: 'C', index: '03 / HALL OF FAME', korean: '챔피언의 기록', title: 'Champion’s History',
    description: '치열했던 듀얼의 끝, 우승의 순간을 기록합니다.',
    content: `<section class="placeholder"><span class="placeholder-tag">THE CHAMPIONS ARCHIVE</span><h3>그날의 챔피언을 기억하는 방법</h3><p>역대 대회의 우승자와 우승 기록을 보관할 공간입니다. 실제 대회 기록을 바탕으로 하나씩 채워집니다.</p><div class="placeholder-empty">아직 등록된 우승 기록이 없습니다.</div></section>`
  },
  season: {
    letter: 'S', index: '04 / SCHEDULE', korean: '시즌 일정', title: 'Season Schedule',
    description: '다음 만남, 다음 대회. 우리의 다음 듀얼을 준비합니다.',
    content: `<section class="placeholder"><span class="placeholder-tag">NEXT UP</span><h3>다음 이야기가 시작될 시간</h3><p>시즌별 대회 일정을 확인할 공간입니다. 일정이 정해지면 이곳에 기록됩니다.</p><div class="placeholder-empty">아직 등록된 시즌 일정이 없습니다.</div></section>`
  }
};

const dialog = document.querySelector('#section-dialog');
let trigger = null;
function openSection(key, button) {
  const section = sections[key];
  if (!section) return;
  trigger = button;
  document.querySelector('#dialog-eyebrow').textContent = section.index;
  document.querySelector('#dialog-letter').textContent = section.letter;
  document.querySelector('#dialog-korean').textContent = section.korean;
  document.querySelector('#dialog-title').textContent = section.title;
  document.querySelector('#dialog-description').textContent = section.description;
  document.querySelector('#dialog-content').innerHTML = section.content;
  dialog.showModal();
  document.body.classList.add('modal-open');
  document.querySelector('.dialog-scroll').scrollTop = 0;
  document.querySelector('.close-dialog').focus();
}
function closeSection() { dialog.close(); }
document.querySelectorAll('[data-section]').forEach(button => {
  button.addEventListener('click', () => openSection(button.dataset.section, button));
});
document.querySelector('.close-dialog').addEventListener('click', closeSection);
document.querySelector('.back-button').addEventListener('click', closeSection);
// Close only if both pointer press and release occurred on the backdrop.
let backdropPress = false;
function isBackdrop(event) {
  const rect = dialog.getBoundingClientRect();
  return event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
}
dialog.addEventListener('pointerdown', event => { backdropPress = isBackdrop(event); });
dialog.addEventListener('click', event => {
  if (backdropPress && isBackdrop(event)) closeSection();
  backdropPress = false;
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  trigger?.focus();
});

const intro = document.querySelector('#intro');
const shell = document.querySelector('.shell');
const skip = document.querySelector('#skip-intro');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let introTimer;
let replayed = false;
function finishIntro() {
  clearTimeout(introTimer);
  intro.classList.add('is-finished');
  intro.setAttribute('aria-hidden', 'true');
  skip.tabIndex = -1;
  shell.inert = false;
  if (replayed || document.activeElement === skip) document.querySelector('#replay-intro').focus();
}
function playIntro() {
  clearTimeout(introTimer);
  if (reducedMotion.matches) return finishIntro();
  shell.inert = true;
  intro.classList.remove('is-finished');
  intro.setAttribute('aria-hidden', 'false');
  skip.tabIndex = 0;
  intro.querySelectorAll('.intro-word span, .intro-line').forEach(element => {
    element.style.animation = 'none';
    void element.offsetWidth;
    element.style.animation = '';
  });
  if (replayed) skip.focus();
  introTimer = setTimeout(finishIntro, 1900);
}
skip.addEventListener('click', finishIntro);
document.querySelector('#replay-intro').addEventListener('click', () => { replayed = true; playIntro(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !intro.classList.contains('is-finished')) finishIntro(); });
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finishIntro(); });
playIntro();
