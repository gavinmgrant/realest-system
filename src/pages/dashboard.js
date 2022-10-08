import React from "react";
import Meta from "components/Meta";
import DashboardSection from "components/DashboardSection";
import { requireAuth } from "util/auth";

function DashboardPage(props) {
  return (
    <>
      <Meta title="Dashboard" />
      <DashboardSection
        color="white"
        size="medium"
        title="Dashboard"
        subtitle="We are in beta right now and will be offering a pro plan that allows you to compare multiple properties side-by-side in the future. All accounts are free plans today and have a 1 property limit."
      />
    </>
  );
}

export default requireAuth(DashboardPage);
