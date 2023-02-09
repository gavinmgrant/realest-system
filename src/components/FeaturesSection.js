import React from "react";
import { useRouter } from "next/router";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import { motion } from "framer-motion";

function FeaturesSection(props) {
  const router = useRouter();
  let items = [];

  if (router.pathname === "/") {
    items = [
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
  } else {
    items = [
      {
        title: "Create Multiple Properties",
        description: "Add up to 20 properties in your accounts.",
        image: "/pro/multiple-properties.png",
      },
      {
        title: "Add Multiple Units",
        description:
          "Add more than one unit to any property for duplexes, triplexes, quads, and more.",
        image: "/pro/multiple-units.png",
      },
      {
        title: "Compare Properties",
        description:
          "Easily compare analytics of two properties by viewin them side-by-side.",
        image: "/pro/compare.png",
      },
      {
        title: "Address Autocomplete",
        description:
          "Real addresses are suggesteed to you as you type in an address to autocomplete it quickly.",
        image: "/pro/autocomplete.png",
      },
      {
        title: "Embedded Maps",
        description:
          "Reference embedded maps locating each property in your property details.",
        image: "/pro/maps.png",
      },
      {
        title: "Delete Properties",
        description: "Delete any property that you no longer need.",
        image: "/pro/delete.png",
      },
    ];
  }

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
                <motion.p
                  className="subtitle"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  viewport={{ once: true }}
                >
                  {item.description}
                </motion.p>
              </div>
              <motion.div
                className="column"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                <figure className="FeaturesSection__image image">
                  <img src={item.image} alt={item.title} />
                </figure>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default FeaturesSection;
