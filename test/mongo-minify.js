
/* test dependencies */

var minify = require('..')
  , expect = require('expect.js');

/* tests */

describe('mongo-minify', function(){

  it('ignores updates without modifiers', function(){
    var obj = { a: 'b' };
    var ret = minify(obj, { a: 0 });
    expect(ret).to.eql(obj);
  });

  describe('inclusion', function(){
    it('simple', function(){
      var obj = { $set: { a: 'b', c: 'd' } };
      var ret = minify(obj, { a: 1 });
      expect(ret).to.eql({ $set: { a: 'b' } });
    });

    it('leaves intact but clones', function(){
      var obj = { $set: { a: 'b', c: 'd' } };
      var ret = minify(obj, { a: 1, c: 1 });
      expect(ret).not.to.be(obj);
      expect(ret).to.eql(obj);
    });

    it('nested', function(){
      var qry = { $set: { 'a.b': 1, c: 'd' } };
      expect(minify(qry, { a: 1 })).to.eql({ $set: { 'a.b': 1 } });
    });

    it('nested include', function(){
      var qry = { $set: { 'a.b.c': 1, 'a.b.d': 'd' } };
      expect(minify(qry, { 'a.b.c': 1 })).to.eql({ $set: { 'a.b.c': 1 } });
    });

    it('multiple', function(){
      var qry = { $set: { 'a.b': 'a', c: 'd' }, $push: { 'a.c': 'd', e: 'f' } };
      var res = { $set: { 'a.b': 'a', c: 'd' }, $push: { 'a.c': 'd' } };
      expect(minify(qry, { a: 1, c: 1 })).to.eql(res);
    });

    it('multiple includes', function(){
      var qry = { $set: { a: 'b', c: 'd', e: 'f' } };
      expect(minify(qry, { a: 1, c: 1 })).to.eql({ $set: { a: 'b', c: 'd' } });
    });

    it('removes ops', function(){
      var qry = { $push: { hello: 'w' }, $set: { a: 'b' } };
      expect(minify(qry, { hello: 1 })).to.eql({ $push: { hello: 'w' } });
    });

    it('removes everything', function(){
      var qry = { $set: { a: 'b' }, $unset: { c: 1 } };
      expect(minify(qry, { d: 1 })).to.eql({});
    });
  });

  describe('exclusion', function(){
    it('simple', function(){
      var qry = { $set: { a: 'b', c: 'd' } };
      expect(minify(qry, { c: 0 })).to.eql({ $set: { a: 'b' } });
    });

    it('nested', function(){
      var qry = { $set: { 'a.b': 1, 'c.d': 1 } };
      expect(minify(qry, { c: 0 })).to.eql({ $set: { 'a.b': 1 } });
    });

    it('nested exclude', function(){
      var qry = { $set: { 'a.b.c.d': 1, 'a.b.d': 2, 'a.c': 3 } };
      expect(minify(qry, { 'a.b': 0 })).to.eql({ $set: { 'a.c': 3 } });
    });

    it('removes ops', function(){
      var qry = { $set: { a: 'b' }, $push: { c: 'd' } };
      expect(minify(qry, { a: 0 })).to.eql({ $push: { c: 'd' } });
    });

    it('removes everything', function() {
      var qry = { $set: { a: 'b' }, $push: { c: 'd' } };
      expect(minify(qry, { a: 0, c: 0 })).to.eql({});
    });
  });

});
