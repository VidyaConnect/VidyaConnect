export const logger = {

  info(message, metadata = {}) {
    console.log(
      JSON.stringify({
        level: "INFO",
        message,
        timestamp: new Date().toISOString(),
        ...metadata
      })
    );
  },

  error(message, metadata = {}) {
    console.error(
      JSON.stringify({
        level: "ERROR",
        message,
        timestamp: new Date().toISOString(),
        ...metadata
      })
    );
  }

};