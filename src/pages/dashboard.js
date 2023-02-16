import React from "react";
import Meta from "components/Meta";
import DashboardSection from "components/DashboardSection";
import { PROLIMIT } from "components/DashboardProperties";
import { useAuth, requireAuth } from "util/auth";

function DashboardPage(props) {
  const auth = useAuth();
  const isProUser = auth.user?.planIsActive && auth.user?.planId === "pro";

  return (
    <>
      <Meta title="Dashboard" />
      <DashboardSection
        color="white"
        size="medium"
        title="Dashboard"
        subtitle={
          isProUser
            ? `Welcome back ${
                auth.user.name_first ? auth.user.name_first : "Pro Plan user"
              }! You can add up to ${PROLIMIT} properties with your Pro Plan.`
            : "Free Plans have a 1 property limit. Upgrade to a Pro Plan to add more."
        }
      />
    </>
  );
}

export default requireAuth(DashboardPage);
