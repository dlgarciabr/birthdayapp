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

import { changeLanguage, formatMessage } from "./uitls";
import { CreatePersonValidation } from "src/people/schemas";
import { Button, Grid } from "@mui/material";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
  
  const { t, i18n } = useTranslation();

  return (
    <Layout title={t('people.form.label')}>
      <h1>{t('people.form.label')}</h1>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Button variant='contained' onClick={() => router.push(Routes.NewPersonPage())}>
            {t('people.list.create.label')}
          </Button>
        </Grid>
        <Grid item>
          <Button variant='text' onClick={() => changeLanguage(i18n.language, router, Routes.NewPersonPage())}>
            {t('change.language.next')}
          </Button>
        </Grid>
      </Grid>
      <Grid container justifyContent='center' spacing={2}>
        <Grid item xs={7}>
          <PersonForm
            submitText={t('people.form.save.label')}
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
                const message = formatMessage(i18n.language, t, createdPerson, country!);
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
            {t('people.list.title')}
          </Button>
        </Grid>
      </Grid>
    </Layout>
  );
};

NewPersonPage.authenticate = true;

export default NewPersonPage;

export async function getStaticProps(context) {
  // extract the locale identifier from the URL
  const { locale } = context

  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  }
}
