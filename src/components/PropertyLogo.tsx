'use client';

import { useState } from 'react';

interface PropertyLogoProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

// NBA teams use ESPN CDN - mapping team names to ESPN abbreviations
const NBA_TEAM_ABBREVS: Record<string, string> = {
  'Atlanta Hawks': 'atl',
  'Boston Celtics': 'bos',
  'Brooklyn Nets': 'bkn',
  'Charlotte Hornets': 'cha',
  'Chicago Bulls': 'chi',
  'Cleveland Cavaliers': 'cle',
  'Dallas Mavericks': 'dal',
  'Denver Nuggets': 'den',
  'Detroit Pistons': 'det',
  'Golden State Warriors': 'gs',
  'Houston Rockets': 'hou',
  'Indiana Pacers': 'ind',
  'Los Angeles Clippers': 'lac',
  'Los Angeles Lakers': 'lal',
  'Memphis Grizzlies': 'mem',
  'Miami Heat': 'mia',
  'Milwaukee Bucks': 'mil',
  'Minnesota Timberwolves': 'min',
  'New Orleans Pelicans': 'no',
  'New York Knicks': 'ny',
  'Oklahoma City Thunder': 'okc',
  'Orlando Magic': 'orl',
  'Philadelphia 76ers': 'phi',
  'Phoenix Suns': 'phx',
  'Portland Trail Blazers': 'por',
  'Sacramento Kings': 'sac',
  'San Antonio Spurs': 'sa',
  'Toronto Raptors': 'tor',
  'Utah Jazz': 'utah',
  'Washington Wizards': 'wsh',
};

// MLB teams use ESPN CDN
const MLB_TEAM_ABBREVS: Record<string, string> = {
  'Arizona Diamondbacks': 'ari',
  'Atlanta Braves': 'atl',
  'Baltimore Orioles': 'bal',
  'Boston Red Sox': 'bos',
  'Chicago Cubs': 'chc',
  'Chicago White Sox': 'chw',
  'Cincinnati Reds': 'cin',
  'Cleveland Guardians': 'cle',
  'Colorado Rockies': 'col',
  'Detroit Tigers': 'det',
  'Houston Astros': 'hou',
  'Kansas City Royals': 'kc',
  'Los Angeles Angels': 'laa',
  'Los Angeles Dodgers': 'lad',
  'Miami Marlins': 'mia',
  'Milwaukee Brewers': 'mil',
  'Minnesota Twins': 'min',
  'New York Mets': 'nym',
  'New York Yankees': 'nyy',
  'Oakland Athletics': 'oak',
  'Philadelphia Phillies': 'phi',
  'Pittsburgh Pirates': 'pit',
  'San Diego Padres': 'sd',
  'San Francisco Giants': 'sf',
  'Seattle Mariners': 'sea',
  'St. Louis Cardinals': 'stl',
  'Tampa Bay Rays': 'tb',
  'Texas Rangers': 'tex',
  'Toronto Blue Jays': 'tor',
  'Washington Nationals': 'wsh',
};

// NHL teams use ESPN CDN
const NHL_TEAM_ABBREVS: Record<string, string> = {
  'Anaheim Ducks': 'ana',
  'Arizona Coyotes': 'ari',
  'Boston Bruins': 'bos',
  'Buffalo Sabres': 'buf',
  'Calgary Flames': 'cgy',
  'Carolina Hurricanes': 'car',
  'Chicago Blackhawks': 'chi',
  'Colorado Avalanche': 'col',
  'Columbus Blue Jackets': 'cbj',
  'Dallas Stars': 'dal',
  'Detroit Red Wings': 'det',
  'Edmonton Oilers': 'edm',
  'Florida Panthers': 'fla',
  'Los Angeles Kings': 'la',
  'Minnesota Wild': 'min',
  'Montreal Canadiens': 'mtl',
  'Nashville Predators': 'nsh',
  'New Jersey Devils': 'nj',
  'New York Islanders': 'nyi',
  'New York Rangers': 'nyr',
  'Ottawa Senators': 'ott',
  'Philadelphia Flyers': 'phi',
  'Pittsburgh Penguins': 'pit',
  'San Jose Sharks': 'sj',
  'Seattle Kraken': 'sea',
  'St. Louis Blues': 'stl',
  'Tampa Bay Lightning': 'tb',
  'Toronto Maple Leafs': 'tor',
  'Vancouver Canucks': 'van',
  'Vegas Golden Knights': 'vgk',
  'Washington Capitals': 'wsh',
  'Winnipeg Jets': 'wpg',
};

// F1 teams use Formula1 CDN
const F1_TEAM_SLUGS: Record<string, string> = {
  'Red Bull Racing': 'red-bull-racing',
  'Red Bull': 'red-bull-racing',
  'Ferrari': 'ferrari',
  'Scuderia Ferrari': 'ferrari',
  'Mercedes': 'mercedes',
  'Mercedes-AMG': 'mercedes',
  'McLaren': 'mclaren',
  'Aston Martin': 'aston-martin',
  'Alpine': 'alpine',
  'Williams': 'williams',
  'Racing Bulls': 'rb',
  'RB': 'rb',
  'AlphaTauri': 'rb',
  'Haas': 'haas',
  'Haas F1 Team': 'haas',
  'Kick Sauber': 'kick-sauber',
  'Sauber': 'kick-sauber',
  'Alfa Romeo': 'kick-sauber',
};

// Mapping of property names to their domains for logo.dev
const PROPERTY_DOMAINS: Record<string, string> = {
  // Leagues
  'NFL': 'nfl.com',
  'NBA': 'nba.com',
  'MLB': 'mlb.com',
  'NHL': 'nhl.com',
  'MLS': 'mlssoccer.com',
  'PGA': 'pgatour.com',
  'NASCAR': 'nascar.com',
  'Formula 1': 'formula1.com',
  'UFC': 'ufc.com',
  'WWE': 'wwe.com',
  'WNBA': 'wnba.com',
  'ATP': 'atptour.com',
  'WTA': 'wtatennis.com',
  'Premier League': 'premierleague.com',
  'La Liga': 'laliga.com',
  'Serie A': 'legaseriea.it',
  'Bundesliga': 'bundesliga.com',
  'Ligue 1': 'ligue1.com',

  // Music Festivals
  'Coachella': 'coachella.com',
  'Lollapalooza': 'lollapalooza.com',
  'Bonnaroo': 'bonnaroo.com',
  'Austin City Limits': 'aclfestival.com',
  'Electric Daisy Carnival': 'electricdaisycarnival.com',
  'EDC': 'electricdaisycarnival.com',
  'EDC (Electric Daisy Carnival)': 'electricdaisycarnival.com',
  'Ultra Music Festival': 'ultramusicfestival.com',
  'Burning Man': 'burningman.org',
  'Glastonbury': 'glastonburyfestivals.co.uk',
  'SXSW': 'sxsw.com',
  'Tomorrowland': 'tomorrowland.com',
  'Rolling Loud': 'rollingloud.com',
  'Governors Ball': 'governorsballmusicfestival.com',
  'Outside Lands': 'sfoutsidelands.com',
  'Stagecoach': 'stagecoachfestival.com',

  // Entertainment
  'Netflix': 'netflix.com',
  'Disney': 'disney.com',
  'HBO': 'hbo.com',
  'Amazon Prime': 'primevideo.com',
  'Hulu': 'hulu.com',
  'Spotify': 'spotify.com',
  'Apple Music': 'apple.com',
  'YouTube': 'youtube.com',
  'TikTok': 'tiktok.com',
  'Twitch': 'twitch.tv',
  'ESPN': 'espn.com',
  'American Music Awards': 'theamas.com',
  'Billboard Music Awards': 'billboard.com',
  'ESPYs': 'espn.com',
  'MTV VMAs': 'mtv.com',
  'SAG Awards': 'sagawards.org',
  'BET Awards': 'bet.com',
  'Emmys': 'emmys.com',
  'Golden Globes': 'goldenglobes.com',
  'iHeartRadio Music Awards': 'iheart.com',
  'Tonys': 'tonyawards.com',

  // Cultural Moments
  'Super Bowl': 'nfl.com',
  'World Cup': 'fifa.com',
  'College Football Playoff': 'collegefootballplayoff.com',
  'FIFA World Cup': 'worldcups.top',
  'Kentucky Derby': 'kentuckyderby.com',
  'Olympics': 'olympics.com',
  'March Madness': 'ncaa.com',
  'NBA Finals': 'nba.com',
  'World Series': 'mlb.com',
  'Stanley Cup': 'nhl.com',
  'Stanley Cup Finals': 'nhl.com',
  'Grammys': 'grammy.com',
  'Oscars': 'oscars.org',
  'Met Gala': 'metmuseum.org',
  'Comic-Con': 'comic-con.org',
  'CES': 'ces.tech',
  'NYFW': 'nyfw.com',
  'Daytona 500': 'daytonainternationalspeedway.com',
  'Indianapolis 500': 'indianapolismotorspeedway.com',
  'MLB All-Star Game': 'mlb.com',
  'MLS Cup': 'mlssoccer.com',
  'NBA All-Star Weekend': 'nba.com',
  'NBA Draft': 'nba.com',
  'NFL Draft': 'nfl.com',
  'The Masters': 'masters.com',
  'US Open (Tennis)': 'usopen.org',
  'Wimbledon': 'wimbledon.com',

  // NFL Teams
  'Arizona Cardinals': 'azcardinals.com',
  'Atlanta Falcons': 'atlantafalcons.com',
  'Baltimore Ravens': 'baltimoreravens.com',
  'Buffalo Bills': 'buffalobills.com',
  'Carolina Panthers': 'panthers.com',
  'Chicago Bears': 'chicagobears.com',
  'Cincinnati Bengals': 'bengals.com',
  'Cleveland Browns': 'clevelandbrowns.com',
  'Dallas Cowboys': 'dallascowboys.com',
  'Denver Broncos': 'denverbroncos.com',
  'Detroit Lions': 'detroitlions.com',
  'Green Bay Packers': 'packers.com',
  'Houston Texans': 'houstontexans.com',
  'Indianapolis Colts': 'colts.com',
  'Jacksonville Jaguars': 'jaguars.com',
  'Kansas City Chiefs': 'chiefs.com',
  'Las Vegas Raiders': 'raiders.com',
  'Los Angeles Chargers': 'chargers.com',
  'Los Angeles Rams': 'therams.com',
  'Miami Dolphins': 'miamidolphins.com',
  'Minnesota Vikings': 'vikings.com',
  'New England Patriots': 'patriots.com',
  'New Orleans Saints': 'neworleanssaints.com',
  'New York Giants': 'giants.com',
  'New York Jets': 'newyorkjets.com',
  'Philadelphia Eagles': 'philadelphiaeagles.com',
  'Pittsburgh Steelers': 'steelers.com',
  'San Francisco 49ers': '49ers.com',
  'Seattle Seahawks': 'seahawks.com',
  'Tampa Bay Buccaneers': 'buccaneers.com',
  'Tennessee Titans': 'tennesseetitans.com',
  'Washington Commanders': 'commanders.com',

  // NBA Teams
  'Atlanta Hawks': 'nba.com/hawks',
  'Boston Celtics': 'nba.com/celtics',
  'Brooklyn Nets': 'nba.com/nets',
  'Charlotte Hornets': 'nba.com/hornets',
  'Chicago Bulls': 'nba.com/bulls',
  'Cleveland Cavaliers': 'nba.com/cavaliers',
  'Dallas Mavericks': 'nba.com/mavericks',
  'Denver Nuggets': 'nba.com/nuggets',
  'Detroit Pistons': 'nba.com/pistons',
  'Golden State Warriors': 'nba.com/warriors',
  'Houston Rockets': 'nba.com/rockets',
  'Indiana Pacers': 'nba.com/pacers',
  'Los Angeles Clippers': 'nba.com/clippers',
  'Los Angeles Lakers': 'nba.com/lakers',
  'Memphis Grizzlies': 'nba.com/grizzlies',
  'Miami Heat': 'nba.com/heat',
  'Milwaukee Bucks': 'nba.com/bucks',
  'Minnesota Timberwolves': 'nba.com/timberwolves',
  'New Orleans Pelicans': 'nba.com/pelicans',
  'New York Knicks': 'nba.com/knicks',
  'Oklahoma City Thunder': 'nba.com/thunder',
  'Orlando Magic': 'nba.com/magic',
  'Philadelphia 76ers': 'nba.com/sixers',
  'Phoenix Suns': 'nba.com/suns',
  'Portland Trail Blazers': 'nba.com/blazers',
  'Sacramento Kings': 'nba.com/kings',
  'San Antonio Spurs': 'nba.com/spurs',
  'Toronto Raptors': 'nba.com/raptors',
  'Utah Jazz': 'nba.com/jazz',
  'Washington Wizards': 'nba.com/wizards',

  // MLB Teams
  'Arizona Diamondbacks': 'mlb.com/dbacks',
  'Atlanta Braves': 'mlb.com/braves',
  'Baltimore Orioles': 'mlb.com/orioles',
  'Boston Red Sox': 'mlb.com/redsox',
  'Chicago Cubs': 'mlb.com/cubs',
  'Chicago White Sox': 'mlb.com/whitesox',
  'Cincinnati Reds': 'mlb.com/reds',
  'Cleveland Guardians': 'mlb.com/guardians',
  'Colorado Rockies': 'mlb.com/rockies',
  'Detroit Tigers': 'mlb.com/tigers',
  'Houston Astros': 'mlb.com/astros',
  'Kansas City Royals': 'mlb.com/royals',
  'Los Angeles Angels': 'mlb.com/angels',
  'Los Angeles Dodgers': 'mlb.com/dodgers',
  'Miami Marlins': 'mlb.com/marlins',
  'Milwaukee Brewers': 'mlb.com/brewers',
  'Minnesota Twins': 'mlb.com/twins',
  'New York Mets': 'mlb.com/mets',
  'New York Yankees': 'mlb.com/yankees',
  'Oakland Athletics': 'mlb.com/athletics',
  'Philadelphia Phillies': 'mlb.com/phillies',
  'Pittsburgh Pirates': 'mlb.com/pirates',
  'San Diego Padres': 'mlb.com/padres',
  'San Francisco Giants': 'mlb.com/giants',
  'Seattle Mariners': 'mlb.com/mariners',
  'St. Louis Cardinals': 'mlb.com/cardinals',
  'Tampa Bay Rays': 'mlb.com/rays',
  'Texas Rangers': 'mlb.com/rangers',
  'Toronto Blue Jays': 'mlb.com/bluejays',
  'Washington Nationals': 'mlb.com/nationals',

  // NHL Teams
  'Anaheim Ducks': 'nhl.com/ducks',
  'Arizona Coyotes': 'nhl.com/coyotes',
  'Boston Bruins': 'nhl.com/bruins',
  'Buffalo Sabres': 'nhl.com/sabres',
  'Calgary Flames': 'nhl.com/flames',
  'Carolina Hurricanes': 'nhl.com/hurricanes',
  'Chicago Blackhawks': 'nhl.com/blackhawks',
  'Colorado Avalanche': 'nhl.com/avalanche',
  'Columbus Blue Jackets': 'nhl.com/bluejackets',
  'Dallas Stars': 'nhl.com/stars',
  'Detroit Red Wings': 'nhl.com/redwings',
  'Edmonton Oilers': 'nhl.com/oilers',
  'Florida Panthers': 'nhl.com/panthers',
  'Los Angeles Kings': 'nhl.com/kings',
  'Minnesota Wild': 'nhl.com/wild',
  'Montreal Canadiens': 'nhl.com/canadiens',
  'Nashville Predators': 'nhl.com/predators',
  'New Jersey Devils': 'nhl.com/devils',
  'New York Islanders': 'nhl.com/islanders',
  'New York Rangers': 'nhl.com/rangers',
  'Ottawa Senators': 'nhl.com/senators',
  'Philadelphia Flyers': 'nhl.com/flyers',
  'Pittsburgh Penguins': 'nhl.com/penguins',
  'San Jose Sharks': 'nhl.com/sharks',
  'Seattle Kraken': 'nhl.com/kraken',
  'St. Louis Blues': 'nhl.com/blues',
  'Tampa Bay Lightning': 'nhl.com/lightning',
  'Toronto Maple Leafs': 'nhl.com/mapleleafs',
  'Vancouver Canucks': 'nhl.com/canucks',
  'Vegas Golden Knights': 'nhl.com/goldenknights',
  'Washington Capitals': 'nhl.com/capitals',
  'Winnipeg Jets': 'nhl.com/jets',

  // MLS Teams
  'Atlanta United FC': 'atlutd.com',
  'Austin FC': 'austinfc.com',
  'Charlotte FC': 'charlottefc.com',
  'Chicago Fire FC': 'chicagofirefc.com',
  'FC Cincinnati': 'fccincinnati.com',
  'Colorado Rapids': 'coloradorapids.com',
  'Columbus Crew': 'columbuscrew.com',
  'D.C. United': 'dcunited.com',
  'FC Dallas': 'fcdallas.com',
  'Houston Dynamo FC': 'houstondynamofc.com',
  'Sporting Kansas City': 'sportingkc.com',
  'LA Galaxy': 'lagalaxy.com',
  'Los Angeles FC': 'lafc.com',
  'Inter Miami CF': 'intermiamicf.com',
  'Minnesota United FC': 'mnufc.com',
  'CF Montreal': 'cfmontreal.com',
  'Nashville SC': 'nashvillesc.com',
  'New England Revolution': 'revolutionsoccer.net',
  'New York City FC': 'newyorkcityfc.com',
  'New York Red Bulls': 'newyorkredbulls.com',
  'Orlando City SC': 'orlandocitysc.com',
  'Philadelphia Union': 'philadelphiaunion.com',
  'Portland Timbers': 'timbers.com',
  'Real Salt Lake': 'rsl.com',
  'San Jose Earthquakes': 'sjearthquakes.com',
  'Seattle Sounders FC': 'soundersfc.com',
  'St. Louis City SC': 'stlcitysc.com',
  'Toronto FC': 'torontofc.ca',
  'Vancouver Whitecaps FC': 'whitecapsfc.com',
};

export function PropertyLogo({ name, size = 'sm', className = '' }: PropertyLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Check sports league teams first (they use ESPN/official CDNs)
  const nbaAbbrev = NBA_TEAM_ABBREVS[name];
  const mlbAbbrev = MLB_TEAM_ABBREVS[name];
  const nhlAbbrev = NHL_TEAM_ABBREVS[name];
  const f1Slug = F1_TEAM_SLUGS[name];

  // Look up domain from mapping
  const domain = PROPERTY_DOMAINS[name];

  // Generate initials for fallback
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Determine logo URL - use ESPN for NBA/MLB/NHL, F1 CDN for F1, logo.dev for others
  let logoUrl: string | null = null;

  if (nbaAbbrev) {
    // Use ESPN CDN for NBA teams
    logoUrl = `https://a.espncdn.com/i/teamlogos/nba/500/${nbaAbbrev}.png`;
  } else if (mlbAbbrev) {
    // Use ESPN CDN for MLB teams
    logoUrl = `https://a.espncdn.com/i/teamlogos/mlb/500/${mlbAbbrev}.png`;
  } else if (nhlAbbrev) {
    // Use ESPN CDN for NHL teams
    logoUrl = `https://a.espncdn.com/i/teamlogos/nhl/500/${nhlAbbrev}.png`;
  } else if (f1Slug) {
    // Use F1 official CDN for F1 teams
    logoUrl = `https://media.formula1.com/content/dam/fom-website/teams/2024/${f1Slug}-logo.png`;
  } else {
    // Use logo.dev API for other properties
    const apiToken = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
    logoUrl = domain && apiToken
      ? `https://img.logo.dev/${domain}?token=${apiToken}&size=64&format=png`
      : null;
  }

  if (!logoUrl || hasError) {
    // Fallback to initials
    return (
      <div
        className={`${sizeClasses[size]} ${className} rounded bg-card-border flex items-center justify-center text-muted font-medium flex-shrink-0`}
        style={{ fontSize: size === 'sm' ? '8px' : size === 'md' ? '10px' : '12px' }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      className={`${sizeClasses[size]} ${className} rounded object-contain bg-white flex-shrink-0`}
      onError={() => setHasError(true)}
    />
  );
}
