import React from "react";
import Section from "components/Section";
import TabInvestment from "components/TabInvestment";
import { useProperty, useUnitsForProperty } from "util/db";

function ReportSection(props) {
  const property = useProperty(props.reportId);
  const { data: units } = useUnitsForProperty(props.reportId);
  const propArray = Array(property.data);

  if (!property || property.status === "loading" || !units) return <></>;

  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
    >
      <div className="container">
        <TabInvestment
          properties={propArray}
          currentPropertyId={props.reportId}
          units={units}
        />
      </div>
    </Section>
  );
}
export default ReportSection;
