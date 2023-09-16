import { db } from "../db";

export default defineEventHandler((event) => {
  return {
    hello: db,
  };
});
