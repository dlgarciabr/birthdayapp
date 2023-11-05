import { resolver } from "@blitzjs/rpc";
import db from "db";
import { CreatePersonValidation } from "../schemas";

export default resolver.pipe(
  resolver.zod(CreatePersonValidation),
  resolver.authorize(),
  async (input) => {
    const person = await db.person.create({ 
      data: {
        ...input, 
        birthdate: new Date(input.birthdate),
        countryId: parseInt(input.countryId),
      } 
    });
    return person;
  }
);
