import React from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";

function FeaturesSection(props) {
  const items = [
    {
      title: "Mortgage information",
      description:
        "Enter loan information such as price, down payment, and interest rate.",
      image: "/illustrations/1.png",
    },
    {
      title: "Monthly expenses",
      description:
        "Enter monthly expenses such as taxes, insurance, utilties, and maintenance costs.",
      image: "/illustrations/2.png",
    },
    {
      title: "Monthly income",
      description:
        "Add units to the property and enter income such as rent, parking, and storage.",
      image: "/illustrations/3.png",
    },
    {
      title: "Get investment analytics",
      description:
        "We provide key investment analytics, like cash flow, gross rent multiplier, cap rate, and net operating income. Make an informed residential real estate purchase.",
      image: "/illustrations/4.png",
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
