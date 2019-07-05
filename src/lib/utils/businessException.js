module.exports = exports = class BusinessException {
  constructor(err, code, data) {
    this.err = err;
    this.code = code || -1;
    this.data = data;
  }
}