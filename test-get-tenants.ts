import { TenantService } from './src/services/tenant/tenant.service';

async function main() {
  try {
    const res = await TenantService.getTenants(1, 10, '');
    console.log('Success:', res);
  } catch (e) {
    console.error('Error:', e);
  }
}
main();
