import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import getPeople from "src/people/queries/getPeople";

const ITEMS_PER_PAGE = 100;

export const PeopleList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ people, hasMore }] = usePaginatedQuery(getPeople, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <Link href={Routes.ShowPersonPage({ personId: person.id })}>
              {person.name}
            </Link>
          </li>
        ))}
      </ul>

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  );
};

const PeoplePage = () => {
  return (
    <Layout>
      <Head>
        <title>People</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewPersonPage()}>Create Person</Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <PeopleList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default PeoplePage;
