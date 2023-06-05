const logger = require('../../src');

logger.error({
  error: 'error-code',
  context: {
    aBitOf: 'context',
  },
});
