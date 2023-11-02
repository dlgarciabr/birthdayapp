import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import getCountries from "src/countries/queries/getCountries";

const ITEMS_PER_PAGE = 100;

export const CountriesList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ countries, hasMore }] = usePaginatedQuery(getCountries, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

  return (
    <div>
      <ul>
        {countries.map((country) => (
          <li key={country.id}>
            <Link href={Routes.ShowCountryPage({ countryId: country.id })}>
              {country.name}
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

const CountriesPage = () => {
  return (
    <Layout>
      <Head>
        <title>Countries</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewCountryPage()}>Create Country</Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <CountriesList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default CountriesPage;
