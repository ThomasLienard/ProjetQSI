BEGIN;

INSERT INTO users (
  id,
  email,
  password,
  "firstName",
  "lastName",
  role,
  "isActive",
  "phoneNumber",
  address
) VALUES
  (
    1,
    'alice@example.com',
    'dev-password',
    'Alice',
    'Martin',
    'user',
    true,
    '0600000001',
    '1 rue de Paris'
  ),
  (
    2,
    'bob@example.com',
    'dev-password',
    'Bob',
    'Durand',
    'moderator',
    true,
    '0600000002',
    '2 rue de Lyon'
  )
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  password = EXCLUDED.password,
  "firstName" = EXCLUDED."firstName",
  "lastName" = EXCLUDED."lastName",
  role = EXCLUDED.role,
  "isActive" = EXCLUDED."isActive",
  "phoneNumber" = EXCLUDED."phoneNumber",
  address = EXCLUDED.address,
  "updatedAt" = NOW();

INSERT INTO campaigns (
  id,
  status,
  "creatorId"
) VALUES (
  1,
  'active',
  1
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  "creatorId" = EXCLUDED."creatorId",
  "updatedAt" = NOW();

INSERT INTO contributions (
  id,
  amount,
  status,
  message,
  "isAnonymous",
  "userId",
  "campaignId",
  "createdAt",
  "updatedAt"
) VALUES
  (
    1,
    25.00,
    'completed',
    'Premiere contribution de test',
    false,
    1,
    1,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    2,
    40.00,
    'pending',
    'Deuxieme contribution de test',
    true,
    1,
    1,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO UPDATE SET
  amount = EXCLUDED.amount,
  status = EXCLUDED.status,
  message = EXCLUDED.message,
  "isAnonymous" = EXCLUDED."isAnonymous",
  "userId" = EXCLUDED."userId",
  "campaignId" = EXCLUDED."campaignId",
  "updatedAt" = NOW();

INSERT INTO payments (
  id,
  amount,
  status,
  method,
  "stripePaymentIntentId",
  "stripeChargeId",
  "errorMessage",
  metadata,
  "contributionId",
  "createdAt",
  "updatedAt"
) VALUES
  (
    1,
    25.00,
    'succeeded',
    'card',
    'pi_test_1',
    'ch_test_1',
    NULL,
    '{"source":"seed-dev"}',
    1,
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '3 days'
  ),
  (
    2,
    40.00,
    'pending',
    'card',
    'pi_test_2',
    NULL,
    NULL,
    '{"source":"seed-dev"}',
    2,
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO UPDATE SET
  amount = EXCLUDED.amount,
  status = EXCLUDED.status,
  method = EXCLUDED.method,
  "stripePaymentIntentId" = EXCLUDED."stripePaymentIntentId",
  "stripeChargeId" = EXCLUDED."stripeChargeId",
  "errorMessage" = EXCLUDED."errorMessage",
  metadata = EXCLUDED.metadata,
  "contributionId" = EXCLUDED."contributionId",
  "updatedAt" = NOW();

COMMIT;
