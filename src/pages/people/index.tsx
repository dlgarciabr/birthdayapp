import { Suspense, useState } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { invoke, usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import getPeople from "src/people/queries/getPeople";
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Country } from "@prisma/client";
import getCountries from "src/countries/queries/getCountries";
import { ToastType, showToast } from "src/core/components/Toast";
import { formatMessage } from "./uitls";
import { Button } from "@mui/material";

const ITEMS_PER_PAGE = 100;

export const PeopleList = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ people }] = usePaginatedQuery(getPeople, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const loadCountries = async () => {
    const { countries } = await invoke(getCountries, {
      orderBy: { name: 'asc' }
    });
    setCountries(countries);
  };

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
  return (
    <Layout>
      <Head>
        <title>People</title>
      </Head>
      <h1>People list</h1>
        <Button variant='contained' onClick={() => router.push(Routes.NewPersonPage())}>
          Create person
        </Button>
        <Suspense fallback={<div>Loading...</div>}>
          <PeopleList />
        </Suspense>
    </Layout>
  );
};

export default PeoplePage;
