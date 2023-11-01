import db from "./index"

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * to easily generate realistic data.
 */
const seed = async () => {
  // for (let i = 0; i < 5; i++) {
  //   await db.project.create({ data: { name: "Project " + i } })
  // }
  await db.country.create({ data: { name: 'Portugal', tld: '.pt'}});
  await db.country.create({ data: { name: 'Brazil', tld: '.br'}});
}

export default seed
