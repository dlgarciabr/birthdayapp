import { Suspense } from "react";
import { Routes } from "@blitzjs/next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@blitzjs/rpc";
import { useParam } from "@blitzjs/next";

import Layout from "src/core/layouts/Layout";
import getPerson from "src/people/queries/getPerson";
import updatePerson from "src/people/mutations/updatePerson";
import { PersonForm, FORM_ERROR } from "src/people/components/PersonForm";

export const EditPerson = () => {
  const router = useRouter();
  const personId = useParam("personId", "number");
  const [person, { setQueryData }] = useQuery(
    getPerson,
    { id: personId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  );
  const [updatePersonMutation] = useMutation(updatePerson);

  return (
    <>
      <Head>
        <title>Edit Person {person.id}</title>
      </Head>

      <div>
        <h1>Edit Person {person.id}</h1>
        <pre>{JSON.stringify(person, null, 2)}</pre>

        <PersonForm
          submitText="Update Person"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdatePerson}
          initialValues={person}
          onSubmit={async (values) => {
            try {
              const updated = await updatePersonMutation({
                id: person.id,
                ...values,
              });
              await setQueryData(updated);
              await router.push(
                Routes.ShowPersonPage({ personId: updated.id })
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

const EditPersonPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditPerson />
      </Suspense>

      <p>
        <Link href={Routes.PeoplePage()}>People</Link>
      </p>
    </div>
  );
};

EditPersonPage.authenticate = true;
EditPersonPage.getLayout = (page) => <Layout>{page}</Layout>;

export default EditPersonPage;
