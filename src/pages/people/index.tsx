import { Suspense, useCallback } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import getPeople from "src/people/queries/getPeople";
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { ToastType, showToast } from "src/core/components/Toast";
import { changeLanguage, formatMessage } from "./uitls";
import { Button, Grid } from "@mui/material";
import {  useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ITEMS_PER_PAGE = 100;

export const PeopleList = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ people }] = usePaginatedQuery(getPeople, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: t('people.name.label'), width: 150 },
    { field: 'country', headerName: t('people.country.label'), width: 150 },
    { field: 'birthday', headerName: t('people.birthday.label'), width: 150 },
  ];

  const locale = i18n.language === 'pt' ? 'pt-PT' : 'en-US';

  const rows: GridRowsProp = people.map(person =>({
    id: person.id, 
    name: person.name, 
    country: person.country.name, 
    birthday: new Date(person.birthdate).toLocaleDateString(locale, { year:'numeric' , month: '2-digit', day: '2-digit'}),
  }));

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid 
        rows={rows} 
        columns={columns} 
        hideFooterPagination={true}
        onRowClick={({id}) => {
          const person = people.find(person => person.id === id);
          const message = formatMessage(person!, person?.country!);
          showToast(ToastType.INFO, message);
        }}/>
    </div>
  );
};

const PeoplePage = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  return (
    <Layout>
      <Head>
        <title>People</title>
      </Head>
        <h1>{t('people.list.title')}</h1>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Button variant='contained' onClick={() => router.push(Routes.NewPersonPage())}>
              {t('people.list.create.label')}
            </Button>
          </Grid>
          <Grid item>
            <Button variant='text' onClick={() => changeLanguage(i18n.language, router, Routes.PeoplePage())}>
              {t('change.language.next')}
            </Button>
          </Grid>
        </Grid>
        <Suspense fallback={<div>Loading...</div>}>
          <PeopleList />
        </Suspense>
    </Layout>
  );
};

export default PeoplePage;

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
