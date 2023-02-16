import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import FormField from "components/FormField";
import { useAuth } from "util/auth";

function SettingsGeneral(props) {
  const auth = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const { register, handleSubmit, errors } = useForm();

  const isProUser = auth.user.planIsActive && auth.user.planId === "pro";

  const onSubmit = (data) => {
    // Show pending indicator
    setPending(true);

    return auth
      .updateProfile({ ...data, name: data.name_first + " " + data.name_last })
      .then(() => {
        // Set success status
        props.onStatus({
          type: "success",
          message: "Your profile has been updated",
        });
      })
      .catch((error) => {
        if (error.code === "auth/requires-recent-login") {
          props.onStatus({
            type: "requires-recent-login",
            // Resubmit after reauth flow
            callback: () => onSubmit(data),
          });
        } else {
          // Set error status
          props.onStatus({
            type: "error",
            message: error.message,
          });
        }
      })
      .finally(() => {
        // Hide pending indicator
        setPending(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        name="name_first"
        type="text"
        label="First Name"
        defaultValue={auth.user.name_first}
        placeholder="First Name"
        size="medium"
        error={errors.name_first}
        inputRef={register({
          required: "Please enter your first name",
        })}
      />
      <FormField
        name="name_last"
        type="text"
        label="Last Name"
        defaultValue={auth.user.name_last}
        placeholder="Last Name"
        size="medium"
        error={errors.name_last}
        inputRef={register({
          required: "Please enter your last name",
        })}
      />
      <FormField
        name="email"
        type="email"
        label="Email"
        defaultValue={auth.user.email}
        placeholder="Email"
        size="medium"
        error={errors.email}
        inputRef={register({
          required: "Please enter your email",
        })}
      />
      <div
        width="100%"
        className="is-flex flex-direction-row is-justify-content-space-between is-align-items-end"
      >
        <FormField
          name="plan"
          type="test"
          label="Plan"
          defaultValue={isProUser ? "Pro" : "Free"}
          disabled
          size="medium"
          style={{ width: "10rem" }}
        />
        {!isProUser ? (
          <button
            type="button"
            className="button is-info is-medium"
            style={{ marginBottom: "12px" }}
            onClick={(e) => router.push("/pricing")}
          >
            Upgrade
          </button>
        ) : (
          <button
            type="button"
            className="button is-info is-medium"
            style={{ marginBottom: "12px" }}
            onClick={(e) => router.push("/settings/billing")}
          >
            Manage Billing
          </button>
        )}
      </div>

      <div className="field">
        <div className="control">
          <button
            className={
              "button is-medium mt-4" +
              (props.buttonColor ? ` is-${props.buttonColor}` : "") +
              (props.buttonInverted ? " is-inverted" : "") +
              (pending ? " is-loading" : "")
            }
            type="submit"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}

export default SettingsGeneral;
