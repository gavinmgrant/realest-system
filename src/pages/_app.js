import React from "react";
import "styles/global.scss";
import "styles/components/index.scss";
import Navbar from "components/Navbar";
import Footer from "components/Footer";
import "util/analytics";
import { AuthProvider } from "util/auth";
import { QueryClientProvider } from "util/db";

function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider>
      <AuthProvider>
        <>
          <Navbar
            color="white"
            spaced={true}
            logo="/images/logo.png"
          />

          <Component {...pageProps} />

          <Footer
            color="light"
            size="normal"
            backgroundImage=""
            backgroundImageOpacity={1}
            copyright={`© ${new Date().getFullYear()} Realest System`}
            logo="/images/logo.png"
          />
        </>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
