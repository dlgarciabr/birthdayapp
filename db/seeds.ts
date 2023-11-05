import db from "./index"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * to easily generate realistic data.
 */
const seed = async () => {
  await db.country.create({ data: { name: 'Portugal', tld: '.pt'}});
  await db.country.create({ data: { name: 'Brazil', tld: '.br'}});
}

export default seed
