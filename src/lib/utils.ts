export const getEnv = (key: string) => {
  if (!process.env[key]) {
    throw new Error(`Env variable ${key} not provided`);
  }

  return process.env[key]!;
};
