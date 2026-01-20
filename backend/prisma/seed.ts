import { PrismaClient, Role, Priority } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/**
 * Database Seed Script
 * 
 * Populates the database with initial test data.
 * Run with: npm run prisma:seed
 */
async function main() {
    console.log('🌱 Seeding database...');

    // 1. Create test campus
    const campus = await prisma.campus.upsert({
        where: { subdomain: 'demo' },
        update: {},
        create: {
            name: 'Demo University',
            subdomain: 'demo',
            logoUrl: 'https://via.placeholder.com/150',
            settings: {
                timezone: 'Asia/Kolkata',
                workingHours: { start: '09:00', end: '18:00' },
            },
            isActive: true,
            subscriptionTier: 'FREE',
        },
    });

    console.log(`✅ Created campus: ${campus.name}`);

    // 2. Create test users
    const passwordHash = await bcrypt.hash('password123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@demo.edu' },
        update: {},
        create: {
            email: 'admin@demo.edu',
            passwordHash,
            firstName: 'Admin',
            lastName: 'User',
            role: Role.ADMIN,
            campusId: campus.id,
            isActive: true,
            emailVerified: true,
        },
    });

    const staff = await prisma.user.upsert({
        where: { email: 'staff@demo.edu' },
        update: {},
        create: {
            email: 'staff@demo.edu',
            passwordHash,
            firstName: 'Staff',
            lastName: 'Member',
            role: Role.STAFF,
            department: 'Maintenance',
            campusId: campus.id,
            isActive: true,
            emailVerified: true,
        },
    });

    const student = await prisma.user.upsert({
        where: { email: 'student@demo.edu' },
        update: {},
        create: {
            email: 'student@demo.edu',
            passwordHash,
            firstName: 'John',
            lastName: 'Doe',
            role: Role.STUDENT,
            studentId: 'STU001',
            campusId: campus.id,
            isActive: true,
            emailVerified: true,
        },
    });

    console.log(`✅ Created users: Admin, Staff, Student`);

    // 3. Create categories with SLA configs
    const electrical = await prisma.category.upsert({
        where: {
            campusId_name: {
                campusId: campus.id,
                name: 'Electrical',
            },
        },
        update: {},
        create: {
            name: 'Electrical',
            description: 'Electrical systems and power issues',
            icon: '⚡',
            color: '#FCD34D',
            campusId: campus.id,
            slaConfig: {
                CRITICAL: { responseMinutes: 60, resolutionHours: 4 },
                HIGH: { responseMinutes: 240, resolutionHours: 24 },
                MEDIUM: { responseMinutes: 1440, resolutionHours: 72 },
                LOW: { responseMinutes: 2880, resolutionHours: 168 },
            },
        },
    });

    const plumbing = await prisma.category.upsert({
        where: {
            campusId_name: {
                campusId: campus.id,
                name: 'Plumbing',
            },
        },
        update: {},
        create: {
            name: 'Plumbing',
            description: 'Water supply and drainage issues',
            icon: '🚰',
            color: '#60A5FA',
            campusId: campus.id,
            slaConfig: {
                CRITICAL: { responseMinutes: 60, resolutionHours: 4 },
                HIGH: { responseMinutes: 240, resolutionHours: 24 },
                MEDIUM: { responseMinutes: 1440, resolutionHours: 72 },
                LOW: { responseMinutes: 2880, resolutionHours: 168 },
            },
        },
    });

    console.log(`✅ Created categories: Electrical, Plumbing`);

    // 4. Create sample issues
    const now = new Date();

    const issue1 = await prisma.issue.create({
        data: {
            campusId: campus.id,
            issueNumber: 1,
            categoryId: electrical.id,
            createdBy: student.id,
            title: 'AC not working in Lab 3',
            description: 'The air conditioning unit in Lab 3 has stopped working. Room temperature is rising.',
            location: 'Lab 3, Building A',
            priority: Priority.HIGH,
            status: 'SUBMITTED',
            slaResponseDeadline: new Date(now.getTime() + 240 * 60 * 1000), // 4 hours
            slaResolutionDeadline: new Date(now.getTime() + 24 * 60 * 60 * 1000), // 24 hours
        },
    });

    const issue2 = await prisma.issue.create({
        data: {
            campusId: campus.id,
            issueNumber: 2,
            categoryId: plumbing.id,
            createdBy: student.id,
            assignedTo: staff.id,
            title: 'Leaking faucet in Washroom',
            description: 'Water is continuously dripping from the faucet in the second floor washroom.',
            location: 'Washroom, Floor 2, Building B',
            priority: Priority.MEDIUM,
            status: 'ASSIGNED',
            assignedAt: now,
            slaResponseDeadline: new Date(now.getTime() - 60 * 60 * 1000), // Already breached
            slaResolutionDeadline: new Date(now.getTime() + 48 * 60 * 60 * 1000), // 48 hours
        },
    });

    console.log(`✅ Created sample issues: #${issue1.issueNumber}, #${issue2.issueNumber}`);

    // 5. Create assignment record
    await prisma.assignment.create({
        data: {
            issueId: issue2.id,
            assignedTo: staff.id,
            assignedBy: admin.id,
            notes: 'Assigned to staff for inspection',
        },
    });

    console.log(`✅ Created assignment record`);

    console.log('');
    console.log('🎉 Seeding completed successfully!');
    console.log('');
    console.log('Test credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:   admin@demo.edu / password123');
    console.log('Staff:   staff@demo.edu / password123');
    console.log('Student: student@demo.edu / password123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
