import { Routes } from "@blitzjs/next";
import Link from "next/link";
import { useRouter } from "next/router";
import { invoke, useMutation } from '@blitzjs/rpc';
import Layout from "src/core/layouts/Layout";
import createPerson from "src/people/mutations/createPerson";
import { PersonForm, FORM_ERROR } from "src/people/components/PersonForm";
import { Country } from "@prisma/client";
import { useEffect, useState } from "react";
import getCountries from "src/countries/queries/getCountries";
import { ToastType, showToast } from "src/core/components/Toast";

import { formatMessage } from "./uitls";
import { CreatePersonValidation } from "src/people/schemas";
import { Button, Grid } from "@mui/material";

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
      <Grid container justifyContent='center' spacing={2}>
        <Grid item xs={7}>
          <PersonForm
            submitText="Create Person"
            schema={CreatePersonValidation}
            initialValues={{
              name: '',
              surname: '',
              countryId: '',
              birthdate: ''
            }}
            countries={countries}
            onSubmit={async (values) => {
              try {
                const createdPerson = await createPersonMutation(values);
                const country = countries.find(country => country.id === parseInt(values.countryId));
                const message = formatMessage(createdPerson, country!);
                showToast(ToastType.INFO, message);
                await router.push(Routes.PeoplePage());
              } catch (error: any) {
                console.error(error);
                return {
                  [FORM_ERROR]: error.toString(),
                };
              }
            }}
          />
        </Grid>
        <Grid item container xs={7} justifyContent='center'>
          <Button variant="outlined" onClick={() => router.push(Routes.PeoplePage())}>
            People list
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

NewPersonPage.authenticate = true;

export default NewPersonPage;
