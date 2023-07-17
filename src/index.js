const { format } = require('util');

const disableDateFormat = process.env.NODE_CHROMA_LOGGER_DISABLE_DATE_FORMAT === 'true'
|| process.env.NODE_CHROMA_LOGGER_DISABLE_DATE_FORMAT === '1';
const disableSeverityFormat = process.env.NODE_CHROMA_LOGGER_DISABLE_SEVERITY_FORMAT === 'true'
|| process.env.NODE_CHROMA_LOGGER_DISABLE_SEVERITY_FORMAT === '1';
const disableColor = process.env.NODE_CHROMA_LOGGER_DISABLE_COLOR === 'true'
  || process.env.NODE_CHROMA_LOGGER_DISABLE_COLOR === '1';
const envSeverity = process.env.NODE_CHROMA_LOGGER_SEVERITY;

const colors = {
  backgroundLightRed: disableColor ? '' : '\x1b[101m',
  cyan: disableColor ? '' : '\x1b[36m',
  darkGray: disableColor ? '' : '\x1b[90m',
  default: disableColor ? '' : '\x1b[49m',
  green: disableColor ? '' : '\x1b[32m',
  lightMagenta: disableColor ? '' : '\x1b[95m',
  red: disableColor ? '' : '\x1b[31m',
  reset: disableColor ? '' : '\x1b[0m',
  yellow: disableColor ? '' : '\x1b[33m',
};

const severities = {
  fatal: { color: colors.backgroundLightRed, level: 6 },
  error: { color: colors.red, level: 5 },
  warn: { color: colors.yellow, level: 4 },
  info: { color: colors.cyan, level: 3 },
  log: { color: colors.default, level: 3 },
  success: { color: colors.green, level: 3 },
  debug: { color: colors.lightMagenta, level: 2 },
  trace: { color: colors.darkGray, level: 1 },
  disable: { level: 1000 },
};

const selectedSeverity = severities[envSeverity || 'trace']
  || severities.trace;

const write = (severity, dataStream, ...args) => {
  if (severities[severity].level >= selectedSeverity.level) {
    const date = disableDateFormat ? '' : `${new Date().toISOString()} `;
    const displayedSeverity = disableSeverityFormat ? '' : `${severity.toUpperCase()} `;
    process[dataStream].write(`${date}${severities[severity].color}${displayedSeverity}${format(...args)}${colors.reset}\n`);
  }
};

const logger = {
  debug: (...args) => write('debug', 'stdout', ...args),
  error: (...args) => write('error', 'stderr', ...args),
  fatal: (...args) => write('fatal', 'stderr', ...args),
  info: (...args) => write('info', 'stdout', ...args),
  log: (...args) => write('log', 'stdout', ...args),
  success: (...args) => write('success', 'stdout', ...args),
  trace: (...args) => write('trace', 'stdout', ...args),
  warn: (...args) => write('warn', 'stderr', ...args),
};

module.exports = Object.freeze(logger);
