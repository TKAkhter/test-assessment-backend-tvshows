/* eslint-disable */
import dotenv from "dotenv";
dotenv.config();
import colors from "colors/safe";
import server from "./server";

const PORT = process.env.PORT ? process.env.PORT : 8080;
const ENV = process.env.NODE_ENV;
const API = process.env.BASE_URL;

server.listen(PORT, () => {
  const logMessage =
    colors.cyan(`==> ENV: ${ENV}`) +
    colors.magenta(` ==> PORT: ${PORT}`) +
    colors.yellow(` ==> CLIENT: ${process.env.ALLOW_ORIGIN}`) +
    colors.red(` ==> API: ${API}`);
  console.log(logMessage);
});
