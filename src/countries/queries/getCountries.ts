import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetCountriesInput
  extends Pick<
    Prisma.CountryFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetCountriesInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: countries,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.country.count({ where }),
      query: (paginateArgs) =>
        db.country.findMany({ ...paginateArgs, where, orderBy }),
    });

    return {
      countries,
      nextPage,
      hasMore,
      count,
    };
  }
);
