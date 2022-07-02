import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormAlert from "components/FormAlert";
import FormField from "components/FormField";
import { useAuth } from "util/auth";
import { useUnit, updateUnit, createUnit, deleteUnit } from "util/db";
import { toast } from "react-toastify";

function EditUnitModal(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);
  const [unitData, setUnitData] = useState(null);

  const { register, handleSubmit, errors } = useForm();

  // This will fetch unit if props.id is defined
  // Otherwise query does nothing and we assume
  // we are creating a new unit.
  const { data: data, status: unitStatus } = useUnit(props.id);

  // If unit data in database updates, update local unit state
  useEffect(() => {
    data && setUnitData(data);
  }, [data]);

  // If we are updating an existing unit
  // don't show modal until unit data is fetched.
  if (props.id && unitStatus !== "success") {
    return null;
  }

  const onSubmit = (data) => {
    setPending(true);

    const query = props.id
      ? updateUnit(props.id, data)
      : createUnit({
          user_id: auth.user.uid,
          property_id: props.propertyId,
          ...data,
        });

    if (props.id) {
      toast("Unit saved!");
    } else {
      toast("Unit created!");
    }

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

  const onDelete = (id) => {
    deleteUnit(id);
    toast("Unit deleted!");
    props.onDone();
  };

  return (
    <div className="modal is-active p-3">
      <div className="modal-background" onClick={() => props.onDone()} />
      <div className="EditUnitModal__card card">
        <header className="card-header">
          <p className="card-header-title">
            {props.id && <>Update</>}
            {!props.id && <>Create</>}
            {` `}Unit
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
            <div className="columns is-tablet">
              <div className="column">
                <FormField
                  name="number"
                  label="Unit Number"
                  type="text"
                  placeholder="Number"
                  defaultValue={unitData?.number}
                  size="medium"
                  error={errors.number}
                  autoFocus={true}
                  inputRef={register({
                    required: "Please enter a unit number",
                  })}
                />
                <FormField
                  name="rent_current"
                  label="Rent / month"
                  type="text"
                  placeholder="Rent"
                  defaultValue={unitData?.rent_current}
                  size="medium"
                  error={errors.rent_current}
                  inputRef={register({
                    required: "Please enter the rent for this unit",
                  })}
                />
                <div className="columns is-mobile">
                  <div className="column">
                    <FormField
                      name="income_parking"
                      label="Parking fee / month"
                      type="text"
                      placeholder="Parking fee"
                      defaultValue={unitData?.income_parking}
                      size="medium"
                      error={errors.income_parking}
                      inputRef={register({
                        required: "Please enter a parking fee or 0 if none",
                      })}
                    />
                  </div>
                  <div className="column">
                    <FormField
                      name="income_storage"
                      label="Storage fee / month"
                      type="text"
                      placeholder="Storage fee"
                      defaultValue={unitData?.income_storage}
                      size="medium"
                      error={errors.income_storage}
                      inputRef={register({
                        required: "Please enter a storage fee or 0 if none",
                      })}
                    />
                  </div>
                </div>
              </div>
              {props.tab === "rent-roll" && (
                <div className="column">
                  <FormField
                    name="rent_market"
                    label="Market Rent / month"
                    type="text"
                    placeholder="Market Rent"
                    defaultValue={unitData?.rent_market}
                    size="medium"
                    error={errors.rent_market}
                    inputRef={register({
                      required: "Please enter the market rent for this unit",
                    })}
                  />
                  <div className="columns is-mobile">
                    <div className="column">
                      <FormField
                        name="bedrooms"
                        label="Bedrooms"
                        type="text"
                        placeholder="Bedrooms"
                        defaultValue={unitData && unitData.bedrooms}
                        size="medium"
                        error={errors.bedrooms}
                        inputRef={register({
                          required:
                            "Please enter the number of bedrooms in this unit",
                        })}
                      />
                    </div>
                    <div className="column">
                      <FormField
                        name="baths"
                        label="Baths"
                        type="text"
                        placeholder="Baths"
                        defaultValue={unitData && unitData.baths}
                        size="medium"
                        error={errors.baths}
                        inputRef={register({
                          required:
                            "Please enter the number of bathrooms in this unit",
                        })}
                      />
                    </div>
                    <div className="column">
                      <FormField
                        name="floor_area"
                        label="Floor Area"
                        type="text"
                        placeholder="Floor Area"
                        defaultValue={unitData && unitData.floor_area}
                        size="medium"
                        error={errors.floor_area}
                        inputRef={register({
                          required: "Please enter the floor area for this unit",
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="field">
              <div className="control is-flex is-justify-content-space-between">
                <button
                  className={
                    "button is-primary mt-3" + (pending ? " is-loading" : "")
                  }
                  type="submit"
                >
                  Save
                  <span className="icon is-small ml-2">
                    <i className="fas fa-check"></i>
                  </span>
                </button>
                {props.id && (
                  <button
                    className="button is-danger mt-3"
                    aria-label="delete"
                    type="button"
                    onClick={() => onDelete(props.id)}
                  >
                    Delete
                    <span className="icon is-small ml-2">
                      <i className="fas fa-trash"></i>
                    </span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUnitModal;
