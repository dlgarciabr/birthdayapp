import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const DeleteCountry = z.object({
  id: z.number(),
});

export default resolver.pipe(
  resolver.zod(DeleteCountry),
  resolver.authorize(),
  async ({ id }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const country = await db.country.deleteMany({ where: { id } });

    return country;
  }
);
