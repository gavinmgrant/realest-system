import React, { useState } from "react";
import Section from "components/Section";
import SectionHeader from "components/SectionHeader";

function FaqSection(props) {
  // Object to store expanded state for all items
  const [expanded, setExpanded] = useState({});
  // Set an item's expanded state
  const setExpandedItem = (index, isExpanded) => {
    setExpanded({
      ...expanded,
      [index]: isExpanded,
    });
  };

  const items = [
    {
      question: "What investment analytics are provided after I input my information?",
      answer:
        "After you input mortgage, monthly expenses, and monthly income information, we calculate your property's total cash flow, gross rent multiplier (GRM), CAP rate, and net operating income (NOI).",
    },
    {
      question: "How do I delete a property?",
      answer:
        "You can only delete a property with a Pro Plan. First, delete all units in the property by clicking on each unit and deleting them. Once all units have been deleted, a red delete button will appear at the bottom of the screen when editing a property.",
    },
    {
      question: "How can I contact Realest System?",
      answer:
        "Email us at hello@realestsystem.com.",
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

        {items.map((item, index) => (
          <article
            className="FaqSection__faq-item"
            onClick={() => {
              setExpandedItem(index, !expanded[index]);
            }}
            key={index}
          >
            <div className="title is-spaced is-4">
              <span className="FaqSection__icon icon is-size-5 has-text-primary">
                <i
                  className={
                    "fas" +
                    (expanded[index] ? " fa-minus" : "") +
                    (!expanded[index] ? " fa-plus" : "")
                  }
                />
              </span>
              {item.question}
            </div>

            {expanded[index] && <div className="subtitle">{item.answer}</div>}
          </article>
        ))}
      </div>
    </Section>
  );
}

export default FaqSection;
