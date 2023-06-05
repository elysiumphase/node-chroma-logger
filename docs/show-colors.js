process.env.NODE_COLORFUL_LOGGER_DISABLE_DATE_FORMAT = 'false';
process.env.NODE_COLORFUL_LOGGER_DISABLE_SEVERITY_FORMAT = 'false';
process.env.NODE_COLORFUL_LOGGER_DISABLE_COLOR = 'false';
process.env.NODE_COLORFUL_LOGGER_SEVERITY = 'trace';

const logger = require('../src');

const error = new Error('bad stuff');
error.stack = error.stack.replace('at Object.<anonymous> (/Users/adrienvalcke/Desktop/dev/node-chroma-logger/test/index.js:8:15)\n    ', '');

console.log('\n\n\n');

logger.fatal('this was fatal, this has to stop!');
logger.error('this was an error!', error);
logger.warn('ooooooops, be careful');
logger.info('this is so helpful thanks');
logger.log('log is at same level as info but without any specific color');
logger.success('same as above, let\'s go!!');
logger.debug({ hello: 'world' }, 'hi', 'this is just to have this info with some more details');
logger.trace('this is a very detailed log', { details: 100 }, ['details', 'details']);

console.log('\n\n\n');
