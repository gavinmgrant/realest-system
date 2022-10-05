import React from "react";
import Link from "next/link";
import Meta from "components/Meta";
import HeroSection from "components/HeroSection";
import ClientsSection from "components/ClientsSection";
import FeaturesSection from "components/FeaturesSection";
import CenteredColumns from "components/CenteredColumns";
// import TestimonialsSection from "components/TestimonialsSection";
// import NewsletterSection from "components/NewsletterSection";

function IndexPage(props) {
  return (
    <>
      <Meta />
      <HeroSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="A real estate system for independent landlords."
        subtitle="Use our system to quickly calculate investment analytics. Create a free account to begin!"
        image="/illustrations/landing-hero.svg"
        buttonText="Create account"
        buttonColor="primary"
        buttonInverted={false}
        buttonPath="/auth/signup"
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
      {/* <NewsletterSection
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
      /> */}
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
              Create account to begin
            </a>
          </Link>
        </div>
      </CenteredColumns>
    </>
  );
}

export default IndexPage;
