/** @format */

import React from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";

function ClientsSection(props) {
  const items = [
    {
      name: "Run the numbers",
      path: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
    {
      name: "Save time",
      path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      name: "Earn more",
      path: "M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
  ];

  return (
    <Section
      color={props.color}
      size={props.size}
      backgroundImage={props.backgroundImage}
      backgroundImageOpacity={props.backgroundImageOpacity}
    >
      <div className="container">
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={3}
          spaced={true}
          className="has-text-centered"
        />
        <div className="columns is-centered is-multiline">
          {items.map((item, index) => (
            <div key={index} className="column is-flex is-flex-direction-column is-align-items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                width={48}
                height={48}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={item.path}
                />
              </svg>
              <p>{item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default ClientsSection;
