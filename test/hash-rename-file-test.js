var fs = require('fs');
var del = require('del');
var expect = require('chai').expect;
var hrf = require('../lib/hash-rename-file.js');

var tmpPath = 'test/tmp-result-res';
describe('hash-rename-file', function () {
  before(function () {
    del.sync(tmpPath);
    fs.mkdirSync(tmpPath);
  });

  it('hash normal file', function (done) {
    hrf('test/res/+(jpg|png)/*.*', tmpPath, function (err) {
      expect(err).not.exist;
      expect(fs.existsSync(tmpPath + '/jpg/180_4cec874.jpg')).to.be.ok;
      expect(fs.existsSync(tmpPath + '/png/buff_boom_1_c55af82.png')).to.be.ok;
      done();
    });
  });

  it('hash tp file', function (done) {
    hrf('test/res/tp/*.*', tmpPath, { type: 'tp' }, function (err) {
      expect(err).not.exist;
      expect(fs.existsSync(tmpPath + '/tp-game_195394a.plist')).to.be.ok;
      expect(fs.existsSync(tmpPath + '/tp-game_195394a.png')).to.be.ok;
      done();
    });
  });

  it('hash fnt file', function (done) {
    hrf('test/res/fnt/*.*', tmpPath, { type: 'fnt', base: 'test/res' }, function (err) {
      expect(err).not.exist;
      expect(fs.existsSync(tmpPath + '/fnt/beerUI_8276df4.fnt')).to.be.ok;
      expect(fs.existsSync(tmpPath + '/fnt/beerUI_8276df4.png')).to.be.ok;
      done();
    });
  });

  it('hash spine file', function (done) {
    hrf('test/res/spine/*.*', tmpPath, {
      type: 'spine', base: 'test/res'
      }, function(err) {
        expect(err).not.exist;
        expect(fs.existsSync(tmpPath + '/spine/boss2_5c892bd.atlas')).to.be.ok;
        expect(fs.existsSync(tmpPath + '/spine/boss2_5c892bd.png')).to.be.ok;
        expect(fs.existsSync(tmpPath + '/spine/boss2_5c892bd.json')).to.be.ok;
        done();
      });
  });
});