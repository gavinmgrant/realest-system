import React from "react";
import Meta from "components/Meta";
import PricingSection from "components/PricingSection";

function PricingPage(props) {
  return (
    <>
      <Meta title="Pricing" />
      <PricingSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        title="Pricing"
        subtitle="We are in beta right now and will be offering a pro plan in the future. All accounts are free plans today."
      />
    </>
  );
}

export default PricingPage;
