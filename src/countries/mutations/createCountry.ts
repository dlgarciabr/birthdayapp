import { resolver } from "@blitzjs/rpc";
import db from "db";
import { z } from "zod";

const CreateCountry = z.object({
  name: z.string(),
  tld: z.string()
});

export default resolver.pipe(
  resolver.zod(CreateCountry),
  resolver.authorize(),
  async (input) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const country = await db.country.create({ data: input });

    return country;
  }
);
