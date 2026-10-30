const escapeHtml = value => String(value).replace(/[&<>"]/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[character]));
const localSimulation = ['localhost', '127.0.0.1'].includes(location.hostname) ? new URLSearchParams(location.search).get('simulate') : '';
const seasonDeadline = season => new Date(new Date(season.dateTime).getTime() + 24 * 60 * 60 * 1000);
const isSeasonExpired = (season, now = new Date()) => localSimulation === 'season-expired' || now >= seasonDeadline(season);
const statsForIdentity = (identity, players = activePlayerData) => players.find(player => player.id === identity.id) || players[Number(identity.id) - 1] || fallbackPlayerData[Number(identity.id) - 1];
const displayNameForIdentity = (identity, players = activePlayerData) => statsForIdentity(identity, players)?.name || identity.fallbackName;
const rankingTemplate = (players = activePlayerData) => {
  const standings = playerDirectory.map(identity => ({ identity, titles:statsForIdentity(identity, players)?.championships || [] }))
    .sort((a, b) => b.titles.length - a.titles.length || Number(a.identity.id) - Number(b.identity.id));
  standings.forEach((item, index) => { item.rank = index && item.titles.length === standings[index - 1].titles.length ? standings[index - 1].rank : index + 1; });
  return `<section class="ranking-strip" aria-label="YSCS 전체 플레이어 순위"><div class="ranking-heading"><span>YSCS CHAMPION RANKING</span><strong>우승 횟수 기준</strong></div><ol>${standings.map(item => `<li><b>${String(item.rank).padStart(2, '0')}</b><span><strong>${escapeHtml(displayNameForIdentity(item.identity, players))}</strong><small>PLAYER ${item.identity.id}</small></span><em>${item.titles.length}<small>WINS</small></em></li>`).join('')}</ol></section>`;
};
const archiveGridTemplate = () => `<section class="champion-archive" aria-label="역대 용산 CS 챔피언">
  <div class="archive-intro"><div><span>THE CHAMPIONS ARCHIVE</span><p>왼쪽에서 오른쪽으로 이어지는 우승의 기록.</p></div><div class="rail-controls" aria-label="챔피언 아카이브 이동"><button type="button" data-rail="archive" data-direction="-1" aria-label="이전 챔피언">←</button><button type="button" data-rail="archive" data-direction="1" aria-label="다음 챔피언">→</button></div></div>
  <div class="archive-viewport" data-rail-target="archive"><div class="archive-grid">${championshipArchive.map(record => `<button class="archive-card" type="button" data-archive-id="${record.id}" aria-haspopup="dialog" aria-controls="archive-dialog">
    <span class="archive-card-image"><img class="archive-image-default" src="${record.thumbnail}" alt="${escapeHtml(record.edition)} 대회 포스터" loading="lazy"><img class="archive-image-hover" src="${record.hoverImage}" alt="" loading="lazy"><span>${record.id}</span></span>
    <span class="archive-card-copy"><small>${escapeHtml(record.edition)}</small><strong>${escapeHtml(record.title)}</strong><i>기록 열기 <b aria-hidden="true">↗</b></i></span>
  </button>`).join('')}</div></div>
  <section class="venue-archive" aria-label="역대 용산 CS 개최 장소"><div class="venue-heading"><div><span>THE PLACES WE PLAYED</span><p>용산 CS의 기록이 만들어진 장소들.</p></div><div class="rail-controls" aria-label="개최 장소 이동"><button type="button" data-rail="venue" data-direction="-1" aria-label="이전 장소">←</button><button type="button" data-rail="venue" data-direction="1" aria-label="다음 장소">→</button></div></div><div class="venue-viewport" data-rail-target="venue"><div class="venue-grid">${venueArchive.map(venue => `<button class="venue-card${venue.available ? '' : ' is-unavailable'}" type="button" data-venue-id="${venue.id}" ${venue.available ? 'aria-haspopup="dialog" aria-controls="venue-dialog"' : 'disabled'}><span>${venue.id}</span><div><small>${escapeHtml(venue.edition)} / VENUE</small><strong>${escapeHtml(venue.name)}</strong><em>${venue.available ? escapeHtml(venue.address) : escapeHtml(venue.status)}</em></div><b aria-hidden="true">${venue.available ? '↗' : '—'}</b></button>`).join('')}</div></div></section>
</section>`;
const seasonParticipantsTemplate = () => `<section class="season-entrants" aria-label="참가 플레이어"><div class="season-entrants-heading"><span>CONFIRMED PLAYERS</span><a href="${upcomingSeason.tonamel.competitionUrl}" target="_blank" rel="noreferrer">TONAMEL 엔트리 확인 <b aria-hidden="true">↗</b></a></div><div class="season-entrant-grid">${upcomingSeason.tonamel.participants.map(participant => {
  const identity = playerDirectory.find(player => player.id === participant.playerId);
  return `<article class="season-entrant"><span>${participant.playerId}</span><div><strong>${escapeHtml(identity ? displayNameForIdentity(identity) : participant.accountName)}</strong><small>${escapeHtml(participant.entryName)}</small></div></article>`;
}).join('')}</div><p class="season-source">ACCOUNT MATCH / ${escapeHtml(upcomingSeason.tonamel.status)} · 조직 ${escapeHtml(upcomingSeason.tonamel.organizationId)} · ${new Date(upcomingSeason.tonamel.lastCheckedAt).toLocaleDateString('ko-KR')} 확인</p></section>`;
const seasonReadyTemplate = () => `<section class="season-ready" aria-label="다음 대회 준비 중"><span>BETWEEN SEASONS / NOTICE</span><i aria-hidden="true">✳</i><h3>다음 대회를 위한<br>준비 중입니다.</h3><p>${escapeHtml(upcomingSeason.title)} 일정은 개최 시각으로부터 24시간이 지나 보관 처리되었습니다.<br>새 대회가 모집을 시작하면 이 곳에 다시 안내합니다.</p><a href="${upcomingSeason.tonamel.organizationUrl}" target="_blank" rel="noreferrer">용산고등학교향우회 토나멜 <b aria-hidden="true">↗</b></a></section>`;
const seasonScheduleTemplate = () => isSeasonExpired(upcomingSeason) ? seasonReadyTemplate() : `<section class="season-feature" aria-label="${escapeHtml(upcomingSeason.title)} 일정">
  <figure class="season-poster"><img src="${upcomingSeason.image}" alt="${escapeHtml(upcomingSeason.title)} 안내 이미지"></figure>
  <div class="season-summary">
    <div class="season-title"><span>${upcomingSeason.edition} / NEXT TOURNAMENT</span><h3>${escapeHtml(upcomingSeason.title)} <i>—</i> ${escapeHtml(upcomingSeason.venue)}</h3></div>
    <dl class="season-details">
      <div><dt>개최 일시</dt><dd><time datetime="${upcomingSeason.dateTime}">${escapeHtml(upcomingSeason.date)}</time></dd></div>
      <div><dt>토너먼트 형식</dt><dd>${escapeHtml(upcomingSeason.format)}</dd></div>
      <div><dt>참가 인원</dt><dd>${upcomingSeason.participantCount}인 <small>TONAMEL CONFIRMED ENTRY</small></dd></div>
    </dl>
    ${seasonParticipantsTemplate()}
  </div>
</section>`;
let activePlayerData = fallbackPlayerData;
function renderRanking(players = activePlayerData) {
  const slot = document.querySelector('#ranking-slot');
  if (slot) slot.innerHTML = rankingTemplate(players);
}
const playerGridTemplate = players => `<section class="player-directory" aria-label="YSCS 플레이어 7명">
  <div class="player-directory-meta"><span>07 REGISTERED PLAYERS</span><p id="player-sync-state">서버 캐시 · 매주 금요일 09:00 자동 갱신</p></div>
  <div class="player-grid">${playerDirectory.map(identity => {
    const stats = statsForIdentity(identity, players);
    return `<button class="player-card" type="button" data-player-id="${identity.id}" aria-haspopup="dialog" aria-controls="player-dialog">
      <span class="player-card-number">${identity.id}</span><span class="player-card-art"><img src="${identity.image}" alt="" loading="lazy"></span>
      <span class="player-card-copy"><small>PLAYER ${identity.id}</small><strong>${escapeHtml(stats.name || identity.fallbackName)}</strong>${stats.championships?.length ? `<span class="player-card-titles">${stats.championships.map(edition => `<b title="제${edition}회 용산 CS 우승"><i>★</i> 제${edition}회</b>`).join('')}</span>` : ''}<span>${stats.wins}W — ${stats.losses}L <i>${escapeHtml(stats.rate)}</i></span><em>${escapeHtml(stats.favoriteDeck)}</em></span>
    </button>`;
  }).join('')}</div>
</section>`;

function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { cell += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else cell += character;
    } else if (character === '"') quoted = true;
    else if (character === ',') { row.push(cell.trim()); cell = ''; }
    else if (character === '\n') { row.push(cell.trim()); rows.push(row); row = []; cell = ''; }
    else if (character !== '\r') cell += character;
  }
  if (cell || row.length) { row.push(cell.trim()); rows.push(row); }
  return rows;
}
function buildPlayerData(csvText) {
  const rows = parseCsv(csvText);
  const statHeader = rows.findIndex(row => row[0] === '이름' && row[1] === '총 경기수');
  const matrixHeader = rows.findIndex(row => row[0] === '승\\패');
  const matchHeader = rows.findIndex(row => row[0] === '대회명' && row[2] === '승자');
  if (statHeader < 0 || matrixHeader < 0 || matchHeader < 0) throw new Error('시트 구조를 확인할 수 없습니다.');
  const statRows = rows.slice(statHeader + 1, matrixHeader).filter(row => row[0]).slice(0, playerDirectory.length);
  if (statRows.length !== playerDirectory.length) throw new Error(`플레이어 통합 기록이 ${statRows.length}개입니다.`);
  const sheetPlayers = playerDirectory.map(identity => ({ id:identity.id, name:statRows[identity.sheetIndex][0], row:statRows[identity.sheetIndex] }));
  const playerIdByName = new Map(sheetPlayers.map(player => [player.name, player.id]));
  const matrixNames = rows[matrixHeader].slice(1, 8);
  const matrix = new Map(rows.slice(matrixHeader + 1, matrixHeader + 8).map(row => [row[0], row.slice(1, 8).map(value => Number(value) || 0)]));
  const deckCounts = new Map(playerDirectory.map(player => [player.id, new Map()]));
  const championships = new Map(playerDirectory.map(player => [player.id, []]));
  rows.slice(matchHeader + 1).forEach(row => {
    [[row[2], row[3]], [row[4], row[5]]].forEach(([name, deck]) => {
      const playerId = playerIdByName.get(name);
      if (!playerId || !deck || deck === '-') return;
      const counts = deckCounts.get(playerId); counts.set(deck, (counts.get(deck) || 0) + 1);
    });
    const winnerId = playerIdByName.get(row[2]);
    if (row[6]?.includes('용산시리즈') && winnerId) {
      const edition = Number(row[0]?.match(/제\s*(\d+)회/)?.[1]);
      if (edition && !championships.get(winnerId).includes(edition)) championships.get(winnerId).push(edition);
    }
  });
  return playerDirectory.map((identity, index) => {
    const sheetPlayer = sheetPlayers[index];
    const row = sheetPlayer.row;
    const stats = { games:Number(row[1]), wins:Number(row[2]), losses:Number(row[3]), rate:row[4] };
    const decks = [...deckCounts.get(identity.id).entries()].sort((a, b) => b[1] - a[1]);
    const opponents = {};
    matrixNames.filter(name => name !== sheetPlayer.name).forEach(name => {
      const opponentColumn = matrixNames.indexOf(name);
      const playerColumn = matrixNames.indexOf(sheetPlayer.name);
      opponents[name] = [matrix.get(sheetPlayer.name)?.[opponentColumn] || 0, matrix.get(name)?.[playerColumn] || 0];
    });
    return { id:identity.id, name:sheetPlayer.name, ...stats, favoriteDeck:decks[0]?.[0] || '기록 없음', championships:championships.get(identity.id).sort((a, b) => a - b), opponents };
  });
}
function latestRefreshBoundary(now = new Date()) {
  const boundary = new Date(now); const daysSinceFriday = (now.getDay() - playerSheetConfig.refreshWeekday + 7) % 7;
  boundary.setDate(now.getDate() - daysSinceFriday); boundary.setHours(playerSheetConfig.refreshHour, 0, 0, 0);
  if (boundary > now) boundary.setDate(boundary.getDate() - 7);
  return boundary;
}
async function hydratePlayerStatus() {
  const content = document.querySelector('#dialog-content');
  let cached;
  try { cached = JSON.parse(localStorage.getItem(playerSheetConfig.cacheKey)); } catch { cached = null; }
  if (cached?.players) activePlayerData = cached.players;
  renderRanking(activePlayerData);
  content.innerHTML = playerGridTemplate(activePlayerData);
  const state = content.querySelector('#player-sync-state');
  if (cached?.fetchedAt && new Date(cached.fetchedAt) >= latestRefreshBoundary()) {
    state.textContent = `최근 갱신 ${new Date(cached.fetchedAt).toLocaleDateString('ko-KR')} · 매주 금요일 09:00`;
    return;
  }
  state.textContent = '스프레드시트 기록을 갱신하는 중…';
  try {
    let response = await fetch(playerSheetConfig.cachedCsvUrl, { cache:'no-store' });
    if (!response.ok) response = await fetch(playerSheetConfig.csvUrl, { cache:'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    activePlayerData = buildPlayerData(await response.text());
    renderRanking(activePlayerData);
    const fetchedAt = new Date().toISOString();
    localStorage.setItem(playerSheetConfig.cacheKey, JSON.stringify({ fetchedAt, players:activePlayerData }));
    if (dialog.open) { content.innerHTML = playerGridTemplate(activePlayerData); content.querySelector('#player-sync-state').textContent = `최근 갱신 ${new Date(fetchedAt).toLocaleDateString('ko-KR')} · 매주 금요일 09:00`; }
  } catch (error) {
    state.textContent = '오프라인 저장 기록 표시 중 · 다음 접속 시 다시 갱신';
    console.warn('YSCS player sheet sync failed:', error);
  }
}
async function hydrateRankingFromSheet() {
  let cached;
  try { cached = JSON.parse(localStorage.getItem(playerSheetConfig.cacheKey)); } catch { cached = null; }
  if (cached?.players) {
    activePlayerData = cached.players;
    renderRanking(activePlayerData);
  }
  if (cached?.fetchedAt && new Date(cached.fetchedAt) >= latestRefreshBoundary()) return;
  try {
    let response = await fetch(playerSheetConfig.cachedCsvUrl, { cache:'no-store' });
    if (!response.ok) response = await fetch(playerSheetConfig.csvUrl, { cache:'no-store' });
    if (!response.ok) return;
    activePlayerData = buildPlayerData(await response.text());
    const fetchedAt = new Date().toISOString();
    localStorage.setItem(playerSheetConfig.cacheKey, JSON.stringify({ fetchedAt, players:activePlayerData }));
    renderRanking(activePlayerData);
  } catch (error) {
    console.warn('YSCS ranking sync failed:', error);
  }
}

const sections = {
  championship: {
    letter: 'Y', index: '01 / TOURNAMENT', korean: '용산 챔피언십', title: 'Yongsan Championship',
    description: '일곱 명의 유희왕 OCG 플레이어가 모여, 우승을 향해 펼치는 우리만의 대회.',
    content: `<section class="championship-story" aria-label="용산 챔피언십 소개">
      <p class="typing-paragraph" data-type-text="사는 곳도, 자라온 환경도, 지내온 시간도 모두 다른 7명의 사람들이, 유희왕이라는 하나의 공통된 취미 하나로 모여온 대회입니다."><span class="typing-text" aria-hidden="true"></span><span class="typing-cursor" aria-hidden="true"></span></p>
      <p class="typing-paragraph" data-type-text="YSCS, 용산 CS, 용씨. 부르는 명칭은 다 다르지만, 자신이 애정하는 덱을 가지고 우승이라는 하나의 목표를 지향하며 지금도 끊임없이 플레이하고 있습니다."><span class="typing-text" aria-hidden="true"></span><span class="typing-cursor" aria-hidden="true"></span></p>
      <p class="typing-paragraph typing-paragraph-final" data-type-text="모든 플레이어는 자신의 『운, 노력, 그리고 재능』을 시험합니다. 모든 경쟁과 어려움을 극복해낸 단 한 명의 플레이어만이 우승이라는 영광을 거머쥡니다."><span class="typing-text" aria-hidden="true"></span><span class="typing-cursor" aria-hidden="true"></span></p>
      <div class="virtue-grid" aria-label="운, 노력, 재능">
        <div class="virtue virtue-luck" tabindex="0" aria-describedby="virtue-luck-detail">
          <span class="virtue-icon" aria-hidden="true">⚄</span><strong>운</strong><small>LUCK</small>
          <div class="virtue-detail" id="virtue-luck-detail" role="tooltip"><span>01 / LUCK</span><p>자신이 설계한 덱 빌딩을 토대로, 선공에서의 공격권과 후공에서의 유발 및 방해권, 그 선후공을 정하는 하이 다이스 롤, 상대방의 매칭까지를 전부 시험합니다.</p></div>
        </div>
        <div class="virtue virtue-effort" tabindex="0" aria-describedby="virtue-effort-detail">
          <span class="virtue-icon" aria-hidden="true">↟</span><strong>노력</strong><small>EFFORT</small>
          <div class="virtue-detail" id="virtue-effort-detail" role="tooltip"><span>02 / EFFORT</span><p>현재 메타를 공부하고 이해하며, 자신의 덱의 콤보와 전개, 포텐셜을 끌어올릴 수 있는 모든 숙련도를 시험합니다.</p></div>
        </div>
        <div class="virtue virtue-talent" tabindex="0" aria-describedby="virtue-talent-detail">
          <span class="virtue-icon" aria-hidden="true">✦</span><strong>재능</strong><small>TALENT</small>
          <div class="virtue-detail" id="virtue-talent-detail" role="tooltip"><span>03 / TALENT</span><p>랜덤한 첫 패를 가지고 어떤 무브를 가져갈 지, 찰나의 순간 내릴 수 있는 판단력을 시험합니다.</p></div>
        </div>
      </div>
    </section>`
  },
  status: {
    letter: 'S', index: '02 / STATUS', korean: '플레이어 & 현황', title: 'Status Page',
    description: '같은 테이블에서 만나는 일곱 플레이어. 이곳에서 각자의 이야기를 이어갑니다.',
    content: playerGridTemplate(fallbackPlayerData)
  },
  history: {
    letter: 'C', index: '03 / HALL OF FAME', korean: '챔피언의 기록', title: 'Champion’s History',
    description: '치열했던 듀얼의 끝, 우승의 순간을 기록합니다.',
    content: archiveGridTemplate()
  },
  season: {
    letter: 'S', index: '04 / SCHEDULE', korean: '시즌 일정', title: 'Season Schedule',
    description: '다음 만남, 다음 대회. 우리의 다음 듀얼을 준비합니다.',
    content: seasonScheduleTemplate()
  }
};

const dialog = document.querySelector('#section-dialog');
const archiveDialog = document.querySelector('#archive-dialog');
const venueDialog = document.querySelector('#venue-dialog');
const playerDialog = document.querySelector('#player-dialog');
let trigger = null;
let archiveTrigger = null;
let venueTrigger = null;
let playerTrigger = null;
let storyRun = 0;
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
async function playChampionshipStory() {
  const currentRun = ++storyRun;
  const paragraphs = [...document.querySelectorAll('.typing-paragraph')];
  const virtueGrid = document.querySelector('.virtue-grid');
  paragraphs.forEach(paragraph => paragraph.setAttribute('aria-label', paragraph.dataset.typeText));
  const showCompletedStory = () => {
    paragraphs.forEach(paragraph => {
      paragraph.querySelector('.typing-text').textContent = paragraph.dataset.typeText;
      paragraph.classList.add('is-complete');
    });
    paragraphs.at(-1).querySelector('.typing-text').innerHTML = '모든 플레이어는 자신의 『<em>운</em>, <em>노력</em>, 그리고 <em>재능</em>』을 시험합니다. 모든 경쟁과 어려움을 극복해낸 단 한 명의 플레이어만이 우승이라는 영광을 거머쥡니다.';
    virtueGrid.classList.add('is-visible');
  };
  if (reducedMotion.matches) {
    showCompletedStory();
    return;
  }
  for (const paragraph of paragraphs) {
    if (currentRun !== storyRun || !dialog.open) return;
    paragraph.classList.add('is-typing');
    const output = paragraph.querySelector('.typing-text');
    for (const character of paragraph.dataset.typeText) {
      if (currentRun !== storyRun || !dialog.open) return;
      output.textContent += character;
      await wait(character === '.' ? 180 : character === ',' ? 85 : 24);
    }
    paragraph.classList.remove('is-typing');
    paragraph.classList.add('is-complete');
    await wait(280);
  }
  if (currentRun !== storyRun || !dialog.open) return;
  paragraphs.at(-1).querySelector('.typing-text').innerHTML = '모든 플레이어는 자신의 『<em>운</em>, <em>노력</em>, 그리고 <em>재능</em>』을 시험합니다. 모든 경쟁과 어려움을 극복해낸 단 한 명의 플레이어만이 우승이라는 영광을 거머쥡니다.';
  virtueGrid.classList.add('is-visible');
}
function openSection(key, button) {
  const section = sections[key];
  if (!section) return;
  if (key === 'season') section.content = seasonScheduleTemplate();
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
  if (key === 'championship') playChampionshipStory();
  if (key === 'status') hydratePlayerStatus();
}
renderRanking();
hydrateRankingFromSheet();
function closeSection() { dialog.close(); }
function openArchive(id, button) {
  const record = championshipArchive.find(item => item.id === id);
  if (!record) return;
  archiveTrigger = button;
  document.querySelector('#archive-index').textContent = `${record.id} / CHAMPION ARTICLE`;
  document.querySelector('#archive-edition').textContent = record.edition;
  document.querySelector('#archive-title').textContent = record.title;
  const poster = document.querySelector('#archive-poster');
  poster.src = record.poster;
  poster.alt = `${record.edition} 대회 포스터`;
  document.querySelector('#archive-article').innerHTML = record.article.map((paragraph, index) => `<p${index === 0 ? ' class="article-byline"' : ''}>${escapeHtml(paragraph).replace(/\*([^*]+)\*/g, '<em>$1</em>').replaceAll('\n', '<br>')}</p>`).join('');
  archiveDialog.showModal();
  archiveDialog.querySelector('.archive-scroll').scrollTop = 0;
  archiveDialog.querySelector('.close-archive').focus();
}
function openVenue(id, button) {
  const venue = venueArchive.find(item => item.id === id && item.available);
  if (!venue) return;
  venueTrigger = button;
  const mapQuery = encodeURIComponent(venue.query);
  document.querySelector('#venue-index').textContent = `${venue.id} / TOURNAMENT VENUE`;
  document.querySelector('#venue-edition').textContent = `${venue.edition} 용산 CS`;
  document.querySelector('#venue-title').textContent = venue.name;
  document.querySelector('#venue-address').textContent = venue.address;
  document.querySelector('#venue-map').src = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
  document.querySelector('#venue-map-link').href = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  venueDialog.showModal();
  venueDialog.querySelector('.close-venue').focus();
}
function moveRail(name, direction) {
  const viewport = document.querySelector(`[data-rail-target="${name}"]`);
  if (!viewport) return;
  const card = viewport.querySelector(name === 'archive' ? '.archive-card' : '.venue-card');
  viewport.scrollBy({ left:direction * ((card?.getBoundingClientRect().width || 280) + 14), behavior:'smooth' });
}
function openPlayer(id, button) {
  const identity = playerDirectory.find(player => player.id === id);
  const stats = activePlayerData.find(player => player.id === identity?.id) || activePlayerData[Number(id) - 1];
  if (!identity || !stats) return;
  playerTrigger = button;
  document.querySelector('#player-index').textContent = `${identity.id} / PLAYER PROFILE`;
  document.querySelector('#player-label').textContent = `YSCS REGISTERED PLAYER ${identity.id}`;
  document.querySelector('#player-title').textContent = stats.name || identity.fallbackName;
  const titles = stats.championships || [];
  document.querySelector('#player-championships').innerHTML = titles.length
    ? `<span class="championship-label">YONGSAN SERIES CHAMPION <b>${titles.length}×</b></span><div class="championship-medals">${titles.map(edition => `<span class="championship-medal" title="제${edition}회 용산 CS 우승"><i>★</i><b>제${edition}회</b><small>CHAMPION</small></span>`).join('')}</div>`
    : '<span class="championship-empty">YONGSAN SERIES · CHALLENGER</span>';
  document.querySelector('#player-summary').innerHTML = `<div><small>통합 전적</small><strong>${stats.wins}W — ${stats.losses}L</strong><span>${stats.games} GAMES / ${escapeHtml(stats.rate)}</span></div><div><small>선호 덱</small><strong>${escapeHtml(stats.favoriteDeck)}</strong><span>MOST PLAYED DECK</span></div>`;
  document.querySelector('#player-versus').innerHTML = Object.entries(stats.opponents).map(([name, record]) => `<div><span>${escapeHtml(name)}</span><strong>${record[0]} <i>—</i> ${record[1]}</strong><small>W / L</small></div>`).join('');
  const image = document.querySelector('#player-image'); image.src = identity.image; image.alt = `${stats.name || identity.fallbackName} 대표 라인아트`; image.dataset.playerId = identity.id;
  playerDialog.showModal(); playerDialog.querySelector('.close-player').focus();
}
document.querySelectorAll('[data-section]').forEach(button => {
  button.addEventListener('click', () => openSection(button.dataset.section, button));
});
document.querySelector('#dialog-content').addEventListener('click', event => {
  const railButton = event.target.closest('[data-rail]');
  if (railButton) moveRail(railButton.dataset.rail, Number(railButton.dataset.direction));
  const card = event.target.closest('[data-archive-id]');
  if (card) openArchive(card.dataset.archiveId, card);
  const venue = event.target.closest('[data-venue-id]');
  if (venue && !venue.disabled) openVenue(venue.dataset.venueId, venue);
  const player = event.target.closest('[data-player-id]');
  if (player) openPlayer(player.dataset.playerId, player);
});
document.querySelector('.close-dialog').addEventListener('click', closeSection);
document.querySelector('.back-button').addEventListener('click', closeSection);
document.querySelector('.close-archive').addEventListener('click', () => archiveDialog.close());
document.querySelector('.close-venue').addEventListener('click', () => venueDialog.close());
document.querySelector('.close-player').addEventListener('click', () => playerDialog.close());
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
  storyRun += 1;
  document.body.classList.remove('modal-open');
  trigger?.focus();
});
let archiveBackdropPress = false;
function isArchiveBackdrop(event) {
  const rect = archiveDialog.getBoundingClientRect();
  return event.target === archiveDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
}
archiveDialog.addEventListener('pointerdown', event => { archiveBackdropPress = isArchiveBackdrop(event); });
archiveDialog.addEventListener('click', event => {
  if (archiveBackdropPress && isArchiveBackdrop(event)) archiveDialog.close();
  archiveBackdropPress = false;
});
archiveDialog.addEventListener('close', () => archiveTrigger?.focus());
let venueBackdropPress = false;
function isVenueBackdrop(event) {
  const rect = venueDialog.getBoundingClientRect();
  return event.target === venueDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
}
venueDialog.addEventListener('pointerdown', event => { venueBackdropPress = isVenueBackdrop(event); });
venueDialog.addEventListener('click', event => {
  if (venueBackdropPress && isVenueBackdrop(event)) venueDialog.close();
  venueBackdropPress = false;
});
venueDialog.addEventListener('close', () => {
  document.querySelector('#venue-map').src = '';
  venueTrigger?.focus();
});
let playerBackdropPress = false;
function isPlayerBackdrop(event) {
  const rect = playerDialog.getBoundingClientRect();
  return event.target === playerDialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
}
playerDialog.addEventListener('pointerdown', event => { playerBackdropPress = isPlayerBackdrop(event); });
playerDialog.addEventListener('click', event => {
  if (playerBackdropPress && isPlayerBackdrop(event)) playerDialog.close();
  playerBackdropPress = false;
});
playerDialog.addEventListener('close', () => playerTrigger?.focus());

const intro = document.querySelector('#intro');
const shell = document.querySelector('.shell');
const enterButton = document.querySelector('#enter-site');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let replayed = false;
function finishIntro() {
  intro.classList.add('is-finished');
  intro.setAttribute('aria-hidden', 'true');
  enterButton.tabIndex = -1;
  shell.inert = false;
  document.querySelector('#replay-intro').focus();
}
function playIntro() {
  shell.inert = true;
  intro.classList.remove('is-finished');
  intro.setAttribute('aria-hidden', 'false');
  enterButton.tabIndex = 0;
  enterButton.disabled = true;
  intro.querySelectorAll('.intro-word span, .intro-line').forEach(element => {
    element.style.animation = 'none';
    void element.offsetWidth;
    element.style.animation = '';
  });
  const enableEntry = () => {
    enterButton.disabled = false;
    if (replayed || reducedMotion.matches) enterButton.focus();
  };
  if (reducedMotion.matches) {
    enableEntry();
  } else {
    intro.querySelector('.intro-line').addEventListener('animationend', enableEntry, { once: true });
  }
}
enterButton.addEventListener('click', finishIntro);
document.querySelector('#replay-intro').addEventListener('click', () => { replayed = true; playIntro(); });
reducedMotion.addEventListener('change', () => {
  if (!intro.classList.contains('is-finished') && reducedMotion.matches) {
    enterButton.disabled = false;
    enterButton.focus();
  }
});
playIntro();
if (localSimulation) {
  finishIntro();
  if (localSimulation === 'season' || localSimulation === 'season-expired') {
    setTimeout(() => openSection('season', document.querySelector('[data-section="season"]')), 50);
  }
}
