export type Database = {
  url: String;
};

export type Config = {
  database: Database;
  JWT_REFRESH_SECRET: String;
  JWT_ACCESS_SECRET: String;
};

export default (): Config => {
  const defaultToNumber = (value: any, defaultValue: number): number => {
    const tryValue = Number(value);
    return isNaN(tryValue) ? defaultValue : tryValue;
  };
  return {
    JWT_ACCESS_SECRET: process.env.SECRET ?? 'r9JnestjscrmUMMp41nqrYFRe',
    JWT_REFRESH_SECRET: process.env.SECRET ?? 'UMMp41nqrYFRer9Jnestjscrm',
    database: {
      url:
        process.env.DATABASE_URI ??
        'mongodb+srv://aryan_analog:UMMp41nqrYFRer9J@nestjs.l7nkikk.mongodb.net/nestjs-crm',
    },
  };
};
