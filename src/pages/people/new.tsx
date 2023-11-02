import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { invoke, useMutation } from '@blitzjs/rpc';
import Layout from "src/core/layouts/Layout";
import createPerson, { CreatePerson } from "src/people/mutations/createPerson";
import { PersonForm, FORM_ERROR } from "src/people/components/PersonForm";
import { Country } from "@prisma/client";
import { useEffect, useState } from "react";
import getCountries from "src/countries/queries/getCountries";

const NewPersonPage = () => {
  const router = useRouter();
  const [createPersonMutation] = useMutation(createPerson);
  const [countries, setCountries] = useState<Country[]>([]);

  const loadCountries = async () => {
    const { countries } = await invoke(getCountries, {
      orderBy: { name: 'asc' }
    });
    setCountries(countries);
  };

  useEffect(() => void loadCountries(), []);

  return (
    <Layout title={"Create New Person"}>
      <h1>Create New Person</h1>

      <PersonForm
        submitText="Create Person"
        schema={CreatePerson}
        initialValues={{
          name: '',
          surname: '',
          countryId: '-1',
          birthdate: new Date().toLocaleDateString('en-US')
        }}
        countries={countries}
        onSubmit={async (values) => {
          try {
            const person = await createPersonMutation(values);
            await router.push(Routes.ShowPersonPage({ personId: person.id }));
          } catch (error: any) {
            return {
              [FORM_ERROR]: error.toString(),
            };
          }
        }}
      />

      <p>
        <Link href={Routes.PeoplePage()}>People</Link>
      </p>
    </Layout>
  );
};

NewPersonPage.authenticate = true;

export default NewPersonPage;
