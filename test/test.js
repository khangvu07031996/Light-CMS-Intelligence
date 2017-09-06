const supertest = require('supertest');
const should = require('should');

// This agent refers to PORT where program is runninng.

const server = supertest.agent('http://localhost:3000');

describe('Test restful API', () => {
  it('add article', (done) => {
    server
      .post('/api/v1/articles')
      .send({
        headline: 'khangvu',
        section: 'khang',
        premble: '123',
        body: '123',
        images: '123.png',
        author: 'asdas',
        tags: 'asdasd',
        widgets: 'asda',
        date_created: '2017-08-14T06:47:02.275Z',
        publishDate: '2017-08-14T06:47:02.275Z',
        status: 'published',
        CreateBy: 'khangvu' })
      .expect('Content-type', /json/)
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
  it('update an article', (done) => {
    server
      .put('/api/v1/articles/59a3dc0484f52626a826ee0c')
      .set('Acept', 'application/x-ww-form-urlencoded')
      .send({
        headline: 'khang vu123123123213123123',
        section: 'khang213213123',
        premble: '123',
        body: '123',
        images: '123.png',
        author: 'asdas',
        tags: 'asdasd',
        widgets: 'asda',
        date_created: '2017-08-14T06:47:02.275Z',
        publishDate: '2017-08-14T06:47:02.275Z',
        status: 'published',
        CreateBy: 'khangvu' })
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
  it('delete an article', (done) => {
    server
      .delete('/api/v1/articles/599b9cf72f4b372f386d37c5')
      .expect(200)
      .end((err, res) => {
        done();
      });
  });
});
