import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeletePerson = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeletePerson),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const person = await db.person.deleteMany({ where: { id } });

    return person;
  }
);
