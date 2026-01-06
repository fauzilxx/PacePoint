-- Sample Data for PacePoint Database
-- Run this AFTER schema.sql to populate initial data

-- Insert sample events (you'll need to replace organizer_id with actual UUID from your auth.users)
INSERT INTO public.events (name, description, date, location, image, distances, max_participants, category, price, organizer_id) VALUES
(
  'Mountain Ridge Trail Run',
  'Join us for an unforgettable trail running experience through the stunning Blue Ridge Mountains. This event offers three distance options suitable for runners of all levels.',
  '2025-03-15 07:00:00+00',
  'Blue Ridge Mountains',
  '/mountain-trail-running-scenic-view.jpg',
  ARRAY['5K', '10K', 'Trail'],
  200,
  'trail',
  55.00,
  '00000000-0000-0000-0000-000000000000'  -- Replace with actual organizer UUID
),
(
  'City Marathon Spring Edition',
  'Experience the thrill of running through downtown streets with thousands of fellow runners in our annual spring marathon.',
  '2025-04-22 06:00:00+00',
  'Downtown Metro City',
  '/city-marathon-runners-urban.jpg',
  ARRAY['10K', '21K', 'Marathon'],
  500,
  'road',
  65.00,
  '00000000-0000-0000-0000-000000000000'  -- Replace with actual organizer UUID
),
(
  'Forest Trail Challenge',
  'A scenic trail run through the beautiful Pinewood Forest. Perfect for beginners and experienced trail runners alike.',
  '2025-05-08 07:30:00+00',
  'Pinewood Forest',
  '/forest-trail-running-trees-nature.jpg',
  ARRAY['5K', 'Trail'],
  150,
  'trail',
  45.00,
  '00000000-0000-0000-0000-000000000000'  -- Replace with actual organizer UUID
),
(
  'Coastal Run Festival',
  'Run along the beautiful coastline with stunning ocean views. A perfect blend of fitness and natural beauty.',
  '2025-06-12 06:30:00+00',
  'Sunset Beach',
  '/beach-coastal-running-sunrise.jpg',
  ARRAY['5K', '10K'],
  250,
  'road',
  50.00,
  '00000000-0000-0000-0000-000000000000'  -- Replace with actual organizer UUID
);

-- Insert sample blog posts (you'll need to replace author_id with actual UUID)
INSERT INTO public.blog_posts (slug, title, excerpt, content, image, category, author_id, read_time, published, published_at) VALUES
(
  'trail-running-tips-beginners',
  'Trail Running Tips for Beginners',
  'Essential advice to start your trail running journey safely and confidently. Learn about proper gear, technique, and safety tips.',
  '<h2>Start with the Right Mindset</h2><p>Trail running is different from road running...</p>',
  '/trail-runner-on-mountain-path.jpg',
  'Tips & Guides',
  '00000000-0000-0000-0000-000000000000',  -- Replace with actual author UUID
  '5 min read',
  true,
  NOW()
),
(
  'nutrition-guide-long-distance',
  'Nutrition Guide for Long Distance Runs',
  'What to eat before, during, and after your marathon training sessions. Complete guide to fueling your body for optimal performance.',
  '<h2>Pre-Run Nutrition</h2><p>Proper nutrition before a run...</p>',
  '/healthy-running-nutrition-food.jpg',
  'Nutrition',
  '00000000-0000-0000-0000-000000000000',  -- Replace with actual author UUID
  '8 min read',
  true,
  NOW()
),
(
  'best-running-gear-2025',
  'Best Running Gear for 2025',
  'Our curated selection of the most reliable running equipment this season, from shoes to accessories.',
  '<h2>Top Running Shoes</h2><p>After extensive testing...</p>',
  '/running-shoes-and-gear-equipment.jpg',
  'Gear Reviews',
  '00000000-0000-0000-0000-000000000000',  -- Replace with actual author UUID
  '6 min read',
  true,
  NOW()
);

-- Note: You'll need to manually update the organizer_id and author_id values
-- with actual UUIDs from your auth.users table after creating users
