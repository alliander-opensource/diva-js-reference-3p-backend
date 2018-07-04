const { expect } = require('../common/test-utils');
const { getEans } = require('./ean-issue');

describe('EAN issue', () => {
  it('should return EANS on getEans call', () =>
    getEans('this is a street 1', '1234ab')
      .then((eanInfo) => {
        expect(eanInfo[0]).to.equal('871687460010311937');
        expect(eanInfo[1]).to.equal('871689260010711663');
      }),
  );

  it('should return no gas EAN if there is no gas EAN', () =>
    getEans('this is a street 28', '6515bj')
      .then((eanInfo) => {
        expect(eanInfo[0]).to.be.a('string');
        expect(eanInfo[1]).to.equal('Unavailable');
      }),
  );
});
