-- SkyHire seed data — translated 1:1 from src/data/seed/*.ts (same ids, emails,
-- dates) so the hosted DB matches what the mock layer used to serve. Idempotent
-- via ON CONFLICT DO NOTHING so re-running the migration set is safe.

-- ---------------------------------------------------------------------------
-- users (pilot accounts derive their email/createdAt exactly as users.ts does)
-- ---------------------------------------------------------------------------
insert into public.users (id, name, email, role, status, flag_reason, created_at) values
  ('usr-001', 'Marcus Reed',   'marcus.reed@skyhire.demo',   'pilot', 'active',  null, '2026-01-10'),
  ('usr-002', 'Elena Voss',    'elena.voss@skyhire.demo',    'pilot', 'active',  null, '2026-02-11'),
  ('usr-003', 'Diego Marin',   'diego.marin@skyhire.demo',   'pilot', 'active',  null, '2026-03-12'),
  ('usr-004', 'Priya Nair',    'priya.nair@skyhire.demo',    'pilot', 'active',  null, '2026-04-13'),
  ('usr-005', 'Tom Alvarez',   'tom.alvarez@skyhire.demo',   'pilot', 'active',  null, '2026-05-14'),
  ('usr-006', 'Sarah Kim',     'sarah.kim@skyhire.demo',     'pilot', 'active',  null, '2026-01-15'),
  ('usr-007', 'James Okoro',   'james.okoro@skyhire.demo',   'pilot', 'active',  null, '2026-02-16'),
  ('usr-008', 'Hannah Blake',  'hannah.blake@skyhire.demo',  'pilot', 'active',  null, '2026-03-17'),
  ('usr-admin',   'Trust & Safety', 'admin@skyhire.demo',        'admin',  'active', null, '2025-10-01'),
  ('usr-client',  'Jordan Mills',   'client@skyhire.demo',       'client', 'active', null, '2026-04-12'),
  ('usr-c-avery', 'Avery Stone',    'avery@stonerealty.com',     'client', 'active', null, '2026-05-30'),
  ('usr-c-harbor','Harbor Events',  'book@harborevents.co',      'client', 'active', null, '2026-06-02'),
  ('usr-spam',    'anon_user_88',   'promo+88@mailinator.com',   'client', 'flagged', 'Posted a review flagged as spam (external links).', '2026-06-05'),
  ('usr-c-dupe',  'Quick Quotes LLC','noreply@temp-mail.org',    'client', 'flagged', 'Disposable email domain; 6 quote requests in under an hour.', '2026-06-09')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- categories (from the specialty taxonomy, all active)
-- ---------------------------------------------------------------------------
insert into public.categories (slug, label, active) values
  ('aerial-photography', 'Aerial Photography', true),
  ('roof-inspection',    'Roof Inspection',    true),
  ('mapping-surveying',  'Mapping & Surveying',true),
  ('real-estate',        'Real Estate',        true),
  ('construction',       'Construction',       true),
  ('event-coverage',     'Event Coverage',     true),
  ('agriculture',        'Agriculture',        true),
  ('solar-inspection',   'Solar Inspection',   true)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- pilots (portfolio jsonb + picsum/pravatar urls reproduced exactly)
-- ---------------------------------------------------------------------------
insert into public.pilots (
  id, user_id, name, business_name, avatar_url, bio, location, service_area_miles,
  specialties, pricing_model, starting_price, verification_status, rating_avg,
  review_count, response_time_hours, available, featured, portfolio
) values
  ('plt-001','usr-001','Marcus Reed','Skyline Aerial Co.','https://i.pravatar.cc/200?img=12',
   'FAA Part 107 pilot with 6 years specializing in real estate and architectural aerials. I deliver edited, listing-ready media within 24 hours.',
   'Austin, TX', 50, ARRAY['real-estate','aerial-photography'], 'per-project', 350, 'verified', 4.9, 128, 2, true, true,
   '[{"id":"skyline-p0","imageUrl":"https://picsum.photos/seed/skyline0/800/600","caption":"Hillside estate, golden hour"},{"id":"skyline-p1","imageUrl":"https://picsum.photos/seed/skyline1/800/600","caption":"Downtown condo tower"},{"id":"skyline-p2","imageUrl":"https://picsum.photos/seed/skyline2/800/600","caption":"Lakefront property sweep"},{"id":"skyline-p3","imageUrl":"https://picsum.photos/seed/skyline3/800/600","caption":"Suburban listing package"}]'::jsonb),

  ('plt-002','usr-002','Elena Voss','InspectAir Solutions','https://i.pravatar.cc/200?img=45',
   'Thermal-certified inspection specialist for roofing and solar. Detailed defect reports with geotagged imagery for insurance and contractors.',
   'Denver, CO', 75, ARRAY['roof-inspection','solar-inspection'], 'per-project', 275, 'verified', 4.8, 94, 4, true, true,
   '[{"id":"inspectair-p0","imageUrl":"https://picsum.photos/seed/inspectair0/800/600","caption":"Thermal roof scan"},{"id":"inspectair-p1","imageUrl":"https://picsum.photos/seed/inspectair1/800/600","caption":"Solar array audit"},{"id":"inspectair-p2","imageUrl":"https://picsum.photos/seed/inspectair2/800/600","caption":"Commercial flat roof"},{"id":"inspectair-p3","imageUrl":"https://picsum.photos/seed/inspectair3/800/600","caption":"Storm damage survey"}]'::jsonb),

  ('plt-003','usr-003','Diego Marin','TerraMap Drones','https://i.pravatar.cc/200?img=33',
   'Survey-grade mapping and orthomosaics for construction and land development. RTK-equipped for centimeter accuracy.',
   'Phoenix, AZ', 120, ARRAY['mapping-surveying','construction'], 'per-day', 900, 'verified', 4.7, 61, 6, false, true,
   '[{"id":"terramap-p0","imageUrl":"https://picsum.photos/seed/terramap0/800/600","caption":"Site progress orthomosaic"},{"id":"terramap-p1","imageUrl":"https://picsum.photos/seed/terramap1/800/600","caption":"Topographic survey"},{"id":"terramap-p2","imageUrl":"https://picsum.photos/seed/terramap2/800/600","caption":"Volumetric stockpile calc"},{"id":"terramap-p3","imageUrl":"https://picsum.photos/seed/terramap3/800/600","caption":"Subdivision mapping"}]'::jsonb),

  ('plt-004','usr-004','Priya Nair','Lumen Event Films','https://i.pravatar.cc/200?img=48',
   'Cinematic aerial coverage for weddings, festivals, and brand activations. FAA-waivered for crowd operations.',
   'Los Angeles, CA', 60, ARRAY['event-coverage','aerial-photography'], 'hourly', 220, 'verified', 5.0, 73, 3, true, false,
   '[{"id":"lumen-p0","imageUrl":"https://picsum.photos/seed/lumen0/800/600","caption":"Vineyard wedding"},{"id":"lumen-p1","imageUrl":"https://picsum.photos/seed/lumen1/800/600","caption":"Music festival reveal"},{"id":"lumen-p2","imageUrl":"https://picsum.photos/seed/lumen2/800/600","caption":"Brand launch flythrough"},{"id":"lumen-p3","imageUrl":"https://picsum.photos/seed/lumen3/800/600","caption":"Coastal ceremony"}]'::jsonb),

  ('plt-005','usr-005','Tom Alvarez','GreenField Aerial','https://i.pravatar.cc/200?img=15',
   'Agricultural mapping, NDVI crop health, and livestock monitoring for farms across the Midwest.',
   'Des Moines, IA', 150, ARRAY['agriculture','mapping-surveying'], 'per-day', 650, 'pending', 4.6, 38, 12, true, false,
   '[{"id":"greenfield-p0","imageUrl":"https://picsum.photos/seed/greenfield0/800/600","caption":"NDVI crop health map"},{"id":"greenfield-p1","imageUrl":"https://picsum.photos/seed/greenfield1/800/600","caption":"Irrigation survey"},{"id":"greenfield-p2","imageUrl":"https://picsum.photos/seed/greenfield2/800/600","caption":"Field boundary mapping"}]'::jsonb),

  ('plt-006','usr-006','Sarah Kim','Apex Property Media','https://i.pravatar.cc/200?img=47',
   'High-end real estate photography and video tours. Twilight shoots and 3D-ready captures a specialty.',
   'Seattle, WA', 40, ARRAY['real-estate','aerial-photography'], 'per-project', 400, 'verified', 4.9, 112, 1, true, false,
   '[{"id":"apex-p0","imageUrl":"https://picsum.photos/seed/apex0/800/600","caption":"Twilight luxury listing"},{"id":"apex-p1","imageUrl":"https://picsum.photos/seed/apex1/800/600","caption":"Waterfront estate"},{"id":"apex-p2","imageUrl":"https://picsum.photos/seed/apex2/800/600","caption":"Modern infill home"},{"id":"apex-p3","imageUrl":"https://picsum.photos/seed/apex3/800/600","caption":"Acreage overview"}]'::jsonb),

  ('plt-007','usr-007','James Okoro','Vertex Inspections','https://i.pravatar.cc/200?img=50',
   'Cell tower, bridge, and industrial inspections. Confined-space and close-proximity flight experience.',
   'Atlanta, GA', 100, ARRAY['roof-inspection','construction'], 'hourly', 180, 'unverified', 4.4, 21, 8, true, false,
   '[{"id":"vertex-p0","imageUrl":"https://picsum.photos/seed/vertex0/800/600","caption":"Tower structural scan"},{"id":"vertex-p1","imageUrl":"https://picsum.photos/seed/vertex1/800/600","caption":"Bridge underside survey"},{"id":"vertex-p2","imageUrl":"https://picsum.photos/seed/vertex2/800/600","caption":"Industrial facade audit"}]'::jsonb),

  ('plt-008','usr-008','Hannah Blake','Northstar Surveys','https://i.pravatar.cc/200?img=44',
   'Construction progress documentation and as-built mapping. Weekly site capture programs for GCs.',
   'Minneapolis, MN', 90, ARRAY['construction','mapping-surveying'], 'per-project', 500, 'verified', 4.8, 56, 5, false, false,
   '[{"id":"northstar-p0","imageUrl":"https://picsum.photos/seed/northstar0/800/600","caption":"Tower crane progress"},{"id":"northstar-p1","imageUrl":"https://picsum.photos/seed/northstar1/800/600","caption":"Site logistics overview"},{"id":"northstar-p2","imageUrl":"https://picsum.photos/seed/northstar2/800/600","caption":"As-built comparison"},{"id":"northstar-p3","imageUrl":"https://picsum.photos/seed/northstar3/800/600","caption":"Earthworks monitoring"}]'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- faa_verifications
-- ---------------------------------------------------------------------------
insert into public.faa_verifications (id, pilot_id, pilot_name, certificate_type, certificate_number, status, submitted_at, verified_at, expires_at) values
  ('ver-005','plt-005','Tom Alvarez','FAA Part 107 Remote Pilot','4392001','pending',  '2026-06-06', null,        '2028-06-01'),
  ('ver-007','plt-007','James Okoro','FAA Part 107 Remote Pilot','5120433','pending',  '2026-06-04', null,        '2027-11-15'),
  ('ver-001','plt-001','Marcus Reed','FAA Part 107 Remote Pilot','3001882','verified', '2025-12-10', '2025-12-12','2027-12-10'),
  ('ver-002','plt-002','Elena Voss','FAA Part 107 + Thermography L1','2887341','verified','2025-11-02','2025-11-04','2027-11-02')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- reviews (rev-009 is the flagged spam example)
-- ---------------------------------------------------------------------------
insert into public.reviews (id, pilot_id, client_name, rating, text, tags, status, verified_job, created_at) values
  ('rev-001','plt-001','Jordan Pierce',5,'Marcus turned around our listing photos in under a day. The twilight shots booked us three showings in the first weekend.',ARRAY['quality','punctuality','communication'],'published',true,'2026-05-21'),
  ('rev-002','plt-001','Whitman Realty',5,'We use Skyline for every premium listing now. Reliable, professional, and the edits are consistently excellent.',ARRAY['professionalism','quality'],'published',true,'2026-04-30'),
  ('rev-003','plt-001','Dana L.',4,'Great imagery and easy to work with. Scheduling took a couple of emails but the result was worth it.',ARRAY['quality','value'],'published',false,'2026-03-18'),
  ('rev-004','plt-002','Summit Roofing',5,'Elena’s thermal report caught moisture intrusion two other inspectors missed. The documentation was insurance-ready.',ARRAY['quality','professionalism'],'published',true,'2026-05-10'),
  ('rev-005','plt-002','BrightSolar Co.',5,'Fast, thorough solar array audit across 40 rooftops. Clear deliverables and on time.',ARRAY['punctuality','communication'],'published',true,'2026-04-02'),
  ('rev-006','plt-004','Marisol & Ben',5,'The aerial footage of our wedding was breathtaking. Priya was unobtrusive and captured moments we’ll treasure.',ARRAY['quality','professionalism','communication'],'published',true,'2026-05-28'),
  ('rev-007','plt-003','Granite Builders',5,'Survey-grade accuracy that matched our ground control perfectly. Diego is our go-to for site progress mapping.',ARRAY['quality','value'],'published',true,'2026-05-15'),
  ('rev-008','plt-006','Coastal Homes',5,'Sarah’s twilight shoot was stunning and delivered next morning. Best real estate media we’ve commissioned.',ARRAY['quality','punctuality'],'published',true,'2026-06-01'),
  ('rev-009','plt-007','anon_user_88',1,'BUY CHEAP FOLLOWERS AND DRONE PARTS AT bit.ly/notreal — best prices guaranteed!!!',ARRAY[]::text[],'flagged',false,'2026-06-05')
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- quote_requests
-- ---------------------------------------------------------------------------
insert into public.quote_requests (id, pilot_id, client_name, client_email, job_type, location, budget_range, details, status, created_at) values
  ('qr-001','plt-001','Avery Stone','avery@stonerealty.com','real-estate','Austin, TX','$300 – $500','4,200 sq ft listing, need exterior aerials + twilight set by Friday.','responded','2026-06-07'),
  ('qr-002','plt-002','Foothills Property Mgmt','ops@foothillspm.com','roof-inspection','Boulder, CO','$250 – $400','Suspected hail damage on 6-unit complex, need report for insurance claim.','new','2026-06-08'),
  ('qr-003','plt-004','Harbor Events','book@harborevents.co','event-coverage','Malibu, CA','$800 – $1,200','Beach wedding, 3-hour coverage, highlight reel deliverable.','new','2026-06-09')
on conflict (id) do nothing;
