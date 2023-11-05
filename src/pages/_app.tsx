import { ErrorFallbackProps, ErrorComponent, ErrorBoundary, AppProps } from "@blitzjs/next"
import { AuthenticationError, AuthorizationError } from "blitz"
import React from "react"
import { withBlitz } from "src/blitz-client"
import "src/styles/globals.css"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import us from 'date-fns/locale/en-US';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginForm from "src/auth/components/LoginForm"
import { ToastType, showToast } from "src/core/components/Toast";
import { appWithTranslation } from 'next-i18next';

function RootErrorFallback({ error,resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    showToast(ToastType.ERROR, 'Error: You are not authenticated');
    return <LoginForm onSuccess={resetErrorBoundary} />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent
        statusCode={(error as any)?.statusCode || 400}
        title={error.message || error.name}
      />
    )
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={us}>
      <ErrorBoundary FallbackComponent={RootErrorFallback}>
        {getLayout(<Component {...pageProps} />)}
      </ErrorBoundary>
      <ToastContainer />
    </LocalizationProvider>
  )
}

export default appWithTranslation(withBlitz(MyApp))
