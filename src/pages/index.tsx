import { Suspense } from "react"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { Routes, BlitzPage } from "@blitzjs/next"
import styles from "src/styles/Home.module.css";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const UserInfo = () => {
  const currentUser = useCurrentUser();
  const [logoutMutation] = useMutation(logout)
  if (currentUser) {
    return (
      <>
        <div>
          User: <code>{currentUser.email}</code>
        </div>
        <button
          className={styles.button}
          onClick={async () => {
            await logoutMutation()
          }}
        >
          Logout
        </button>
      </>
    )
  } else {
    return (
      <>
        <Link href={Routes.SignupPage()} className={styles.button}>
          <strong>Sign Up</strong>
        </Link>
        <Link href={Routes.LoginPage()} className={styles.loginButton}>
          <strong>Login</strong>
        </Link>
      </>
    )
  }
}

const Home: BlitzPage = () => {
  const { t } = useTranslation();
  return (
    <Layout title="Home">
      <div className={styles.globe} />

      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <div className={styles.buttonContainer}>
                <Suspense fallback="Loading...">
                  <UserInfo />
                </Suspense>
              </div> 
            </div>
            <div className={styles.body}>
              <div className={styles.instructions}>
                <div>
                  <div className={styles.code}>
                    <pre>
                      <code>
                        <Link href="/revisited" className={styles.textLink} locale='en'>
                          {t('people.list.title')}   /revisited
                        </Link>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <span>Powered by</span>
          <a
            href="https://blitzjs.com?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.textLink}
          >
            Blitz.js
          </a>
        </footer>
      </div>
    </Layout>
  )
}

export default Home;

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
