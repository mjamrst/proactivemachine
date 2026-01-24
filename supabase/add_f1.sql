-- Add Formula 1 and all F1 teams

-- Insert F1 as a league
INSERT INTO properties (name, category, parent_id)
VALUES ('Formula 1', 'league', NULL);

-- Insert all F1 teams with F1 as parent
INSERT INTO properties (name, category, parent_id)
SELECT name, 'team', (SELECT id FROM properties WHERE name = 'Formula 1')
FROM (VALUES
  ('Red Bull Racing'),
  ('Ferrari'),
  ('Mercedes-AMG Petronas'),
  ('McLaren'),
  ('Aston Martin'),
  ('Alpine'),
  ('Williams'),
  ('RB'),
  ('Kick Sauber'),
  ('Haas')
) AS teams(name);
