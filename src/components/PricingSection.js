import React from "react";
import Link from "next/link";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import { useAuth } from "util/auth";
import { motion } from "framer-motion";

function PricingSection(props) {
  const auth = useAuth();

  const items = [
    {
      id: "free",
      name: "Free Plan",
      price: "0",
      perks: [
        "Create 1 property",
        "Add 1 unit per property",
        "Edit property details anytime",
        "Recalcuate investment analytics anytime",
        "Share a property report with unique URL",
        "Rent roll documenting each unit",
        "Data safely stored on AWS servers",
      ],
    },
    {
      id: "pro",
      name: "Pro Plan (Coming Soon)",
      price: "TBD",
      perks: [
        "All features in the Free Plan, plus:",
        "Create up to 20 properties",
        "Add multiple units per property",
        "Compare properties side-by-side",
        "Address autocomplete and suggestions",
        "Embedded map in property details",
        "Delete properties",
        "And more in development!",
      ],
    },
  ];

  return (
    <Section
      id="pricing"
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
        <div className="columns is-centered is-variable is-4 is-desktop">
          {items.map((item, index) => (
            <div
              className="PricingSection__column column is-one-half-desktop"
              key={index}
            >
              <div
                className={
                  "PricingSection__card card" +
                  (item.emphasized === true ? " emphasized" : "")
                }
              >
                <div className="PricingSection__card-content card-content">
                  <div className="PricingSection__name has-text-weight-bold">
                    {item.name}
                  </div>
                  <div className="PricingSection__price has-text-weight-bold is-size-1">
                    ${item.price}
                    <span className="PricingSection__period is-size-3">
                      /mo
                    </span>
                  </div>

                  {item.description && (
                    <p className="PricingSection__description">
                      {item.description}
                    </p>
                  )}

                  {item.perks && (
                    <ul className="PricingSection__perks">
                      {item.perks.map((perk, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: index * 0.2 },
                          }}
                        >
                          <i className="fas fa-check has-text-primary" />
                          {perk}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                  {/* TODO once ready to sell Pro Plans uncomment */}
                  {/* <Link
                    href={
                      auth.user
                        ? `/purchase/${item.id}`
                        : `/auth/signup?next=/purchase/${item.id}`
                    }
                    className="PricingSection__button button is-medium is-primary"
                  >
                    Choose
                  </Link> */}
                  <Link
                    href={item.id === "free" ? "/dashboard" : "#"}
                    className="PricingSection__button button is-medium is-primary"
                  >
                    {item.id === "free" ? "Choose" : "Coming Soon"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export default PricingSection;
