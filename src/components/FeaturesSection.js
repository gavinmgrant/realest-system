import React from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";

function FeaturesSection(props) {
  const items = [
    {
      title: "Calculators",
      description:
        "Input a few numbers and our calculators provide key investment analytics, like cash flow, gross rent multiplier, and cap rate.",
      image: "/illustrations/calculators.svg",
    },
    {
      title: "Guides",
      description:
        "Our checklists and cheat sheets guide you through what to look for in residential real estate to make a sound investment.",
      image: "/illustrations/guides.svg",
    },
    {
      title: "Tenant Management",
      description:
        "Evaluate tenants, download rental application forms, and email templates to communicate clearly to tenants.",
      image: "/illustrations/tenant-management.svg",
    },
    {
      title: "Property Management",
      description:
        "Track key metrics for each of your properties in a rent roll and manage them like a business.",
      image: "/illustrations/property-management.svg",
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
        <div className="FeaturesSection__features">
          {items.map((item, index) => (
            <div
              className="FeaturesSection__columns columns is-variable is-8 is-vcentered has-text-centered-mobile"
              key={index}
            >
              <div className="column is-half">
                <h3 className="FeaturesSection__title title has-text-weight-bold is-spaced is-3">
                  {item.title}
                </h3>
                <p className="subtitle">{item.description}</p>
              </div>
              <div className="column">
                <figure className="FeaturesSection__image image">
                  <img src={item.image} alt={item.title} />
                </figure>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default FeaturesSection;
