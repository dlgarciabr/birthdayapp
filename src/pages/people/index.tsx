import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { usePaginatedQuery } from "@blitzjs/rpc";
import { useRouter } from "next/router";
import Layout from "src/core/layouts/Layout";
import getPeople from "src/people/queries/getPeople";
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

const ITEMS_PER_PAGE = 100;

export const PeopleList = () => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ people, hasMore }] = usePaginatedQuery(getPeople, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } });
  const goToNextPage = () => router.push({ query: { page: page + 1 } });

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
    <div style={{ height: 300, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

const PeoplePage = () => {
  return (
    <Layout>
      <Head>
        <title>People</title>
      </Head>

      <div>
        <p>
          <Link href={Routes.NewPersonPage()}>Create Person</Link>
        </p>

        <Suspense fallback={<div>Loading...</div>}>
          <PeopleList />
        </Suspense>
      </div>
    </Layout>
  );
};

export default PeoplePage;
