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

  // Some NFL Teams
  'Dallas Cowboys': 'dallascowboys.com',
  'New England Patriots': 'patriots.com',
  'Green Bay Packers': 'packers.com',
  'Las Vegas Raiders': 'raiders.com',
  'San Francisco 49ers': '49ers.com',
  'Kansas City Chiefs': 'chiefs.com',
  'Philadelphia Eagles': 'philadelphiaeagles.com',
  'Miami Dolphins': 'miamidolphins.com',
  'Chicago Bears': 'chicagobears.com',
  'New York Giants': 'giants.com',

  // Some NBA Teams
  'Los Angeles Lakers': 'nba.com/lakers',
  'Golden State Warriors': 'nba.com/warriors',
  'Boston Celtics': 'nba.com/celtics',
  'Chicago Bulls': 'nba.com/bulls',
  'Miami Heat': 'nba.com/heat',
  'Brooklyn Nets': 'nba.com/nets',
  'New York Knicks': 'nba.com/knicks',

  // Some MLB Teams
  'New York Yankees': 'mlb.com/yankees',
  'Los Angeles Dodgers': 'mlb.com/dodgers',
  'Boston Red Sox': 'mlb.com/redsox',
  'Chicago Cubs': 'mlb.com/cubs',
};

export function PropertyLogo({ name, size = 'sm', className = '' }: PropertyLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Look up domain from mapping
  const domain = PROPERTY_DOMAINS[name];

  // Generate initials for fallback
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Use logo.dev API
  const apiToken = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
  const logoUrl = domain && apiToken
    ? `https://img.logo.dev/${domain}?token=${apiToken}&size=64&format=png`
    : null;

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
