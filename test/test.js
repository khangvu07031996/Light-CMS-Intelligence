const supertest = require('supertest');
const should = require('should');

// This agent refers to PORT where program is runninng.

const server = supertest.agent('http://localhost:3000');

// UNIT test begin

describe('Test restful API', () => {
  // #1 should return home page

  it('should return a 200 response', (done) => {
    server
      .get('/api/articles')
      .expect('Content-type', /json/)
      .expect(200) // THis is HTTP response
      .end((err, res) => {
      // HTTP status should be 200
        res.status.should.equal(200);
        done();
      });
  });
  it('test add article', (done) => {
    server
      .post('/api/articles')
      .send({
        headline: 'khang vu',
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
      .expect(201)
      .end((err, res) => {
        res.status.should.equal(500);
        done();
      });
  });
  it('should return 404', (done) => {
    server
      .get('/random')
      .expect(404)
      .end((err, res) => {
        res.status.should.equal(404);
        done();
      });
  });
});
