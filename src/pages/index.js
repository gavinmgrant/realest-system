import React from "react";
import Link from "next/link";
import Meta from "components/Meta";
import HeroSection from "components/HeroSection";
import ClientsSection from "components/ClientsSection";
import FeaturesSection from "components/FeaturesSection";
import CenteredColumns from "components/CenteredColumns";
import { useAuth } from "util/auth";
// import TestimonialsSection from "components/TestimonialsSection";
import NewsletterSection from "components/NewsletterSection";

function IndexPage(props) {
  const auth = useAuth();
  const { user } = auth;

  return (
    <>
      <Meta />
      <HeroSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Quickly calculate your return on investment for residential income properties."
        subtitle="Residential real estate investors, sign up for free! Save your work and return at anytime to review your properties analytics."
        image="/hero-animation.gif"
        buttonText={user ? "Go to Dashboard" : "Create Account"}
        buttonColor="primary"
        buttonInverted={false}
        buttonPath={user ? "/dashboard" : "/auth/signup"}
      />
      <ClientsSection
        color="light"
        size="normal"
        backgroundImage=""
        backgroundImageOpacity={1}
        title=""
        subtitle=""
      />
      <FeaturesSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title=""
        subtitle=""
      />
      {/* <TestimonialsSection
        color="light"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Here's what people are saying about Realest System"
        subtitle=""
      /> */}
      {!user && (
        <CenteredColumns>
          <div className="column is-flex is-flex-direction-column is-align-items-center">
            <Link href="/auth/signup">
              <a
                className={
                  "button is-medium is-primary mt-5 mb-5" +
                  (props.buttonColor ? ` is-${props.buttonColor}` : "") +
                  (props.buttonInverted ? " is-inverted" : "")
                }
              >
                Create Account to Begin
              </a>
            </Link>
          </div>
        </CenteredColumns>
      )}
      <NewsletterSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Stay in the know"
        subtitle="Receive our latest product and feature updates"
        buttonText="Subscribe"
        buttonColor="primary"
        buttonInverted={false}
        inputPlaceholder="Enter your email"
        subscribedMessage="You are now subscribed!"
      />
    </>
  );
}

export default IndexPage;
