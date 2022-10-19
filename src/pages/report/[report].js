import React from "react";
import { useRouter } from "next/router";
import Meta from "components/Meta";
import ReportSection from "components/ReportSection";

function ReportPage(props) {
  const router = useRouter();
  const { report } = router.query;

  return (
    <>
      <Meta title="Property Report" />
      <ReportSection
        color="white"
        size="medium"
        backgroundImage=""
        backgroundImageOpacity={1}
        buttonColor="primary"
        buttonInverted={false}
        reportId={report}
      />
    </>
  );
};

export default ReportPage;
