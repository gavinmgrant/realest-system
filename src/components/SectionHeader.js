import React from "react";

function SectionHeader(props) {
  // Render nothing if no title or subtitle
  if (!props.title && !props.subtitle) {
    return null;
  }

  return (
    <header
      className={
        "SectionHeader" + (props.className ? ` ${props.className}` : "")
      }
    >
      {props.title && (
        <h1
          className={
            "title has-text-weight-bold" +
            (props.size ? ` is-${props.size}` : "") +
            (props.size === 1 ? " is-size-2-mobile" : "") +
            (props.spaced ? " is-spaced" : "")
          }
        >
          {props.title}
        </h1>
      )}

      {props.subtitle && (
        <p
          className={
            "SectionHeader__subtitle subtitle is-size-6"
          }
        >
          {props.subtitle}
        </p>
      )}
    </header>
  );
}

export default SectionHeader;
