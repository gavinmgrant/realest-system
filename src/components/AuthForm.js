import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FormField from "components/FormField";
import { useAuth } from "util/auth";
import newsletter from "util/newsletter";

function AuthForm(props) {
  const auth = useAuth();

  const [pending, setPending] = useState(false);
  const [subscribeToNewsletter, setSubscribeToNewsletter] = useState(true);
  const { handleSubmit, register, errors, getValues } = useForm();

  const submitHandlersByType = {
    signin: ({ email, pass }) => {
      return auth.signin(email, pass).then((user) => {
        // Call auth complete handler
        props.onAuth(user);
      });
    },
    signup: ({ email, pass }) => {
      return auth.signup(email, pass).then((user) => {
        // Call auth complete handler
        props.onAuth(user);
        // If checkbox is selected, subscribe to newsletter
        if (subscribeToNewsletter) {
          newsletter.subscribe({ email });
        }
      });
    },
    forgotpass: ({ email }) => {
      return auth.sendPasswordResetEmail(email).then(() => {
        setPending(false);
        // Show success alert message
        props.onFormAlert({
          type: "success",
          message: "Password reset email sent",
        });
      });
    },
    changepass: ({ pass }) => {
      return auth.confirmPasswordReset(pass).then(() => {
        setPending(false);
        // Show success alert message
        props.onFormAlert({
          type: "success",
          message: "Your password has been changed",
        });
      });
    },
  };

  // Handle form submission
  const onSubmit = ({ email, pass }) => {
    // Show pending indicator
    setPending(true);

    // Call submit handler for auth type
    submitHandlersByType[props.type]({
      email,
      pass,
    }).catch((error) => {
      setPending(false);
      // Show error alert message
      props.onFormAlert({
        type: "error",
        message: error.message,
      });
    });
  };

  const handleCheckbox = () => {
    setSubscribeToNewsletter(!subscribeToNewsletter);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {["signup", "signin", "forgotpass"].includes(props.type) && (
        <FormField
          name="email"
          type="email"
          placeholder="Email"
          size="medium"
          error={errors.email}
          inputRef={register({
            required: "Please enter an email",
          })}
        />
      )}

      {["signup", "signin", "changepass"].includes(props.type) && (
        <FormField
          name="pass"
          type="password"
          placeholder="Password"
          size="medium"
          error={errors.pass}
          inputRef={register({
            required: "Please enter a password",
          })}
        />
      )}

      {["signup", "changepass"].includes(props.type) && (
        <FormField
          name="confirmPass"
          type="password"
          placeholder="Confirm Password"
          size="medium"
          error={errors.confirmPass}
          inputRef={register({
            required: "Please enter your password again",
            validate: (value) => {
              if (value === getValues().pass) {
                return true;
              } else {
                return "This doesn't match your password";
              }
            },
          })}
        />
      )}

      <div className="field">
        <p className="control ">
          <button
            className={
              "button is-medium is-fullwidth" +
              (props.buttonColor ? ` is-${props.buttonColor}` : "") +
              (props.buttonInverted ? " is-inverted" : "") +
              (pending ? " is-loading" : "")
            }
            type="submit"
          >
            {props.buttonAction}
          </button>
        </p>
      </div>

      {["signup"].includes(props.type) && (
        <label className="checkbox">
          <input
            type="checkbox"
            checked={subscribeToNewsletter}
            onChange={handleCheckbox}
          />
          <span className="ml-2">
            Subscribe to newsletter for product updates
          </span>
        </label>
      )}
    </form>
  );
}

export default AuthForm;
