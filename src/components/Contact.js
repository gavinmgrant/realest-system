import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FormAlert from "components/FormAlert";
import FormField from "components/FormField";
import contact from "util/contact";

function Contact(props) {
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);
  const { handleSubmit, register, errors, reset } = useForm();

  const onSubmit = (data) => {
    // Show pending indicator
    setPending(true);

    contact
      .submit(data)
      .then(() => {
        // Clear form
        reset();
        // Show success alert message
        setFormAlert({
          type: "success",
          message: "Your message has been sent!",
        });
      })
      .catch((error) => {
        // Show error alert message
        setFormAlert({
          type: "error",
          message: error.message,
        });
      })
      .finally(() => {
        // Hide pending indicator
        setPending(false);
      });
  };

  return (
    <>
      {formAlert && (
        <FormAlert type={formAlert.type} message={formAlert.message} />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field is-horizontal">
          <div className="field-body">
            {props.showNameField && (
              <FormField
                name="name"
                type="text"
                size="medium"
                placeholder="Name"
                error={errors.name}
                inputRef={register({
                  required: "Please enter your name",
                })}
              />
            )}

            <FormField
              name="email"
              type="email"
              size="medium"
              placeholder="Email"
              error={errors.email}
              inputRef={register({
                required: "Please enter your email",
              })}
            />
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-body">
            <FormField
              name="message"
              type="textarea"
              size="medium"
              placeholder="Message"
              rows={5}
              error={errors.message}
              inputRef={register({
                required: "Please enter a message",
              })}
            />
          </div>
        </div>
        <div className="field is-horizontal">
          <div className="field-body">
            <div className="field">
              <div className="control">
                <button
                  className={
                    "button is-medium" +
                    (props.buttonColor ? ` is-${props.buttonColor}` : "") +
                    (props.buttonInverted ? " is-inverted" : "") +
                    (pending ? " is-loading" : "")
                  }
                  type="submit"
                >
                  {props.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Contact;
