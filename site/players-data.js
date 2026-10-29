const playerSheetConfig = {
  csvUrl: 'https://docs.google.com/spreadsheets/d/1syPFQtNAiAhrj5BZBt0Z0mCWGiaVAxhYCTTEvh2gVBo/export?format=csv&gid=56643669',
  cachedCsvUrl: '/.netlify/functions/player-sheet',
  cacheKey: 'yscs-player-stats-v2',
  refreshWeekday: 5,
  refreshHour: 9
};

const playerDirectory = [
  { id: '01', name: '티엘', image: 'assets/players/player-01.png' },
  { id: '02', name: '타치바나 셰리', image: 'assets/players/player-02.png' },
  { id: '03', name: '『3대 킹』', image: 'assets/players/player-03.png' },
  { id: '04', name: '어스머신고수', image: 'assets/players/player-04.png' },
  { id: '05', name: '강민성', image: 'assets/players/player-05.png' },
  { id: '06', name: '앨리스는 어디있지?', image: 'assets/players/player-06.png' },
  { id: '07', name: '몽', image: 'assets/players/player-07.png' }
];

const fallbackPlayerData = [
  { name:'티엘', games:26, wins:19, losses:7, rate:'73.1%', favoriteDeck:'아르토 감옥신', championships:[1,2,6], opponents:{'타치바나 셰리':[5,2],'『3대 킹』':[2,1],'어스머신고수':[5,2],'강민성':[3,0],'앨리스는 어디있지?':[2,2],'몽':[2,0]} },
  { name:'타치바나 셰리', games:26, wins:13, losses:13, rate:'50.0%', favoriteDeck:'하얀숲', championships:[4,5], opponents:{'티엘':[2,5],'『3대 킹』':[2,5],'어스머신고수':[2,3],'강민성':[4,0],'앨리스는 어디있지?':[3,0],'몽':[0,0]} },
  { name:'『3대 킹』', games:20, wins:11, losses:9, rate:'55.0%', favoriteDeck:'빛둠축 레드 데몬', championships:[3], opponents:{'티엘':[1,2],'타치바나 셰리':[5,2],'어스머신고수':[2,3],'강민성':[3,0],'앨리스는 어디있지?':[0,1],'몽':[0,0]} },
  { name:'어스머신고수', games:23, wins:12, losses:11, rate:'52.2%', favoriteDeck:'클래식 땅기계', championships:[], opponents:{'티엘':[2,5],'타치바나 셰리':[3,2],'『3대 킹』':[3,2],'강민성':[3,1],'앨리스는 어디있지?':[1,1],'몽':[0,0]} },
  { name:'강민성', games:16, wins:2, losses:14, rate:'12.5%', favoriteDeck:'백룡', championships:[], opponents:{'티엘':[0,3],'타치바나 셰리':[0,4],'『3대 킹』':[0,3],'어스머신고수':[1,3],'앨리스는 어디있지?':[1,1],'몽':[0,0]} },
  { name:'앨리스는 어디있지?', games:14, wins:5, losses:9, rate:'35.7%', favoriteDeck:'맬리스', championships:[], opponents:{'티엘':[2,2],'타치바나 셰리':[0,3],'『3대 킹』':[1,0],'어스머신고수':[1,1],'강민성':[1,1],'몽':[0,2]} },
  { name:'몽', games:5, wins:2, losses:3, rate:'40.0%', favoriteDeck:'빛둠', championships:[], opponents:{'티엘':[0,2],'타치바나 셰리':[0,0],'『3대 킹』':[0,0],'어스머신고수':[0,0],'강민성':[0,0],'앨리스는 어디있지?':[2,0]} }
];
