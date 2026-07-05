import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Business Stages
  const businessStages = [
    { id: 1, name: 'Idea', description: 'Initial concept or product definition' },
    { id: 2, name: 'MVP', description: 'Minimum Viable Product built and being tested' },
    { id: 3, name: 'Early Traction', description: 'Active users and initial revenue generation' },
    { id: 4, name: 'Scaling', description: 'Product-market fit achieved, expanding customer base' },
  ];

  for (const stage of businessStages) {
    await prisma.businessStage.upsert({
      where: { id: stage.id },
      update: { name: stage.name, description: stage.description },
      create: stage,
    });
  }
  console.log('Business stages seeded.');

  // 2. Create Funding Stages
  const fundingStages = [
    { id: 1, name: 'Bootstrapped', description: 'Self-funded by founders' },
    { id: 2, name: 'Pre-seed', description: 'Early funding to refine the MVP' },
    { id: 3, name: 'Seed', description: 'Funding to scale early operations and prove model' },
    { id: 4, name: 'Series A', description: 'Institutional venture capital for growth' },
    { id: 5, name: 'Series B+', description: 'Later-stage institutional rounds' },
  ];

  for (const stage of fundingStages) {
    await prisma.fundingStage.upsert({
      where: { id: stage.id },
      update: { name: stage.name, description: stage.description },
      create: stage,
    });
  }
  console.log('Funding stages seeded.');

  // 3. Create Permissions
  const permissions = [
    { name: 'read:profiles', description: 'Allows viewing profiles' },
    { name: 'write:profiles', description: 'Allows creating/modifying profiles' },
    { name: 'read:assessments', description: 'Allows viewing readiness assessments' },
    { name: 'write:assessments', description: 'Allows filling and submitting assessments' },
    { name: 'read:advisory', description: 'Allows viewing advisor listings and meetings' },
    { name: 'write:advisory', description: 'Allows booking meetings and updating progress' },
    { name: 'read:documents', description: 'Allows viewing and downloading documents' },
    { name: 'write:documents', description: 'Allows uploading and sharing documents' },
    { name: 'admin:all', description: 'Full administrative override access' },
  ];

  const dbPermissions: Record<string, any> = {};
  for (const perm of permissions) {
    const dbPerm = await prisma.permission.upsert({
      where: { name: perm.name },
      update: { description: perm.description },
      create: perm,
    });
    dbPermissions[perm.name] = dbPerm;
  }
  console.log('Permissions seeded.');

  // 4. Create Roles
  const roles = [
    { name: 'Super Admin', description: 'Platform owner with full system access' },
    { name: 'Admin', description: 'Standard platform administrator' },
    { name: 'Founder', description: 'Startup founder and user' },
    { name: 'MSME', description: 'MSME business owner and user' },
    { name: 'Advisor', description: 'Mentor, consultant, or advisor' },
  ];

  const dbRoles: Record<string, any> = {};
  for (const role of roles) {
    const dbRole = await prisma.role.upsert({
      where: { name: role.name },
      update: { description: role.description },
      create: role,
    });
    dbRoles[role.name] = dbRole;
  }
  console.log('Roles seeded.');

  // 5. Connect Role Permissions
  // Super Admin gets all permissions
  for (const permKey of Object.keys(dbPermissions)) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: dbRoles['Super Admin'].id,
          permissionId: dbPermissions[permKey].id,
        },
      },
      update: {},
      create: {
        roleId: dbRoles['Super Admin'].id,
        permissionId: dbPermissions[permKey].id,
      },
    });
  }

  // Admin gets most permissions except admin:all (they are standard admin)
  const adminPerms = [
    'read:profiles', 'write:profiles',
    'read:assessments', 'read:advisory', 'write:advisory',
    'read:documents', 'write:documents'
  ];
  for (const permKey of adminPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: dbRoles['Admin'].id,
          permissionId: dbPermissions[permKey].id,
        },
      },
      update: {},
      create: {
        roleId: dbRoles['Admin'].id,
        permissionId: dbPermissions[permKey].id,
      },
    });
  }

  // Founder permissions
  const founderPerms = [
    'read:profiles', 'write:profiles',
    'read:assessments', 'write:assessments',
    'read:advisory', 'write:advisory',
    'read:documents', 'write:documents'
  ];
  for (const permKey of founderPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: dbRoles['Founder'].id,
          permissionId: dbPermissions[permKey].id,
        },
      },
      update: {},
      create: {
        roleId: dbRoles['Founder'].id,
        permissionId: dbPermissions[permKey].id,
      },
    });
  }

  // MSME permissions (same as founder for standard things)
  const msmePerms = [
    'read:profiles', 'write:profiles',
    'read:assessments', 'write:assessments',
    'read:advisory', 'write:advisory',
    'read:documents', 'write:documents'
  ];
  for (const permKey of msmePerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: dbRoles['MSME'].id,
          permissionId: dbPermissions[permKey].id,
        },
      },
      update: {},
      create: {
        roleId: dbRoles['MSME'].id,
        permissionId: dbPermissions[permKey].id,
      },
    });
  }

  // Advisor permissions
  const advisorPerms = [
    'read:profiles',
    'read:assessments',
    'read:advisory', 'write:advisory',
    'read:documents', 'write:documents'
  ];
  for (const permKey of advisorPerms) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: dbRoles['Advisor'].id,
          permissionId: dbPermissions[permKey].id,
        },
      },
      update: {},
      create: {
        roleId: dbRoles['Advisor'].id,
        permissionId: dbPermissions[permKey].id,
      },
    });
  }

  console.log('RolePermissions configured.');
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
