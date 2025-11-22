export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  appVersion: process.env.APP_VERSION || '1.0.0',
  appName: process.env.APP_NAME || 'travel-track-api',
  logLevel: process.env.LOG_LEVEL || 'info',
  isProd: process.env.NODE_ENV === 'production',
});
