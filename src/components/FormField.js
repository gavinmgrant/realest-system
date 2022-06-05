import React from "react";

function FormField(props) {
  const { error, type, size, inputRef, ...inputProps } = props;

  return (
    <div className="field">
      {props.label && (
        <label className="label" htmlFor={props.id}>
          {props.label}
        </label>
      )}

      <div className="control">
        {type === "textarea" && (
          <textarea
            className={`textarea is-${size}`}
            ref={inputRef}
            {...inputProps}
          />
        )}

        {type !== "textarea" && (
          <input
            className={`input is-${size}`}
            ref={inputRef}
            type={type}
            {...inputProps}
          />
        )}
      </div>

      {error && <p className="help is-danger">{error.message}</p>}
    </div>
  );
}

export default FormField;
