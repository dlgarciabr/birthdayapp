import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

export const CreatePerson = z.object({
  name: z.string(),
  surname: z.string(),
  birthdate: z.date(),
  countryId: z.string().regex(/^((?!-1).)*$/, 'Field required'),
});

export default resolver.pipe(
  resolver.zod(CreatePerson),
  resolver.authorize(),
  async (input) => {
    const person = await db.person.create({ 
      data: {...input, countryId: parseInt(input.countryId)} 
    });
    return person;
  }
);
