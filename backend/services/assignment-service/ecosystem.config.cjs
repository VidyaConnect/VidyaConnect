"use strict";

const ecosystem = {
  apps: [{
    name: "vidyaconnect-assignment-service",
    script: "src/server.js",
    exec_mode: "fork",
    instances: 1,
    env: { PORT: 3004, NODE_ENV: "production" },
  }],
};
module.exports = ecosystem;
