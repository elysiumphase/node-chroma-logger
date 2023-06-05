const { spawnSync } = require('child_process');
const path = require('path');
const { time: { isISOStringDate } } = require('consis');
const { expect } = require('./Common');
const logger = require('../src');

const logTrace = path.join(__dirname, './fixtures/log-trace.js');
const logDebug = path.join(__dirname, './fixtures/log-debug.js');
const logInfo = path.join(__dirname, './fixtures/log-info.js');
const logSuccess = path.join(__dirname, './fixtures/log-success.js');
const logLog = path.join(__dirname, './fixtures/log-log.js');
const logWarn = path.join(__dirname, './fixtures/log-warn.js');
const logError = path.join(__dirname, './fixtures/log-error.js');
const logFatal = path.join(__dirname, './fixtures/log-fatal.js');
const logObject = path.join(__dirname, './fixtures/log-object.js');

const exec = ({
  file,
  severity = '',
  disableColor = false,
  disableDateFormat = false,
  disableSeverityFormat = false,
} = {}) => {
  return spawnSync(
    'node',
    [file],
    {
      env: {
        ...process.env,
        NODE_COLORFUL_LOGGER_SEVERITY: severity,
        NODE_COLORFUL_LOGGER_DISABLE_COLOR: disableColor,
        NODE_COLORFUL_LOGGER_DISABLE_DATE_FORMAT: disableDateFormat,
        NODE_COLORFUL_LOGGER_DISABLE_SEVERITY_FORMAT: disableSeverityFormat,
      },
      encoding: 'utf8',
    },
  );
};

describe('#logger', () => {
  // exports
  it('should export an object with specific functions', () => {
    const keys = Object.keys(logger);

    expect(logger).to.be.an('object');
    expect(keys).to.eql(['debug', 'error', 'fatal', 'info', 'log', 'success', 'trace', 'warn']);
    keys.forEach((key) => {
      expect(logger[key]).to.be.a('function');
    });
  });

  // logging disabled
  it('should output nothing when logging is disabled', () => {
    expect(exec({ file: logTrace, severity: 'disable' }).stdout).to.equal('');
    expect(exec({ file: logDebug, severity: 'disable' }).stdout).to.equal('');
    expect(exec({ file: logInfo, severity: 'disable' }).stdout).to.equal('');
    expect(exec({ file: logSuccess, severity: 'disable' }).stdout).to.equal('');
    expect(exec({ file: logLog, severity: 'disable' }).stdout).to.equal('');
    expect(exec({ file: logWarn, severity: 'disable' }).stderr).to.equal('');
    expect(exec({ file: logError, severity: 'disable' }).stderr).to.equal('');
    expect(exec({ file: logFatal, severity: 'disable' }).stderr).to.equal('');
  });

  // data stream
  it('should output to the right data stream', () => {
    expect(exec({ file: logTrace }).stdout).to.not.equal('');
    expect(exec({ file: logTrace }).stderr).to.equal('');

    expect(exec({ file: logDebug }).stdout).to.not.equal('');
    expect(exec({ file: logDebug }).stderr).to.equal('');

    expect(exec({ file: logInfo }).stdout).to.not.equal('');
    expect(exec({ file: logInfo }).stderr).to.equal('');

    expect(exec({ file: logSuccess }).stdout).to.not.equal('');
    expect(exec({ file: logSuccess }).stderr).to.equal('');

    expect(exec({ file: logLog }).stdout).to.not.equal('');
    expect(exec({ file: logLog }).stderr).to.equal('');

    expect(exec({ file: logWarn }).stdout).to.equal('');
    expect(exec({ file: logWarn }).stderr).to.not.equal('');

    expect(exec({ file: logError }).stdout).to.equal('');
    expect(exec({ file: logError }).stderr).to.not.equal('');

    expect(exec({ file: logFatal }).stdout).to.equal('');
    expect(exec({ file: logFatal }).stderr).to.not.equal('');
  });

  // severity by default
  it('should output log at trace severity by default', () => {
    expect(exec({ file: logTrace }).stdout).to.be.a('string').and.to.not.equal('');
  });

  // selected severity
  it('should output something when logging trace and trace severity is activated', () => {
    expect(exec({ file: logTrace, severity: 'trace' }).stdout).to.be.a('string').and.to.not.equal('');
  });

  it('should output something when logging debug and debug severity is activated', () => {
    expect(exec({ file: logDebug, severity: 'debug' }).stdout).to.be.a('string').and.to.not.equal('');
  });

  it('should output something when logging info and info severity is activated', () => {
    expect(exec({ file: logInfo, severity: 'info' }).stdout).to.be.a('string').and.to.not.equal('');
  });

  it('should output something when logging warn and warn severity is activated', () => {
    expect(exec({ file: logWarn, severity: 'warn' }).stderr).to.be.a('string').and.to.not.equal('');
  });

  it('should output something when logging error and error severity is activated', () => {
    expect(exec({ file: logError, severity: 'error' }).stderr).to.be.a('string').and.to.not.equal('');
  });

  it('should output something when logging fatal and fatal severity is activated', () => {
    expect(exec({ file: logFatal, severity: 'fatal' }).stderr).to.be.a('string').and.to.not.equal('');
  });

  // lower and upper severities
  it('should output something when trace severity is activated for upper severities only', () => {
    expect(exec({ file: logTrace, severity: 'trace' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logDebug, severity: 'trace' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logInfo, severity: 'trace' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logSuccess, severity: 'trace' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logLog, severity: 'trace' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logWarn, severity: 'trace' }).stderr).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logError, severity: 'trace' }).stderr).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logFatal, severity: 'trace' }).stderr).to.be.a('string').and.to.not.equal('');
  });

  it('should output something when debug severity is activated for upper severities only', () => {
    expect(exec({ file: logTrace, severity: 'debug' }).stdout).to.equal('');
    expect(exec({ file: logDebug, severity: 'debug' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logInfo, severity: 'debug' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logSuccess, severity: 'debug' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logLog, severity: 'debug' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logWarn, severity: 'debug' }).stderr).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logError, severity: 'debug' }).stderr).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logFatal, severity: 'debug' }).stderr).to.be.a('string').and.to.not.equal('');
  });

  it('should output something when info severity is activated for upper severities only', () => {
    expect(exec({ file: logTrace, severity: 'info' }).stdout).to.equal('');
    expect(exec({ file: logDebug, severity: 'info' }).stdout).to.equal('');
    expect(exec({ file: logInfo, severity: 'info' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logSuccess, severity: 'info' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logLog, severity: 'info' }).stdout).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logWarn, severity: 'info' }).stderr).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logError, severity: 'info' }).stderr).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logFatal, severity: 'info' }).stderr).to.be.a('string').and.to.not.equal('');
  });

  it('should output something when warn severity is activated for upper severities only', () => {
    expect(exec({ file: logTrace, severity: 'warn' }).stdout).to.equal('');
    expect(exec({ file: logDebug, severity: 'warn' }).stdout).to.equal('');
    expect(exec({ file: logInfo, severity: 'warn' }).stdout).to.equal('');
    expect(exec({ file: logSuccess, severity: 'warn' }).stdout).to.equal('');
    expect(exec({ file: logLog, severity: 'warn' }).stdout).to.equal('');
    expect(exec({ file: logWarn, severity: 'warn' }).stderr).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logError, severity: 'warn' }).stderr).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logFatal, severity: 'warn' }).stderr).to.be.a('string').and.to.not.equal('');
  });

  it('should output something when error severity is activated for upper severities only', () => {
    expect(exec({ file: logTrace, severity: 'error' }).stdout).to.equal('');
    expect(exec({ file: logDebug, severity: 'error' }).stdout).to.equal('');
    expect(exec({ file: logInfo, severity: 'error' }).stdout).to.equal('');
    expect(exec({ file: logSuccess, severity: 'error' }).stdout).to.equal('');
    expect(exec({ file: logLog, severity: 'error' }).stdout).to.equal('');
    expect(exec({ file: logWarn, severity: 'error' }).stderr).to.equal('');
    expect(exec({ file: logError, severity: 'error' }).stderr).to.be.a('string').and.to.not.equal('');
    expect(exec({ file: logFatal, severity: 'error' }).stderr).to.be.a('string').and.to.not.equal('');
  });

  it('should output something when fatal severity is activated for upper severities only', () => {
    expect(exec({ file: logTrace, severity: 'fatal' }).stdout).to.equal('');
    expect(exec({ file: logDebug, severity: 'fatal' }).stdout).to.equal('');
    expect(exec({ file: logInfo, severity: 'fatal' }).stdout).to.equal('');
    expect(exec({ file: logSuccess, severity: 'fatal' }).stdout).to.equal('');
    expect(exec({ file: logLog, severity: 'fatal' }).stdout).to.equal('');
    expect(exec({ file: logWarn, severity: 'fatal' }).stderr).to.equal('');
    expect(exec({ file: logError, severity: 'fatal' }).stderr).to.equal('');
    expect(exec({ file: logFatal, severity: 'fatal' }).stderr).to.be.a('string').and.to.not.equal('');
  });

  // test logging color
  it('should output the related escape sequence to display color in terminal', () => {
    expect(exec({ file: logTrace }).stdout).to.be.a('string').and.to.have.string('\x1b[90m');
    expect(exec({ file: logDebug }).stdout).to.be.a('string').and.to.have.string('\x1b[95m');
    expect(exec({ file: logInfo }).stdout).to.be.a('string').and.to.have.string('\x1b[36m');
    expect(exec({ file: logSuccess }).stdout).to.be.a('string').and.to.have.string('\x1b[32m');
    expect(exec({ file: logLog }).stdout).to.be.a('string').and.to.have.string('\x1b[49m');
    expect(exec({ file: logWarn }).stderr).to.be.a('string').and.to.have.string('\x1b[33m');
    expect(exec({ file: logError }).stderr).to.be.a('string').and.to.have.string('\x1b[31m');
    expect(exec({ file: logFatal }).stderr).to.be.a('string').and.to.have.string('\x1b[101m');
  });

  // test logging color disabled
  it('should not output the related escape sequence when color is disabled', () => {
    expect(exec({ file: logTrace, disableColor: true }).stdout).to.be.a('string').and.to.not.have.string('\x1b[90m');
    expect(exec({ file: logDebug, disableColor: true }).stdout).to.be.a('string').and.to.not.have.string('\x1b[95m');
    expect(exec({ file: logInfo, disableColor: true }).stdout).to.be.a('string').and.to.not.have.string('\x1b[36m');
    expect(exec({ file: logSuccess, disableColor: true }).stdout).to.be.a('string').and.to.not.have.string('\x1b[32m');
    expect(exec({ file: logLog, disableColor: true }).stdout).to.be.a('string').and.to.not.have.string('\x1b[49m');
    expect(exec({ file: logWarn, disableColor: true }).stderr).to.be.a('string').and.to.not.have.string('\x1b[33m');
    expect(exec({ file: logError, disableColor: true }).stderr).to.be.a('string').and.to.not.have.string('\x1b[31m');
    expect(exec({ file: logFatal, disableColor: true }).stderr).to.be.a('string').and.to.not.have.string('\x1b[101m');
  });

  // test resetting color
  it('should output the related escape sequence to reset color in terminal', () => {
    expect(exec({ file: logTrace }).stdout.endsWith('\x1b[0m\n')).to.be.true;
    expect(exec({ file: logDebug }).stdout.endsWith('\x1b[0m\n')).to.be.true;
    expect(exec({ file: logInfo }).stdout.endsWith('\x1b[0m\n')).to.be.true;
    expect(exec({ file: logSuccess }).stdout.endsWith('\x1b[0m\n')).to.be.true;
    expect(exec({ file: logLog }).stdout.endsWith('\x1b[0m\n')).to.be.true;
    expect(exec({ file: logWarn }).stderr.endsWith('\x1b[0m\n')).to.be.true;
    expect(exec({ file: logError }).stderr.endsWith('\x1b[0m\n')).to.be.true;
    expect(exec({ file: logFatal }).stderr.endsWith('\x1b[0m\n')).to.be.true;
  });

  // test date is in log format
  it('should have the date in the log format', () => {
    expect(isISOStringDate(exec({ file: logTrace }).stdout.split(' ')[0])).to.be.true;
    expect(isISOStringDate(exec({ file: logDebug }).stdout.split(' ')[0])).to.be.true;
    expect(isISOStringDate(exec({ file: logInfo }).stdout.split(' ')[0])).to.be.true;
    expect(isISOStringDate(exec({ file: logSuccess }).stdout.split(' ')[0])).to.be.true;
    expect(isISOStringDate(exec({ file: logLog }).stdout.split(' ')[0])).to.be.true;
    expect(isISOStringDate(exec({ file: logWarn }).stderr.split(' ')[0])).to.be.true;
    expect(isISOStringDate(exec({ file: logError }).stderr.split(' ')[0])).to.be.true;
    expect(isISOStringDate(exec({ file: logFatal }).stderr.split(' ')[0])).to.be.true;
  });

  // test disabling date in log format
  it('should not have the date in the log format', () => {
    expect(isISOStringDate(exec({ file: logTrace, disableDateFormat: true }).stdout.split(' ')[0])).to.be.false;
    expect(isISOStringDate(exec({ file: logDebug, disableDateFormat: true }).stdout.split(' ')[0])).to.be.false;
    expect(isISOStringDate(exec({ file: logInfo, disableDateFormat: true }).stdout.split(' ')[0])).to.be.false;
    expect(isISOStringDate(exec({ file: logSuccess, disableDateFormat: true }).stdout.split(' ')[0])).to.be.false;
    expect(isISOStringDate(exec({ file: logLog, disableDateFormat: true }).stdout.split(' ')[0])).to.be.false;
    expect(isISOStringDate(exec({ file: logWarn, disableDateFormat: true }).stderr.split(' ')[0])).to.be.false;
    expect(isISOStringDate(exec({ file: logError, disableDateFormat: true }).stderr.split(' ')[0])).to.be.false;
    expect(isISOStringDate(exec({ file: logFatal, disableDateFormat: true }).stderr.split(' ')[0])).to.be.false;
  });

  // test severity is in log format
  it('should have the severity in the log format', () => {
    expect(exec({ file: logTrace }).stdout).to.be.a('string').and.to.have.string('TRACE');
    expect(exec({ file: logDebug }).stdout).to.be.a('string').and.to.have.string('DEBUG');
    expect(exec({ file: logInfo }).stdout).to.be.a('string').and.to.have.string('INFO');
    expect(exec({ file: logSuccess }).stdout).to.be.a('string').and.to.have.string('SUCCESS');
    expect(exec({ file: logLog }).stdout).to.be.a('string').and.to.have.string('LOG');
    expect(exec({ file: logWarn }).stderr).to.be.a('string').and.to.have.string('WARN');
    expect(exec({ file: logError }).stderr).to.be.a('string').and.to.have.string('ERROR');
    expect(exec({ file: logFatal }).stderr).to.be.a('string').and.to.have.string('FATAL');
  });

  // test disabling severity in log format
  it('should not have the severity in the log format', () => {
    expect(exec({ file: logTrace, disableSeverityFormat: true }).stdout).to.be.a('string').and.to.not.have.string('TRACE');
    expect(exec({ file: logDebug, disableSeverityFormat: true }).stdout).to.be.a('string').and.to.not.have.string('DEBUG');
    expect(exec({ file: logInfo, disableSeverityFormat: true }).stdout).to.be.a('string').and.to.not.have.string('INFO');
    expect(exec({ file: logSuccess, disableSeverityFormat: true }).stdout).to.be.a('string').and.to.not.have.string('SUCCESS');
    expect(exec({ file: logLog, disableSeverityFormat: true }).stdout).to.be.a('string').and.to.not.have.string('LOG');
    expect(exec({ file: logWarn, disableSeverityFormat: true }).stderr).to.be.a('string').and.to.not.have.string('WARN');
    expect(exec({ file: logError, disableSeverityFormat: true }).stderr).to.be.a('string').and.to.not.have.string('ERROR');
    expect(exec({ file: logFatal, disableSeverityFormat: true }).stderr).to.be.a('string').and.to.not.have.string('FATAL');
  });

  // logging object
  it('should log an object', () => {
    const { stderr } = exec({
      file: logObject,
      disableColor: true,
      disableDateFormat: true,
      disableSeverityFormat: true,
    });
    const stringToObject = (str) => JSON.parse(str.replace(/[\n\t\r]/g, '').replace(/'/g, '"').replace(/(\w+:)|(\w+ :)/g, (s) => `"${s.substring(0, s.length - 1)}":`));
    const object = stringToObject(stderr);

    expect(object.error).to.equal('error-code');
    expect(object.context).to.eql({ aBitOf: 'context' });
  });
});
