const isProduction = import.meta.env.PROD;

const prod = "https://deadpigeon-api.fly.dev";
const dev = "http://localhost:8080";

export const finalUrl = isProduction ? prod : dev;
