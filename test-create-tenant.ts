import { TenantService } from './src/services/tenant/tenant.service';

async function main() {
  try {
    console.log('Testing TenantService.createTenant...');
    const result = await TenantService.createTenant(
      {
        name: 'Test Tenant ' + Date.now(),
        domain: 'test-' + Date.now() + '.com',
        contactEmail: 'test@example.com',
        timezone: 'UTC',
        currency: 'USD',
        admin: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin-' + Date.now() + '@example.com',
        },
      },
      'system-test-user-id',
    );
    console.log('Success:', result.id);
  } catch (e: unknown) {
    console.error('Error occurred:');
    console.error((e as Error).message);
    console.error((e as Error).stack);
  }
}

main().catch(console.error);
