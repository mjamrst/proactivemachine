-- Primer Seed Data
-- Run this after schema.sql to populate the database

-- ============================================
-- SAMPLE CLIENTS
-- ============================================

INSERT INTO clients (name) VALUES
  ('AT&T'),
  ('State Farm'),
  ('Verizon'),
  ('Nike'),
  ('Coca-Cola'),
  ('Pepsi'),
  ('Toyota'),
  ('Ford'),
  ('Samsung'),
  ('Apple');

-- ============================================
-- LEAGUES
-- ============================================

-- NBA
INSERT INTO properties (id, name, category) VALUES
  ('00000000-0000-0000-0001-000000000001', 'NBA', 'league');

-- NFL
INSERT INTO properties (id, name, category) VALUES
  ('00000000-0000-0000-0001-000000000002', 'NFL', 'league');

-- MLB
INSERT INTO properties (id, name, category) VALUES
  ('00000000-0000-0000-0001-000000000003', 'MLB', 'league');

-- NHL
INSERT INTO properties (id, name, category) VALUES
  ('00000000-0000-0000-0001-000000000004', 'NHL', 'league');

-- PGA
INSERT INTO properties (id, name, category) VALUES
  ('00000000-0000-0000-0001-000000000005', 'PGA', 'league');

-- MLS
INSERT INTO properties (id, name, category) VALUES
  ('00000000-0000-0000-0001-000000000006', 'MLS', 'league');

-- NASCAR
INSERT INTO properties (id, name, category) VALUES
  ('00000000-0000-0000-0001-000000000007', 'NASCAR', 'league');

-- ============================================
-- NBA TEAMS
-- ============================================

INSERT INTO properties (name, category, parent_id) VALUES
  -- Eastern Conference - Atlantic
  ('Boston Celtics', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Brooklyn Nets', 'team', '00000000-0000-0000-0001-000000000001'),
  ('New York Knicks', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Philadelphia 76ers', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Toronto Raptors', 'team', '00000000-0000-0000-0001-000000000001'),
  -- Eastern Conference - Central
  ('Chicago Bulls', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Cleveland Cavaliers', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Detroit Pistons', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Indiana Pacers', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Milwaukee Bucks', 'team', '00000000-0000-0000-0001-000000000001'),
  -- Eastern Conference - Southeast
  ('Atlanta Hawks', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Charlotte Hornets', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Miami Heat', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Orlando Magic', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Washington Wizards', 'team', '00000000-0000-0000-0001-000000000001'),
  -- Western Conference - Northwest
  ('Denver Nuggets', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Minnesota Timberwolves', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Oklahoma City Thunder', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Portland Trail Blazers', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Utah Jazz', 'team', '00000000-0000-0000-0001-000000000001'),
  -- Western Conference - Pacific
  ('Golden State Warriors', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Los Angeles Clippers', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Los Angeles Lakers', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Phoenix Suns', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Sacramento Kings', 'team', '00000000-0000-0000-0001-000000000001'),
  -- Western Conference - Southwest
  ('Dallas Mavericks', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Houston Rockets', 'team', '00000000-0000-0000-0001-000000000001'),
  ('Memphis Grizzlies', 'team', '00000000-0000-0000-0001-000000000001'),
  ('New Orleans Pelicans', 'team', '00000000-0000-0000-0001-000000000001'),
  ('San Antonio Spurs', 'team', '00000000-0000-0000-0001-000000000001');

-- ============================================
-- NFL TEAMS
-- ============================================

INSERT INTO properties (name, category, parent_id) VALUES
  -- AFC East
  ('Buffalo Bills', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Miami Dolphins', 'team', '00000000-0000-0000-0001-000000000002'),
  ('New England Patriots', 'team', '00000000-0000-0000-0001-000000000002'),
  ('New York Jets', 'team', '00000000-0000-0000-0001-000000000002'),
  -- AFC North
  ('Baltimore Ravens', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Cincinnati Bengals', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Cleveland Browns', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Pittsburgh Steelers', 'team', '00000000-0000-0000-0001-000000000002'),
  -- AFC South
  ('Houston Texans', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Indianapolis Colts', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Jacksonville Jaguars', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Tennessee Titans', 'team', '00000000-0000-0000-0001-000000000002'),
  -- AFC West
  ('Denver Broncos', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Kansas City Chiefs', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Las Vegas Raiders', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Los Angeles Chargers', 'team', '00000000-0000-0000-0001-000000000002'),
  -- NFC East
  ('Dallas Cowboys', 'team', '00000000-0000-0000-0001-000000000002'),
  ('New York Giants', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Philadelphia Eagles', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Washington Commanders', 'team', '00000000-0000-0000-0001-000000000002'),
  -- NFC North
  ('Chicago Bears', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Detroit Lions', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Green Bay Packers', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Minnesota Vikings', 'team', '00000000-0000-0000-0001-000000000002'),
  -- NFC South
  ('Atlanta Falcons', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Carolina Panthers', 'team', '00000000-0000-0000-0001-000000000002'),
  ('New Orleans Saints', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Tampa Bay Buccaneers', 'team', '00000000-0000-0000-0001-000000000002'),
  -- NFC West
  ('Arizona Cardinals', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Los Angeles Rams', 'team', '00000000-0000-0000-0001-000000000002'),
  ('San Francisco 49ers', 'team', '00000000-0000-0000-0001-000000000002'),
  ('Seattle Seahawks', 'team', '00000000-0000-0000-0001-000000000002');

-- ============================================
-- MLB TEAMS
-- ============================================

INSERT INTO properties (name, category, parent_id) VALUES
  -- American League East
  ('Baltimore Orioles', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Boston Red Sox', 'team', '00000000-0000-0000-0001-000000000003'),
  ('New York Yankees', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Tampa Bay Rays', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Toronto Blue Jays', 'team', '00000000-0000-0000-0001-000000000003'),
  -- American League Central
  ('Chicago White Sox', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Cleveland Guardians', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Detroit Tigers', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Kansas City Royals', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Minnesota Twins', 'team', '00000000-0000-0000-0001-000000000003'),
  -- American League West
  ('Houston Astros', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Los Angeles Angels', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Oakland Athletics', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Seattle Mariners', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Texas Rangers', 'team', '00000000-0000-0000-0001-000000000003'),
  -- National League East
  ('Atlanta Braves', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Miami Marlins', 'team', '00000000-0000-0000-0001-000000000003'),
  ('New York Mets', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Philadelphia Phillies', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Washington Nationals', 'team', '00000000-0000-0000-0001-000000000003'),
  -- National League Central
  ('Chicago Cubs', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Cincinnati Reds', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Milwaukee Brewers', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Pittsburgh Pirates', 'team', '00000000-0000-0000-0001-000000000003'),
  ('St. Louis Cardinals', 'team', '00000000-0000-0000-0001-000000000003'),
  -- National League West
  ('Arizona Diamondbacks', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Colorado Rockies', 'team', '00000000-0000-0000-0001-000000000003'),
  ('Los Angeles Dodgers', 'team', '00000000-0000-0000-0001-000000000003'),
  ('San Diego Padres', 'team', '00000000-0000-0000-0001-000000000003'),
  ('San Francisco Giants', 'team', '00000000-0000-0000-0001-000000000003');

-- ============================================
-- NHL TEAMS
-- ============================================

INSERT INTO properties (name, category, parent_id) VALUES
  -- Eastern Conference - Atlantic
  ('Boston Bruins', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Buffalo Sabres', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Detroit Red Wings', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Florida Panthers', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Montreal Canadiens', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Ottawa Senators', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Tampa Bay Lightning', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Toronto Maple Leafs', 'team', '00000000-0000-0000-0001-000000000004'),
  -- Eastern Conference - Metropolitan
  ('Carolina Hurricanes', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Columbus Blue Jackets', 'team', '00000000-0000-0000-0001-000000000004'),
  ('New Jersey Devils', 'team', '00000000-0000-0000-0001-000000000004'),
  ('New York Islanders', 'team', '00000000-0000-0000-0001-000000000004'),
  ('New York Rangers', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Philadelphia Flyers', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Pittsburgh Penguins', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Washington Capitals', 'team', '00000000-0000-0000-0001-000000000004'),
  -- Western Conference - Central
  ('Arizona Coyotes', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Chicago Blackhawks', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Colorado Avalanche', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Dallas Stars', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Minnesota Wild', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Nashville Predators', 'team', '00000000-0000-0000-0001-000000000004'),
  ('St. Louis Blues', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Winnipeg Jets', 'team', '00000000-0000-0000-0001-000000000004'),
  -- Western Conference - Pacific
  ('Anaheim Ducks', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Calgary Flames', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Edmonton Oilers', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Los Angeles Kings', 'team', '00000000-0000-0000-0001-000000000004'),
  ('San Jose Sharks', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Seattle Kraken', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Vancouver Canucks', 'team', '00000000-0000-0000-0001-000000000004'),
  ('Vegas Golden Knights', 'team', '00000000-0000-0000-0001-000000000004');

-- ============================================
-- MLS TEAMS
-- ============================================

INSERT INTO properties (name, category, parent_id) VALUES
  -- Eastern Conference
  ('Atlanta United FC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Charlotte FC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Chicago Fire FC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('FC Cincinnati', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Columbus Crew', 'team', '00000000-0000-0000-0001-000000000006'),
  ('D.C. United', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Inter Miami CF', 'team', '00000000-0000-0000-0001-000000000006'),
  ('CF Montreal', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Nashville SC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('New England Revolution', 'team', '00000000-0000-0000-0001-000000000006'),
  ('New York City FC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('New York Red Bulls', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Orlando City SC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Philadelphia Union', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Toronto FC', 'team', '00000000-0000-0000-0001-000000000006'),
  -- Western Conference
  ('Austin FC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Colorado Rapids', 'team', '00000000-0000-0000-0001-000000000006'),
  ('FC Dallas', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Houston Dynamo FC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('LA Galaxy', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Los Angeles FC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Minnesota United FC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Portland Timbers', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Real Salt Lake', 'team', '00000000-0000-0000-0001-000000000006'),
  ('San Jose Earthquakes', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Seattle Sounders FC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Sporting Kansas City', 'team', '00000000-0000-0000-0001-000000000006'),
  ('St. Louis City SC', 'team', '00000000-0000-0000-0001-000000000006'),
  ('Vancouver Whitecaps FC', 'team', '00000000-0000-0000-0001-000000000006');

-- ============================================
-- MUSIC FESTIVALS
-- ============================================

INSERT INTO properties (name, category) VALUES
  ('Coachella', 'music_festival'),
  ('Lollapalooza', 'music_festival'),
  ('Bonnaroo', 'music_festival'),
  ('Austin City Limits', 'music_festival'),
  ('Rolling Loud', 'music_festival'),
  ('EDC (Electric Daisy Carnival)', 'music_festival'),
  ('Governors Ball', 'music_festival'),
  ('Outside Lands', 'music_festival'),
  ('Ultra Music Festival', 'music_festival'),
  ('Stagecoach', 'music_festival'),
  ('Burning Man', 'music_festival'),
  ('SXSW', 'music_festival');

-- ============================================
-- ENTERTAINMENT PROPERTIES
-- ============================================

INSERT INTO properties (name, category) VALUES
  ('Oscars', 'entertainment'),
  ('Emmys', 'entertainment'),
  ('Tonys', 'entertainment'),
  ('Grammys', 'entertainment'),
  ('MTV VMAs', 'entertainment'),
  ('BET Awards', 'entertainment'),
  ('ESPYs', 'entertainment'),
  ('Golden Globes', 'entertainment'),
  ('SAG Awards', 'entertainment'),
  ('Billboard Music Awards', 'entertainment'),
  ('American Music Awards', 'entertainment'),
  ('iHeartRadio Music Awards', 'entertainment');

-- ============================================
-- CULTURAL MOMENTS
-- ============================================

INSERT INTO properties (name, category) VALUES
  ('Super Bowl', 'cultural_moment'),
  ('NBA All-Star Weekend', 'cultural_moment'),
  ('MLB All-Star Game', 'cultural_moment'),
  ('NFL Draft', 'cultural_moment'),
  ('NBA Draft', 'cultural_moment'),
  ('March Madness', 'cultural_moment'),
  ('The Masters', 'cultural_moment'),
  ('Kentucky Derby', 'cultural_moment'),
  ('World Series', 'cultural_moment'),
  ('Stanley Cup Finals', 'cultural_moment'),
  ('NBA Finals', 'cultural_moment'),
  ('MLS Cup', 'cultural_moment'),
  ('College Football Playoff', 'cultural_moment'),
  ('US Open (Tennis)', 'cultural_moment'),
  ('Wimbledon', 'cultural_moment'),
  ('Olympics', 'cultural_moment'),
  ('FIFA World Cup', 'cultural_moment'),
  ('Daytona 500', 'cultural_moment'),
  ('Indianapolis 500', 'cultural_moment');
