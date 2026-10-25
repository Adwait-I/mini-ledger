import request from 'supertest';
import { app } from '../src/app';
import { prisma } from '../src/utils/prisma';

describe('Summary & Loans API Integration Tests', () => {
  let authToken: string;
  let userId: string;
  const testPhone = '+19999999999';

  beforeAll(async () => {
    // Clean up test data if exists
    await prisma.loanEntry.deleteMany({
      where: { user: { phoneNumber: testPhone } },
    });
    await prisma.user.deleteMany({
      where: { phoneNumber: testPhone },
    });

    // 1. Request OTP
    await request(app)
      .post('/api/auth/request-otp')
      .send({ phoneNumber: testPhone })
      .expect(200);

    // 2. Verify with master dev OTP
    const verifyRes = await request(app)
      .post('/api/auth/verify-otp')
      .send({ phoneNumber: testPhone, otp: '123456' })
      .expect(200);

    authToken = verifyRes.body.token;
    userId = verifyRes.body.user.id;
  });

  afterAll(async () => {
    // Clean up database
    await prisma.loanEntry.deleteMany({
      where: { userId },
    });
    await prisma.user.deleteMany({
      where: { id: userId },
    });
    await prisma.$disconnect();
  });

  it('should return 401 when fetching summary without authentication', async () => {
    const res = await request(app).get('/api/summary').expect(401);
    expect(res.body.error).toContain('Authentication required');
  });

  it('should return 0s for a new user summary', async () => {
    const res = await request(app)
      .get('/api/summary')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(res.body).toEqual({
      total_lent: 0,
      total_repaid: 0,
      overdue_amount: 0,
    });
  });

  it('should create loan entries, mark one repaid, and compute summary correctly', async () => {
    // Add loan 1: Overdue loan (Due 5 days ago)
    const pastDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString();
    const loan1Res = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        friendName: 'Alex Doe',
        amount: 150,
        dueDate: pastDate,
      })
      .expect(201);

    expect(loan1Res.body.loan.friendName).toBe('Alex Doe');
    expect(loan1Res.body.loan.isOverdue).toBe(true);

    // Add loan 2: Future pending loan (Due in 10 days)
    const futureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString();
    const loan2Res = await request(app)
      .post('/api/loans')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        friendName: 'Sarah Smith',
        amount: 250,
        dueDate: futureDate,
      })
      .expect(201);

    const loan2Id = loan2Res.body.loan.id;

    // Check summary before repaying loan 2
    let summaryRes = await request(app)
      .get('/api/summary')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(summaryRes.body.total_lent).toBe(400); // 150 + 250
    expect(summaryRes.body.total_repaid).toBe(0);
    expect(summaryRes.body.overdue_amount).toBe(150); // only loan 1

    // Mark loan 2 as repaid
    await request(app)
      .put(`/api/loans/${loan2Id}/repay`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Check summary after repaying loan 2
    summaryRes = await request(app)
      .get('/api/summary')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(summaryRes.body.total_lent).toBe(400);
    expect(summaryRes.body.total_repaid).toBe(250);
    expect(summaryRes.body.overdue_amount).toBe(150);
  });
});
