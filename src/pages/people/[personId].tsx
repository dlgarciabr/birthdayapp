import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getPerson from "src/people/queries/getPerson";
import deletePerson from "src/people/mutations/deletePerson";

export const Person = () => {
  const router = useRouter();
  const personId = useParam("personId", "number");
  const [deletePersonMutation] = useMutation(deletePerson);
  const [person] = useQuery(getPerson, { id: personId });

  return (
    <>
      <Head>
        <title>Person {person.id}</title>
      </Head>

      <div>
        <h1>Person {person.id}</h1>
        <pre>{JSON.stringify(person, null, 2)}</pre>

        <Link href={Routes.EditPersonPage({ personId: person.id })}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deletePersonMutation({ id: person.id });
              await router.push(Routes.PeoplePage());
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

const ShowPersonPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.PeoplePage()}>People</Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Person />
      </Suspense>
    </div>
  );
};

ShowPersonPage.authenticate = true;
ShowPersonPage.getLayout = (page) => <Layout>{page}</Layout>;

export default ShowPersonPage;
