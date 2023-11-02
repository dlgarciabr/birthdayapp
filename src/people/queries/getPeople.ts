import { paginate } from "blitz";
import { resolver } from "@blitzjs/rpc";
import db, { Prisma } from "db";

interface GetPeopleInput
  extends Pick<
    Prisma.PersonFindManyArgs,
    "where" | "orderBy" | "skip" | "take"
  > {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetPeopleInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: people,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.person.count({ where }),
      query: (paginateArgs) =>
        db.person.findMany({ 
          ...paginateArgs, 
          where, 
          orderBy,
          include: {
            country: true
          }
        }),
    });

    return {
      people,
      nextPage,
      hasMore,
      count,
    };
  }
);
