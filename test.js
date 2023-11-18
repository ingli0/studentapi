const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('/CRUD_APP'); // Your Node.js app

chai.use(chaiHttp);
const expect = chai.expect;

describe('API Endpoint Tests', () => {
  it('should return a 200 status code', (done) => {
    chai.request(app)
      .get('/api/some_endpoint')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
