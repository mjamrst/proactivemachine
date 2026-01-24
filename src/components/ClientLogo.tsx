'use client';

import { useState } from 'react';

interface ClientLogoProps {
  name: string;
  domain?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
};

// Mapping of common brand names to their domains
const BRAND_DOMAINS: Record<string, string> = {
  // Tech
  'Apple': 'apple.com',
  'Google': 'google.com',
  'Microsoft': 'microsoft.com',
  'Amazon': 'amazon.com',
  'Meta': 'meta.com',
  'Facebook': 'facebook.com',
  'Netflix': 'netflix.com',
  'Spotify': 'spotify.com',
  'Adobe': 'adobe.com',
  'Salesforce': 'salesforce.com',
  'Oracle': 'oracle.com',
  'IBM': 'ibm.com',
  'Intel': 'intel.com',
  'Nvidia': 'nvidia.com',
  'Samsung': 'samsung.com',
  'Sony': 'sony.com',
  'Uber': 'uber.com',
  'Lyft': 'lyft.com',
  'Airbnb': 'airbnb.com',
  'Twitter': 'twitter.com',
  'X': 'x.com',
  'LinkedIn': 'linkedin.com',
  'Snapchat': 'snapchat.com',
  'TikTok': 'tiktok.com',
  'Pinterest': 'pinterest.com',
  'Reddit': 'reddit.com',
  'Slack': 'slack.com',
  'Zoom': 'zoom.us',
  'Shopify': 'shopify.com',
  'Stripe': 'stripe.com',
  'PayPal': 'paypal.com',
  'Square': 'squareup.com',
  'Twitch': 'twitch.tv',

  // Telecom
  'AT&T': 'att.com',
  'Verizon': 'verizon.com',
  'T-Mobile': 't-mobile.com',
  'Sprint': 'sprint.com',
  'Comcast': 'comcast.com',
  'Charter': 'charter.com',

  // Retail
  'Walmart': 'walmart.com',
  'Target': 'target.com',
  'Costco': 'costco.com',
  'Home Depot': 'homedepot.com',
  'Lowes': 'lowes.com',
  "Lowe's": 'lowes.com',
  'Best Buy': 'bestbuy.com',
  'Walgreens': 'walgreens.com',
  'CVS': 'cvs.com',
  'Kroger': 'kroger.com',
  'Whole Foods': 'wholefoodsmarket.com',
  'Trader Joes': 'traderjoes.com',
  "Trader Joe's": 'traderjoes.com',

  // Food & Beverage
  'Coca-Cola': 'coca-cola.com',
  'Pepsi': 'pepsi.com',
  'PepsiCo': 'pepsico.com',
  "McDonald's": 'mcdonalds.com',
  'McDonalds': 'mcdonalds.com',
  'Starbucks': 'starbucks.com',
  'Chipotle': 'chipotle.com',
  'Subway': 'subway.com',
  'Dominos': 'dominos.com',
  "Domino's": 'dominos.com',
  'Pizza Hut': 'pizzahut.com',
  'Taco Bell': 'tacobell.com',
  'Wendys': 'wendys.com',
  "Wendy's": 'wendys.com',
  'Burger King': 'bk.com',
  'Chick-fil-A': 'chick-fil-a.com',
  'Dunkin': 'dunkindonuts.com',
  "Dunkin'": 'dunkindonuts.com',
  'Red Bull': 'redbull.com',
  'Monster Energy': 'monsterenergy.com',
  'Gatorade': 'gatorade.com',
  'Budweiser': 'budweiser.com',
  'Bud Light': 'budlight.com',
  'Corona': 'corona.com',
  'Heineken': 'heineken.com',
  'Jack Daniels': 'jackdaniels.com',

  // Automotive
  'Ford': 'ford.com',
  'GM': 'gm.com',
  'General Motors': 'gm.com',
  'Toyota': 'toyota.com',
  'Honda': 'honda.com',
  'BMW': 'bmw.com',
  'Mercedes': 'mercedes-benz.com',
  'Mercedes-Benz': 'mercedes-benz.com',
  'Audi': 'audi.com',
  'Tesla': 'tesla.com',
  'Volkswagen': 'vw.com',
  'Porsche': 'porsche.com',
  'Ferrari': 'ferrari.com',
  'Lamborghini': 'lamborghini.com',
  'Chevrolet': 'chevrolet.com',
  'Jeep': 'jeep.com',
  'Nissan': 'nissan-usa.com',
  'Hyundai': 'hyundai.com',
  'Kia': 'kia.com',
  'Lexus': 'lexus.com',
  'Subaru': 'subaru.com',
  'Mazda': 'mazda.com',

  // Fashion & Apparel
  'Nike': 'nike.com',
  'Adidas': 'adidas.com',
  'Puma': 'puma.com',
  'Under Armour': 'underarmour.com',
  'Lululemon': 'lululemon.com',
  'Gap': 'gap.com',
  'Old Navy': 'oldnavy.com',
  'H&M': 'hm.com',
  'Zara': 'zara.com',
  'Uniqlo': 'uniqlo.com',
  'Levis': 'levi.com',
  "Levi's": 'levi.com',
  'Ralph Lauren': 'ralphlauren.com',
  'Calvin Klein': 'calvinklein.com',
  'Tommy Hilfiger': 'tommy.com',
  'Gucci': 'gucci.com',
  'Louis Vuitton': 'louisvuitton.com',
  'Chanel': 'chanel.com',
  'Prada': 'prada.com',
  'Versace': 'versace.com',

  // Finance & Banking
  'Chase': 'chase.com',
  'Bank of America': 'bankofamerica.com',
  'Wells Fargo': 'wellsfargo.com',
  'Citi': 'citi.com',
  'Citibank': 'citi.com',
  'Capital One': 'capitalone.com',
  'American Express': 'americanexpress.com',
  'Amex': 'americanexpress.com',
  'Visa': 'visa.com',
  'Mastercard': 'mastercard.com',
  'Discover': 'discover.com',
  'Goldman Sachs': 'goldmansachs.com',
  'Morgan Stanley': 'morganstanley.com',
  'JP Morgan': 'jpmorgan.com',
  'Fidelity': 'fidelity.com',
  'Charles Schwab': 'schwab.com',
  'State Farm': 'statefarm.com',
  'Geico': 'geico.com',
  'Progressive': 'progressive.com',
  'Allstate': 'allstate.com',

  // Consumer Goods
  'Procter & Gamble': 'pg.com',
  'P&G': 'pg.com',
  'Johnson & Johnson': 'jnj.com',
  'J&J': 'jnj.com',
  'Unilever': 'unilever.com',
  'Colgate': 'colgate.com',
  'Gillette': 'gillette.com',
  'Dove': 'dove.com',
  'Tide': 'tide.com',
  'Pampers': 'pampers.com',

  // Airlines
  'Delta': 'delta.com',
  'United Airlines': 'united.com',
  'United': 'united.com',
  'American Airlines': 'aa.com',
  'Southwest': 'southwest.com',
  'JetBlue': 'jetblue.com',
  'Alaska Airlines': 'alaskaair.com',

  // Media & Entertainment
  'Disney': 'disney.com',
  'Warner Bros': 'warnerbros.com',
  'Paramount': 'paramount.com',
  'Universal': 'universalpictures.com',
  'HBO': 'hbo.com',
  'ESPN': 'espn.com',
  'Fox': 'fox.com',
  'NBC': 'nbc.com',
  'CBS': 'cbs.com',
  'ABC': 'abc.com',
  'CNN': 'cnn.com',
  'Hulu': 'hulu.com',
  'YouTube': 'youtube.com',
  'Paramount+': 'paramountplus.com',
  'Peacock': 'peacocktv.com',
  'Discovery': 'discovery.com',
  'Warner Bros. Discovery': 'wbd.com',

  // Gaming
  'PlayStation': 'playstation.com',
  'Xbox': 'xbox.com',
  'Nintendo': 'nintendo.com',
  'EA': 'ea.com',
  'Electronic Arts': 'ea.com',
  'Activision': 'activision.com',
  'Epic Games': 'epicgames.com',
  'Riot Games': 'riotgames.com',
  'Blizzard': 'blizzard.com',
  'Ubisoft': 'ubisoft.com',
  'Take-Two': 'take2games.com',
  'Rockstar': 'rockstargames.com',
  '2K': '2k.com',

  // Other
  'FedEx': 'fedex.com',
  'UPS': 'ups.com',
  'DHL': 'dhl.com',
  'GE': 'ge.com',
  'General Electric': 'ge.com',
  '3M': '3m.com',
  'Honeywell': 'honeywell.com',
  'Caterpillar': 'cat.com',
  'John Deere': 'deere.com',
  'Deere': 'deere.com',
  'Boeing': 'boeing.com',
  'Lockheed Martin': 'lockheedmartin.com',
  'Raytheon': 'rtx.com',
  'SpaceX': 'spacex.com',
};

function getDomainForBrand(name: string, providedDomain?: string | null): string | null {
  // Use provided domain if available
  if (providedDomain) return providedDomain;

  // Try exact match in mapping
  if (BRAND_DOMAINS[name]) return BRAND_DOMAINS[name];

  // Try case-insensitive match
  const lowerName = name.toLowerCase();
  const found = Object.entries(BRAND_DOMAINS).find(
    ([key]) => key.toLowerCase() === lowerName
  );
  if (found) return found[1];

  // Try to guess from name (e.g., "Apple" → "apple.com")
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (cleanName) return `${cleanName}.com`;

  return null;
}

export function ClientLogo({ name, domain, size = 'md', className = '' }: ClientLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Generate initials for fallback
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Use logo.dev API for high-quality logos
  const apiToken = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN;
  const targetDomain = getDomainForBrand(name, domain);
  const logoUrl = targetDomain && apiToken
    ? `https://img.logo.dev/${targetDomain}?token=${apiToken}&size=128&format=png`
    : null;

  if (!logoUrl || hasError) {
    // Fallback to initials
    return (
      <div
        className={`${sizeClasses[size]} ${className} rounded-md bg-accent/20 flex items-center justify-center text-accent font-semibold flex-shrink-0`}
        style={{ fontSize: size === 'sm' ? '10px' : size === 'md' ? '12px' : '14px' }}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={`${name} logo`}
      className={`${sizeClasses[size]} ${className} rounded-md object-contain bg-white p-0.5 flex-shrink-0`}
      onError={() => setHasError(true)}
    />
  );
}
