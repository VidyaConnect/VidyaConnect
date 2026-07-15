const logger = {
  info: (service, message, data = '') => {
    console.log(JSON.stringify({
      level: 'info',
      service,
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  },
  error: (service, message, error = '') => {
    console.error(JSON.stringify({
      level: 'error',
      service,
      message,
      error: error.message || error,
      timestamp: new Date().toISOString()
    }));
  },
  warn: (service, message, data = '') => {
    console.warn(JSON.stringify({
      level: 'warn',
      service,
      message,
      data,
      timestamp: new Date().toISOString()
    }));
  }
};

module.exports = logger;