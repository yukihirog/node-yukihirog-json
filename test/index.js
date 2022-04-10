const fs = require('fs');
const path = require('path');
const yukihirogJson = require('../index');


const sampleJSON = `{
  "hoge": "fuga",
  "foo": {
    "name": "foo",
    "bar": ["bar1", 2, "bar3"]
  }
}`;

const sampleJSON2 = `{
  "hoge": "merged",
  "bar": "merged"
}`;

const sampleData = JSON.parse(sampleJSON);
const sampleData2 = JSON.parse(sampleJSON2);

const mergedData = {
  "hoge": "merged",
  "foo": {
    "name": "foo",
    "bar": ["bar1", 2, "bar3"]
  },
  "bar": "merged"
};

const sampleRead = path.resolve(__dirname, './sample.read.json');
const sampleRead2 = path.resolve(__dirname, './sample.read2.json');

const sampleWrite = path.resolve(__dirname, './sample.write.json');
const sampleWrite2 = path.resolve(__dirname, './sample.write2.json');

const sampleNotJSON = path.resolve(__dirname, './sample.not.json');
const sampleNotExists = path.resolve(__dirname, './sample.notexists.json');



beforeEach(() => {
  if (fs.existsSync(sampleWrite)) {
    fs.rmSync(sampleWrite, { force: true });
  }

  if (fs.existsSync(sampleWrite2)) {
    fs.rmSync(sampleWrite2, { force: true });
  }
});

describe('import', () => {
  test('import', () => {
    expect(yukihirogJson).toBeDefined();
  });
});

describe('read', () => {
  test('read', (done) => {
    yukihirogJson.read(sampleRead)
      .then((result) => {
        expect(result).toEqual({
          path: sampleRead,
          data: sampleData,
          json: sampleJSON
        });
        done();
      })
      .catch((err) =>{
        done(err);
      })
    ;
  });

  test('read:options', (done) => {
    yukihirogJson.read(sampleRead, 'utf8')
      .then((result) => {
        expect(result).toEqual({
          path: sampleRead,
          data: sampleData,
          json: sampleJSON
        });
        done();
      })
      .catch((err) =>{
        done(err);
      })
    ;
  });

  test('read:options,callback', (done) => {
    yukihirogJson.read(sampleRead, 'utf8', (result) => {
      expect(result).toEqual({
        path: sampleRead,
        data: sampleData,
        json: sampleJSON
      });
      done();
    });
  });

  test('read:null,callback', (done) => {
    yukihirogJson.read(sampleRead, null, (result) => {
      expect(result).toEqual({
        path: sampleRead,
        data: sampleData,
        json: sampleJSON
      });
      done();
    });
  });

  test('read:callback', (done) => {
    yukihirogJson.read(sampleRead, (result) => {
      expect(result).toEqual({
        path: sampleRead,
        data: sampleData,
        json: sampleJSON
      });
      done();
    });
  });

  test('read:callback,null', (done) => {
    yukihirogJson.read(sampleRead, (result) => {
      expect(result).toEqual({
        path: sampleRead,
        data: sampleData,
        json: sampleJSON
      });
      done();
    }, null);
  });

  test('read:notJSON', (done) => {
    yukihirogJson.read(sampleNotJSON)
      .then(() => {
        done(new Error('not rejected'));
      })
      .catch((err) =>{
        done();
      })
    ;
  });

  test('read:reject', (done) => {
    yukihirogJson.read(sampleNotExists)
      .then(() => {
        done(new Error('not rejected'));
      })
      .catch((err) =>{
        done();
      })
    ;
  });
});

describe('readAll', () => {
  test('readAll', (done) => {
    yukihirogJson.readAll([sampleRead, { path: sampleRead2 }])
      .then((result) => {
        expect(result).toEqual([
          {
            path: sampleRead,
            data: sampleData,
            json: sampleJSON
          },
          {
            path: sampleRead2,
            data: sampleData2,
            json: sampleJSON2
          }
        ]);
        done();
      })
      .catch((err) =>{
        done(err);
      })
    ;
  });

  test('readAll:item.options', (done) => {
    yukihirogJson.readAll([sampleRead, { path: sampleRead2, options: { encoding: 'utf8' } }])
      .then((result) => {
        expect(result).toEqual([
          {
            path: sampleRead,
            data: sampleData,
            json: sampleJSON
          },
          {
            path: sampleRead2,
            data: sampleData2,
            json: sampleJSON2
          }
        ]);
        done();
      })
      .catch((err) =>{
        done(err);
      })
    ;
  });

  test('readAll:callback', (done) => {
    let count = 0;
    yukihirogJson.readAll([ sampleRead, { path: sampleRead2 }], (result) => {
      if (result.path === sampleRead) {
        expect(result).toEqual({
          path: sampleRead,
          data: sampleData,
          json: sampleJSON
        });
        count++;
      }
      if (result.path === sampleRead2) {
        expect(result).toEqual({
          path: sampleRead2,
          data: sampleData2,
          json: sampleJSON2
        });
        count++;
      }
      if (count >= 2) {
        done();
      }
    });
  });

  test('readAll:unit:callback', (done) => {
    yukihirogJson.readAll([
      sampleRead,
      {
        path: sampleRead2,
        callback: (result) => {
          expect(result).toEqual({
            path: sampleRead2,
            data: sampleData2,
            json: sampleJSON2
          });
          done();
        }
      }
    ]);
  });
});

describe('readMerge', () => {
  test('readMerge', (done) => {
    yukihirogJson.readMerge([sampleRead, { path: sampleRead2 }])
      .then((result) => {
        expect(result).toEqual(
          {
            path: [sampleRead, sampleRead2],
            data: mergedData,
            json: [sampleJSON, sampleJSON2]
          }
        );
        done();
      })
      .catch((err) =>{
        done(err);
      })
    ;
  });

  test('readMerge:reject', (done) => {
    yukihirogJson.readMerge([sampleRead, { path: sampleNotExists }])
      .then(() => {
        done(new Error('not rejected'));
      })
      .catch(() =>{
        done();
      })
    ;
  });
});

describe('readSync', () => {
  test('readSync', () => {
    expect(yukihirogJson.readSync(sampleRead)).toEqual(sampleData);
  });
});

describe('readAllSync', () => {
  test('readAllSync', () => {
    expect(yukihirogJson.readAllSync([sampleRead, { path: sampleRead2 }])).toEqual([sampleData, sampleData2]);
  });
});

describe('readMergeSync', () => {
  test('readMergeSync', () => {
    expect(yukihirogJson.readMergeSync([sampleRead, { path: sampleRead2, options: 'utf8' }])).toEqual(mergedData);
  });
});

describe('write', () => {
  test('write', (done) => {
    yukihirogJson.write(sampleWrite, sampleData)
      .then((result) => {
        expect(result).toEqual({
          path: sampleWrite,
          data: sampleData,
          json: JSON.stringify(sampleData)
        });
        expect(yukihirogJson.readSync(sampleWrite)).toEqual(sampleData);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  test('write:options', (done) => {
    yukihirogJson.write(sampleWrite, sampleData, 'utf8')
      .then((result) => {
        expect(result).toEqual({
          path: sampleWrite,
          data: sampleData,
          json: JSON.stringify(sampleData)
        });
        expect(yukihirogJson.readSync(sampleWrite)).toEqual(sampleData);
        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  test('write:options,callback', (done) => {
    yukihirogJson.write(sampleWrite, sampleData, 'utf8', (result) => {
      expect(result).toEqual({
        path: sampleWrite,
        data: sampleData,
        json: JSON.stringify(sampleData)
      });
      expect(yukihirogJson.readSync(sampleWrite)).toEqual(sampleData);
      done();
    });
  });

  test('write:callback', (done) => {
    yukihirogJson.write(sampleWrite, sampleData, (result) => {
      expect(result).toEqual({
        path: sampleWrite,
        data: sampleData,
        json: JSON.stringify(sampleData)
      });
      expect(yukihirogJson.readSync(sampleWrite)).toEqual(sampleData);
      done();
    });
  });

  test('write:cyclicError', (done) => {
    let data = {};
    data.data = data;
    yukihirogJson.write(sampleWrite, data)
      .then(() => {
        done(new Error('not rejected'));
      })
      .catch((err) => {
        done();
      })
    ;
  });

  test('write:reject', (done) => {
    yukihirogJson.write(sampleWrite, sampleData, { flag: 'r' })
      .then(() => {
        done(new Error('not rejected'));
      })
      .catch(() => {
        done();
      })
    ;
  });
});

describe('writeAll', () => {
  test('writeAll', (done) => {
    yukihirogJson.writeAll([{ path: sampleWrite, data: sampleData }, { path: sampleWrite2, data: sampleData2, options: { encoding: 'utf8' } }])
      .then((results) => {
        results.forEach((result) => {
          if (result.path === sampleWrite) {
            expect(result).toEqual({
              path: sampleWrite,
              data: sampleData,
              json: JSON.stringify(sampleData)
            });
            expect(yukihirogJson.readSync(sampleWrite)).toEqual(sampleData);
          }

          if (result.path === sampleWrite2) {
            expect(result).toEqual({
              path: sampleWrite2,
              data: sampleData2,
              json: JSON.stringify(sampleData2)
            });
            expect(yukihirogJson.readSync(sampleWrite2)).toEqual(sampleData2);
          }
        });

        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  test('writeAll:options', (done) => {
    yukihirogJson.writeAll([{ path: sampleWrite, data: sampleData }, { path: sampleWrite2, data: sampleData2 }], 'utf8')
      .then((results) => {
        results.forEach((result) => {
          if (result.path === sampleWrite) {
            expect(result).toEqual({
              path: sampleWrite,
              data: sampleData,
              json: JSON.stringify(sampleData)
            });
            expect(yukihirogJson.readSync(sampleWrite)).toEqual(sampleData);
          }

          if (result.path === sampleWrite2) {
            expect(result).toEqual({
              path: sampleWrite2,
              data: sampleData2,
              json: JSON.stringify(sampleData2)
            });
            expect(yukihirogJson.readSync(sampleWrite2)).toEqual(sampleData2);
          }
        });

        done();
      })
      .catch((err) => {
        done(err);
      })
    ;
  });

  test('writeAll:options,callback', (done) => {
    let count = 0;
    yukihirogJson.writeAll([{ path: sampleWrite, data: sampleData }, { path: sampleWrite2, data: sampleData2 }], 'utf8', (result) => {
      if (result.path === sampleWrite) {
        expect(result).toEqual({
          path: sampleWrite,
          data: sampleData,
          json: JSON.stringify(sampleData)
        });
        expect(yukihirogJson.readSync(sampleWrite)).toEqual(sampleData);
        count++;
      }

      if (result.path === sampleWrite2) {
        expect(result).toEqual({
          path: sampleWrite2,
          data: sampleData2,
          json: JSON.stringify(sampleData2)
        });
        expect(yukihirogJson.readSync(sampleWrite2)).toEqual(sampleData2);
        count++;
      }

      if (count >= 2) {
        done();
      }
    });
  });

  test('writeAll:callback', (done) => {
    let count = 0;
    yukihirogJson.writeAll([{ path: sampleWrite, data: sampleData }, { path: sampleWrite2, data: sampleData2 }], (result) => {
      if (result.path === sampleWrite) {
        expect(result).toEqual({
          path: sampleWrite,
          data: sampleData,
          json: JSON.stringify(sampleData)
        });
        expect(yukihirogJson.readSync(sampleWrite)).toEqual(sampleData);
        count++;
      }

      if (result.path === sampleWrite2) {
        expect(result).toEqual({
          path: sampleWrite2,
          data: sampleData2,
          json: JSON.stringify(sampleData2)
        });
        expect(yukihirogJson.readSync(sampleWrite2)).toEqual(sampleData2);
        count++;
      }

      if (count >= 2) {
        done();
      }
    });
  });

  test('writeAll:unit:callback', (done) => {
    yukihirogJson.writeAll([
      { path: sampleWrite, data: sampleData },
      {
        path: sampleWrite2,
        data: sampleData2,
        callback: (result) => {
          expect(result).toEqual({
            path: sampleWrite2,
            data: sampleData2,
            json: JSON.stringify(sampleData2)
          });
          expect(yukihirogJson.readSync(sampleWrite2)).toEqual(sampleData2);
          done();
        }
      }
    ]);
  });
});

describe('writeSync', () => {
  test('writeSync', () => {
    expect(() => {
      yukihirogJson.writeSync(sampleWrite, sampleData)
    }).not.toThrow();
    expect(yukihirogJson.readSync(sampleWrite)).toEqual(sampleData);
  });
});

describe('writeAllSync', () => {
  test('writeAllSync', () => {
    expect(() => {
      yukihirogJson.writeAllSync([{ path: sampleWrite, data: sampleData }, { path: sampleWrite2, data: sampleData2, options: { encoding: 'utf8' } }])
    }).not.toThrow();
    expect(yukihirogJson.readSync(sampleWrite)).toEqual(sampleData);
    expect(yukihirogJson.readSync(sampleWrite2)).toEqual(sampleData2);
  });
});
