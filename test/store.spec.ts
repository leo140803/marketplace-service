import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('StoreController (e2e)', () => {
  let app: INestApplication;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    testService = app.get(TestService);
  });

  describe('GET /api/store', () => {
    it('should found!', async () => {
      const response = await request(app.getHttpServer()).get('/api/store');
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.errors).toBeUndefined();
    });
  });

  describe('GET /api/store/{id}', () => {
    beforeEach(async () => {
      await testService.deleteStore();
    });

    afterAll(async () => {
      await testService.deleteStore();
    });
    it('should not found!', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/store/a8f0716e-397e-436f-8f8e-73f3e76dd361',
      );
      expect(response.status).toBe(404);
      expect(response.body.data).toBeUndefined();
      expect(response.body.errors).toBeDefined();
    });

    it('should found!', async () => {
      const responsePostData = await request(app.getHttpServer())
        .post('/api/store')
        .send({
          store_name: 'store_testing',
          longitude: 0,
          latitude: 0,
        });
      const response = await request(app.getHttpServer()).get(
        `/api/store/${responsePostData.body.data.store_id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.errors).toBeUndefined();
    });
  });

  describe('POST /api/store', () => {
    beforeEach(async () => {
      await testService.deleteStore();
    });

    afterAll(async () => {
      await testService.deleteStore();
    });
    it('should be success', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/store')
        .send({
          store_name: 'store_testing',
          longitude: 0,
          latitude: 0,
        });
      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.errors).toBeUndefined();
    });
    it('should be rejected because name length is zero', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/store')
        .send({
          store_name: '',
          longitude: 0,
          latitude: 0,
        });
      expect(response.status).toBe(400);
      expect(response.body.data).toBeUndefined();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe(
        'String must contain at least 1 character(s)',
      );
    });

    it('should be rejected because longitude more than 180', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/store')
        .send({
          store_name: 'store_testing',
          longitude: 900,
          latitude: 0,
        });
      expect(response.status).toBe(400);
      expect(response.body.data).toBeUndefined();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe(
        'Number must be less than or equal to 180',
      );
    });

    it('should be rejected because latitude less than -90', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/store')
        .send({
          store_name: 'store_testing',
          longitude: 0,
          latitude: -100,
        });
      expect(response.status).toBe(400);
      expect(response.body.data).toBeUndefined();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe(
        'Number must be greater than or equal to -90',
      );
    });
  });

  describe('DELETE /api/store/{id}', () => {
    beforeEach(async () => {
      await testService.deleteStore();
    });

    afterAll(async () => {
      await testService.deleteStore();
    });
    it('should not found!', async () => {
      const response = await request(app.getHttpServer()).delete(
        '/api/store/a8f0716e-397e-436f-8f8e-73f3e76dd361',
      );
      expect(response.status).toBe(404);
      expect(response.body.data).toBeUndefined();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Store not found!');
    });

    it('should sucess', async () => {
      const responsePostData = await request(app.getHttpServer())
        .post('/api/store')
        .send({
          store_name: 'store_testing',
          longitude: 0,
          latitude: 0,
        });
      const response = await request(app.getHttpServer()).delete(
        `/api/store/${responsePostData.body.data.store_id}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.store_id).toBe(
        responsePostData.body.data.store_id,
      );
    });
  });

  describe('PATCH /api/store/{id}', () => {
    beforeEach(async () => {
      await testService.deleteStore();
    });

    afterAll(async () => {
      await testService.deleteStore();
    });
    it('should not found', async () => {
      const response = await request(app.getHttpServer())
        .patch('/api/store/a8f0716e-397e-436f-8f8e-73f3e76dd361')
        .send({
          store_name: 'store_testing',
          longitude: 0,
          latitude: 0,
        });
      expect(response.status).toBe(404);
      expect(response.body.data).toBeUndefined();
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors).toBe('Store not found!');
    });

    it('should validation error', async () => {
      const responsePostData = await request(app.getHttpServer())
        .post('/api/store')
        .send({
          store_name: 'store_testing',
          longitude: 0,
          latitude: 0,
        });
      const response = await request(app.getHttpServer())
        .patch(`/api/store/${responsePostData.body.data.store_id}`)
        .send({
          store_name: 'store_testing',
          longitude: 200,
          latitude: 200,
        });
      expect(response.status).toBe(400);
      expect(response.body.data).toBeUndefined();
      expect(response.body.errors).toBeDefined();
    });

    it('Update name success', async () => {
      const responsePostData = await request(app.getHttpServer())
        .post('/api/store')
        .send({
          store_name: 'store_testing',
          longitude: 0,
          latitude: 0,
        });
      const response = await request(app.getHttpServer())
        .patch(`/api/store/${responsePostData.body.data.store_id}`)
        .send({
          store_name: 'store_testing2',
          longitude: 0,
          latitude: 0,
        });
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.store_name).toBe('store_testing2');
    });

    it('Update longitude success', async () => {
      const responsePostData = await request(app.getHttpServer())
        .post('/api/store')
        .send({
          store_name: 'store_testing',
          longitude: 0,
          latitude: 0,
        });
      const response = await request(app.getHttpServer())
        .patch(`/api/store/${responsePostData.body.data.store_id}`)
        .send({
          store_name: 'store_testing',
          longitude: 90,
          latitude: 0,
        });
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.longitude).toBe(90);
    });

    it('Update latitude success', async () => {
      const responsePostData = await request(app.getHttpServer())
        .post('/api/store')
        .send({
          store_name: 'store_testing',
          longitude: 0,
          latitude: 0,
        });
      const response = await request(app.getHttpServer())
        .patch(`/api/store/${responsePostData.body.data.store_id}`)
        .send({
          store_name: 'store_testing',
          longitude: 0,
          latitude: 50,
        });
      expect(response.status).toBe(200);
      expect(response.body.data).toBeDefined();
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.latitude).toBe(50);
    });
  });
});
