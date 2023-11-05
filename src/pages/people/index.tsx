import { Suspense, useCallback } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import getPeople from "src/people/queries/getPeople";
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { ToastType, showToast } from "src/core/components/Toast";
import { formatMessage } from "./uitls";
import { Button } from "@mui/material";
import { Trans, Translation, useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ITEMS_PER_PAGE = 100;

export const PeopleList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ people }] = usePaginatedQuery(getPeople, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'country', headerName: 'Country', width: 150 },
    { field: 'birthday', headerName: 'Birthday', width: 150 },
  ];

  const rows: GridRowsProp = people.map(person =>({
    id: person.id, 
    name: person.name, 
    country: person.country.name, 
    birthday: new Date(person.birthdate).toLocaleDateString('en-US', { year:'numeric' , month: '2-digit', day: '2-digit'}),
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

  const changeLanguage = useCallback(async () => {
    switch(i18n.language){
      case 'en':
        await router.push(Routes.PeoplePage(), undefined, {locale: 'pt'});
        break;
      case 'pt':
        await router.push(Routes.PeoplePage(), undefined, {locale: 'en'});
        break;
     }
  },[i18n, router])

  return (
    <Layout>
      <Head>
        <title>People</title>
      </Head>
        <h1>{t('people.list.title')}</h1>
        <Button variant='contained' onClick={() => router.push(Routes.NewPersonPage())}>
          {t('people.list.create.label')}
        </Button>
        <Button variant='outlined' onClick={() => changeLanguage()}>
          {t('change.language.next')}
        </Button>
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
