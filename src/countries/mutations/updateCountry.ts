import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const UpdateCountry = z.object({
  id: z.number(),
  name: z.string(),
});

export default resolver.pipe(
  resolver.zod(UpdateCountry),
  resolver.authorize(),
  async ({ id, ...data }) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const country = await db.country.update({ where: { id }, data });

    return country;
  }
);
