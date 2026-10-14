// Replace the body with your error-reporting SDK. Never log personal data or tokens.
export const logger = {
  info: (msg: string, meta?: object) => process.env.NODE_ENV !== 'production' && console.info(msg, meta ?? ''),
  error: (msg: string, meta?: object) => console.error(msg, meta ?? ''),
};
