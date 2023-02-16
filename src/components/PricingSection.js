import React, { useState } from "react";
import Link from "next/link";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";
import { PROLIMIT } from "./DashboardProperties";
import { PROLIMITUNITS } from "./EditProperty";
import { useAuth } from "util/auth";
import { motion } from "framer-motion";

function PricingSection(props) {
  const auth = useAuth();
  const [annual, setAnnual] = useState(false);

  const isProUser = auth.user?.planIsActive && auth.user?.planId === "pro";

  const items = [
    {
      id: "free",
      name: "Free Plan",
      price: "0",
      price_year: "0",
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
      id: annual ? "pro-annual" : "pro",
      name: "Pro Plan (7 day free trial)",
      price: annual ? "2" : "3",
      price_year: annual ? "24" : "36",
      perks: [
        "All features in the Free Plan, plus:",
        `Create up to ${PROLIMIT} properties`,
        `Add up to ${PROLIMITUNITS} units per property`,
        "Compare properties side-by-side",
        "Address autocomplete and suggestions",
        "Embedded map in property details",
        "Delete properties",
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
                  <div
                    width="100%"
                    className="PricingSection__name has-text-weight-bold is-size-4 is-flex-tablet flex-direction-row is-justify-content-space-between is-align-items-center"
                  >
                    <div>{item.name}</div>
                    {item.id !== "free" && annual && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                      >
                        💰 Save 33%
                      </motion.div>
                    )}
                  </div>

                  <div
                    width="100%"
                    className="is-flex flex-direction-row is-justify-content-space-between is-align-items-center"
                  >
                    <div className="PricingSection__price has-text-weight-bold is-size-1">
                      ${item.price}
                      <span className="PricingSection__period is-size-3">
                        /mo
                      </span>
                    </div>

                    {item.id !== "free" && (
                      <div className="PricingSection__price has-text-weight-bold is-size-3">
                        ${item.price_year}
                        <span className="PricingSection__period">/year</span>
                      </div>
                    )}
                  </div>

                  {item.id !== "free" && (
                    <div
                      width="100%"
                      className="is-flex flex-direction-row is-justify-content-space-between is-align-items-center mb-3"
                    >
                      <div className="PricingSection__period is-size-3 has-text-weight-bold">
                        Bill:
                      </div>
                      <div>
                        <button
                          type="button"
                          className="button is-info is-medium"
                          onClick={() => setAnnual(false)}
                          style={{ opacity: annual ? 0.25 : 1 }}
                        >
                          Monthly
                        </button>
                        <button
                          type="button"
                          className="button is-info is-medium ml-2"
                          onClick={() => setAnnual(true)}
                          style={{ opacity: annual ? 1 : 0.25 }}
                        >
                          Yearly
                        </button>
                      </div>
                    </div>
                  )}

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
                          whileInView={{
                            opacity: 1,
                            y: 0,
                            transition: { delay: index * 0.2 },
                          }}
                          viewport={{ once: true }}
                        >
                          <i className="fas fa-check has-text-primary" />
                          {perk}
                        </motion.li>
                      ))}
                    </ul>
                  )}
                  {(!auth.user || (auth.user && item.id !== "free")) && (
                    <Link
                      href={
                        auth.user
                          ? isProUser
                            ? "/dashboard"
                            : `/purchase/${item.id}`
                          : item.id === "free"
                          ? "/auth/signup"
                          : `/auth/signup?next=/purchase/${item.id}`
                      }
                      className="PricingSection__button button is-medium is-primary"
                    >
                      {!auth.user
                        ? "Choose"
                        : isProUser
                        ? "You are subscribed to this plan."
                        : "Upgrade"}
                    </Link>
                  )}
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
