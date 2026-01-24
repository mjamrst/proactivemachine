-- Add NASCAR Cup Series Teams
-- Run this migration to add NASCAR teams under the NASCAR league

-- ============================================
-- NASCAR TEAMS (Cup Series)
-- ============================================

INSERT INTO properties (name, category, parent_id) VALUES
  -- Multi-Car Championship Organizations
  ('Hendrick Motorsports', 'team', '00000000-0000-0000-0001-000000000007'),
  ('Joe Gibbs Racing', 'team', '00000000-0000-0000-0001-000000000007'),
  ('Team Penske', 'team', '00000000-0000-0000-0001-000000000007'),
  ('RFK Racing', 'team', '00000000-0000-0000-0001-000000000007'),
  ('23XI Racing', 'team', '00000000-0000-0000-0001-000000000007'),
  ('Trackhouse Racing', 'team', '00000000-0000-0000-0001-000000000007'),
  ('Richard Childress Racing', 'team', '00000000-0000-0000-0001-000000000007'),

  -- Other Full-Time Teams
  ('Spire Motorsports', 'team', '00000000-0000-0000-0001-000000000007'),
  ('Legacy Motor Club', 'team', '00000000-0000-0000-0001-000000000007'),
  ('Kaulig Racing', 'team', '00000000-0000-0000-0001-000000000007'),
  ('Wood Brothers Racing', 'team', '00000000-0000-0000-0001-000000000007'),
  ('Front Row Motorsports', 'team', '00000000-0000-0000-0001-000000000007'),
  ('JTG Daugherty Racing', 'team', '00000000-0000-0000-0001-000000000007'),
  ('Haas Factory Team', 'team', '00000000-0000-0000-0001-000000000007'),
  ('Rick Ware Racing', 'team', '00000000-0000-0000-0001-000000000007');
