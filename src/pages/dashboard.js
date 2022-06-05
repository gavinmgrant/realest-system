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
        subtitle=""
      />
    </>
  );
}

export default requireAuth(DashboardPage);
