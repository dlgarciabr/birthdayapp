import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdatePerson = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdatePerson),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const person = await db.person.update({ where: { id }, data });

    return person;
  }
);
