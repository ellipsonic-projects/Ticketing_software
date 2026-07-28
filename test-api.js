async function main() {
  console.log('Logging in to get token...');
  const loginRes = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@elipsonics.com', password: 'Password123!' }),
  });

  const loginData = await loginRes.json();
  const token = loginData.accessToken;

  if (!token) {
    console.error('Failed to get token', loginData);
    return;
  }

  console.log('Got token. Calling create tenant...');
  const res = await fetch('http://localhost:3000/api/v1/platform/tenants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'Test Tenant API',
      domain: 'testapi-' + Date.now() + '.com',
      contactEmail: 'api@example.com',
      timezone: 'UTC',
      currency: 'USD',
      admin: {
        firstName: 'Api',
        lastName: 'User',
        email: 'api-' + Date.now() + '@example.com',
        temporaryPassword: 'Password123!',
      },
    }),
  });

  const status = res.status;
  const text = await res.text();
  console.log(`Status: ${status}`);
  console.log(`Response: ${text}`);
}

main().catch(console.error);
