const isProduction = import.meta.env.PROD;

const prod = "https://server-small-dawn-3376.fly.dev";
const dev = "http://localhost:5139";

export const finalUrl = isProduction ? prod : dev;
