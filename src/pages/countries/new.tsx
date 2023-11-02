import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@blitzjs/rpc";
import Layout from "src/core/layouts/Layout";
import createCountry from "src/countries/mutations/createCountry";
import { CountryForm, FORM_ERROR } from "src/countries/components/CountryForm";

const NewCountryPage = () => {
  const router = useRouter();
  const [createCountryMutation] = useMutation(createCountry);

  return (
    <Layout title={"Create New Country"}>
      <h1>Create New Country</h1>

      <CountryForm
        submitText="Create Country"
        // TODO use a zod schema for form validation
        //  - Tip: extract mutation's schema into a shared `validations.ts` file and
        //         then import and use it here
        // schema={CreateCountry}
        // initialValues={{}}
        onSubmit={async (values) => {
          try {
            const country = await createCountryMutation(values);
            await router.push(
              Routes.ShowCountryPage({ countryId: country.id })
            );
          } catch (error: any) {
            console.error(error);
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.CountriesPage()}>Countries</Link>
      </p>
    </Layout>
  );
};

NewCountryPage.authenticate = true;

export default NewCountryPage;
