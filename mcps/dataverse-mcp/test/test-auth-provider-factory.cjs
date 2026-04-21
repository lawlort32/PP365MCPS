const test = require('node:test');
const assert = require('node:assert/strict');

test('createAuthProvider defaults to client secret mode', async () => {
  const { createAuthProvider } = await import('../build/auth/create-auth-provider.js');

  const provider = createAuthProvider({
    tenantId: 'tenant-id',
    clientId: 'client-id',
    clientSecret: 'secret'
  });

  assert.equal(provider.constructor.name, 'ClientSecretAuthProvider');
});

test('createAuthProvider returns OBO provider when mode is obo', async () => {
  const { createAuthProvider } = await import('../build/auth/create-auth-provider.js');

  const provider = createAuthProvider({
    mode: 'obo',
    tenantId: 'tenant-id',
    clientId: 'client-id',
    clientSecret: 'secret'
  });

  assert.equal(provider.constructor.name, 'OboAuthProvider');
});

test('createAuthProvider validates client secret requirement for client_secret mode', async () => {
  const { createAuthProvider } = await import('../build/auth/create-auth-provider.js');

  assert.throws(
    () => {
      createAuthProvider({
        mode: 'client_secret',
        tenantId: 'tenant-id',
        clientId: 'client-id'
      });
    },
    /DATAVERSE_CLIENT_SECRET is required when DATAVERSE_AUTH_MODE=client_secret/
  );
});

test('public client scaffold throws clear implementation guidance', async () => {
  const { createAuthProvider } = await import('../build/auth/create-auth-provider.js');

  const provider = createAuthProvider({
    mode: 'public_client',
    tenantId: 'tenant-id',
    clientId: 'client-id'
  });

  await assert.rejects(
    provider.getAccessToken('https://example.crm.dynamics.com/.default'),
    /Public client auth mode is a scaffold/
  );
});

test('broker scaffold throws clear implementation guidance', async () => {
  const { createAuthProvider } = await import('../build/auth/create-auth-provider.js');

  const provider = createAuthProvider({
    mode: 'broker',
    tenantId: 'tenant-id',
    clientId: 'client-id'
  });

  await assert.rejects(
    provider.getAccessToken('https://example.crm.dynamics.com/.default'),
    /Broker auth mode is a scaffold/
  );
});

test('OBO provider requires incoming assertion token', async () => {
  const { createAuthProvider } = await import('../build/auth/create-auth-provider.js');

  const provider = createAuthProvider({
    mode: 'obo',
    tenantId: 'tenant-id',
    clientId: 'client-id',
    clientSecret: 'secret'
  });

  await assert.rejects(
    provider.getAccessToken('https://example.crm.dynamics.com/.default'),
    /DATAVERSE_OBO_ASSERTION/
  );
});
