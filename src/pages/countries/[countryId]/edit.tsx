import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getCountry from "src/countries/queries/getCountry";
import updateCountry from "src/countries/mutations/updateCountry";
import { CountryForm, FORM_ERROR } from "src/countries/components/CountryForm";

export const EditCountry = () => {
  const router = useRouter();
  const countryId = useParam("countryId", "number");
  const [country, { setQueryData }] = useQuery(
    getCountry,
    { id: countryId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updateCountryMutation] = useMutation(updateCountry);

  return (
    <>
      <Head>
        <title>Edit Country {country.id}</title>
      </Head>

      <div>
        <h1>Edit Country {country.id}</h1>
        <pre>{JSON.stringify(country, null, 2)}</pre>

        <CountryForm
          submitText="Update Country"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateCountry}
          initialValues={country}
          onSubmit={async (values) => {
            try {
              const updated = await updateCountryMutation({
                id: country.id,
                ...values,
              });
              await setQueryData(updated);
              await router.push(
                Routes.ShowCountryPage({ countryId: updated.id })
              );
            } catch (error: any) {
              console.error(error);
              return {
                [FORM_ERROR]: error.toString(),
              };
            }
          }}
        />
      </div>
    </>
  );
};

const EditCountryPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditCountry />
      </Suspense>

      <p>
        <Link href={Routes.CountriesPage()}>Countries</Link>
      </p>
    </div>
  );
};

EditCountryPage.authenticate = true;
EditCountryPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditCountryPage;
