const request = require('supertest');
const { app } = require('../server');
const jwt = require('jsonwebtoken');
const config = require('../config');
const mockingoose = require('mockingoose');
const Article = require('../api/articles/articles.schema');
const articlesService = require('../api/articles/articles.service');

describe('Articles API', () => {
  let token;
  const ARTICLE_ID = '60d21b4667d0d8992e610c85'; // Exemple d'ID d'article
  const USER_ID = '60d21b4667d0d8992e610c84'; // Exemple d'ID utilisateur
  const MOCK_ARTICLE = {
    _id: ARTICLE_ID,
    title: 'Test Article',
    content: 'Test Content',
    user: USER_ID,
    status: 'published',
  };
  const MOCK_ARTICLE_UPDATED = {
    _id: ARTICLE_ID,
    title: 'Updated Article',
    content: 'Updated Content',
    user: USER_ID,
    status: 'draft',
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID, role: 'admin' }, config.secretJwtToken);
    mockingoose(Article).toReturn(MOCK_ARTICLE, 'findOne');
    mockingoose(Article).toReturn(MOCK_ARTICLE, 'findByIdAndUpdate');
    mockingoose(Article).toReturn({}, 'deleteOne');
  });

  test('[Articles] Create Article', async () => {
    const res = await request(app)
      .post('/api/articles')
      .set('x-access-token', token)
      .send(MOCK_ARTICLE);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_ARTICLE.title);
  });

  test('[Articles] Update Article', async () => {
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .set('x-access-token', token)
      .send(MOCK_ARTICLE_UPDATED);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_ARTICLE_UPDATED.title);
  });

  test('[Articles] Delete Article', async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set('x-access-token', token);
    expect(res.status).toBe(204);
  });

  test('[Articles] Service getAll Called', async () => {
    const spy = jest
      .spyOn(articlesService, 'getAll')
      .mockImplementation(() => Promise.resolve([MOCK_ARTICLE]));
    await request(app).get('/api/articles').set('x-access-token', token);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveReturnedWith(Promise.resolve([MOCK_ARTICLE]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});