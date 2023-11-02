import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getCountry from "src/countries/queries/getCountry";
import deleteCountry from "src/countries/mutations/deleteCountry";

export const Country = () => {
  const router = useRouter();
  const countryId = useParam("countryId", "number");
  const [deleteCountryMutation] = useMutation(deleteCountry);
  const [country] = useQuery(getCountry, { id: countryId });

  return (
    <>
      <Head>
        <title>Country {country.id}</title>
      </Head>

      <div>
        <h1>Country {country.id}</h1>
        <pre>{JSON.stringify(country, null, 2)}</pre>

        <Link href={Routes.EditCountryPage({ countryId: country.id })}>
          Edit
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteCountryMutation({ id: country.id });
              await router.push(Routes.CountriesPage());
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  );
};

const ShowCountryPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.CountriesPage()}>Countries</Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Country />
      </Suspense>
    </div>
  );
};

ShowCountryPage.authenticate = true;
ShowCountryPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowCountryPage;
