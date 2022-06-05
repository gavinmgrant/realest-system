import React, { useState } from "react";
import { useForm } from "react-hook-form";
import FormAlert from "components/FormAlert";
import FormField from "components/FormField";
import { useAuth } from "util/auth";
import { useItem, updateItem, createItem } from "util/db";

function EditItemModal(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);

  const { register, handleSubmit, errors } = useForm();

  // This will fetch item if props.id is defined
  // Otherwise query does nothing and we assume
  // we are creating a new item.
  const { data: itemData, status: itemStatus } = useItem(props.id);

  // If we are updating an existing item
  // don't show modal until item data is fetched.
  if (props.id && itemStatus !== "success") {
    return null;
  }

  const onSubmit = (data) => {
    setPending(true);

    const query = props.id
      ? updateItem(props.id, data)
      : createItem({ owner: auth.user.uid, ...data });

    query
      .then(() => {
        // Let parent know we're done so they can hide modal
        props.onDone();
      })
      .catch((error) => {
        // Hide pending indicator
        setPending(false);
        // Show error alert message
        setFormAlert({
          type: "error",
          message: error.message,
        });
      });
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => props.onDone()} />
      <div className="EditItemModal__card card">
        <header className="card-header">
          <p className="card-header-title">
            {props.id && <>Update</>}
            {!props.id && <>Create</>}
            {` `}Item
          </p>
          <span className="card-header-icon">
            <button
              className="delete"
              aria-label="close"
              onClick={() => props.onDone()}
            >
              Done
            </button>
          </span>
        </header>
        <div className="card-content">
          {formAlert && (
            <FormAlert type={formAlert.type} message={formAlert.message} />
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              name="name"
              type="text"
              placeholder="Name"
              defaultValue={itemData && itemData.name}
              size="medium"
              error={errors.name}
              autoFocus={true}
              inputRef={register({
                required: "Please enter a name",
              })}
            />
            <div className="field">
              <div className="control">
                <button
                  className={
                    "button is-medium is-primary" +
                    (pending ? " is-loading" : "")
                  }
                  type="submit"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditItemModal;
