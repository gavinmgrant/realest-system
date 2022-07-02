import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import FormAlert from "components/FormAlert";
import FormField from "components/FormField";
import EditUnitModal from "components/EditUnitModal";
import DeleteModal from "./DeleteModal";
import { useAuth } from "util/auth";
import { formatCurrency } from "../util/util";
import {
  useProperty,
  updateProperty,
  createProperty,
  useUnitsByProperty,
} from "util/db";
import { toast } from "react-toastify";

function EditProperty(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [updatingUnitId, setUpdatingUnitId] = useState(null);
  const [deletingProperty, setDeletingProperty] = useState(false);

  const { register, handleSubmit, errors } = useForm();

  // This will fetch property if props.id is defined
  // Otherwise query does nothing and we assume
  // we are creating a new property.
  const { data: propertyData, status: propertyStatus } = useProperty(props.id);

  const { data: units } = useUnitsByProperty(props.id, auth.user.uid);

  // If we are updating an existing property
  // don't show until property data is fetched.
  if (props.id && propertyStatus !== "success") {
    return null;
  }

  const onSubmit = (data) => {
    setPending(true);

    const query = props.id
      ? updateProperty(props.id, data)
      : createProperty({ user_id: auth.user.uid, ...data });

    if (props.id) {
      toast("Property saved!");
    } else {
      toast("Property created!");
    }

    query
      .then(() => {
        // Let parent know we're done so they can hide the view.
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
    <>
      <header className="panel panel-heading has-background-light py-3 px-4 is-flex is-justify-content-space-between is-align-items-center">
        <h2 className="title is-4 m-0">
          {props.id ? "Edit" : "Create"}
          {` `}Property
        </h2>
        <button className="button" onClick={() => props.onDone()}>
          Cancel
          <span className="icon is-small ml-2">
            <i className="fas fa-ban"></i>
          </span>
        </button>
      </header>

      <div className="DashboardProperties__panel panel">
        {formAlert && (
          <FormAlert type={formAlert.type} message={formAlert.message} />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            name="address"
            label="Address"
            type="text"
            placeholder="Address"
            defaultValue={propertyData && propertyData.address}
            size="medium"
            error={errors.address}
            autoFocus={true}
            inputRef={register({
              required: "Please enter an address",
            })}
          />

          {props.id && (
            <div className="columns is-desktop mt-4">
              <section className="column">
                <h3 className="title is-5">Mortgage</h3>

                <FormField
                  name="purchase_price"
                  label="Purchase Price"
                  type="number"
                  placeholder="Purchase Price"
                  defaultValue={propertyData && propertyData.purchase_price}
                  size="medium"
                  error={errors.purchase_price}
                  inputRef={register({
                    required: "Please enter a purchase price",
                  })}
                />
                <FormField
                  name="down_payment"
                  label="Down Payment"
                  type="number"
                  placeholder="Down Payment"
                  defaultValue={propertyData && propertyData.down_payment}
                  size="medium"
                  error={errors.down_payment}
                  inputRef={register({
                    required: "Please enter a down payment",
                  })}
                />
                <FormField
                  name="loan_interest_rate"
                  label="Loan Interest Rate (in decimals)"
                  type="float"
                  placeholder="Loan Interest Rate"
                  defaultValue={propertyData && propertyData.loan_interest_rate}
                  size="medium"
                  error={errors.loan_interest_rate}
                  inputRef={register({
                    required: "Please enter an interest rate",
                  })}
                />
                <FormField
                  name="loan_period"
                  label="Loan Period (in months)"
                  type="number"
                  placeholder="Loan Period in Months"
                  defaultValue={propertyData && propertyData.loan_period}
                  size="medium"
                  error={errors.loan_period}
                  inputRef={register({
                    required: "Please enter the number of months",
                  })}
                />
              </section>

              <section className="column">
                <h3 className="title is-5">Monthly Expenses</h3>

                <FormField
                  name="exp_property_taxes"
                  label="Property Taxes"
                  type="number"
                  placeholder="Property Taxes"
                  defaultValue={propertyData && propertyData.exp_property_taxes}
                  size="medium"
                  error={errors.exp_property_taxes}
                  inputRef={register({
                    required:
                      "Please enter an amount for annual property taxes",
                  })}
                />
                <FormField
                  name="exp_property_manager"
                  label="Property Manager"
                  type="number"
                  placeholder="Property Manager"
                  defaultValue={
                    propertyData && propertyData.exp_property_manager
                  }
                  size="medium"
                  error={errors.exp_property_manager}
                  inputRef={register({
                    required: "Please enter a fee for property management",
                  })}
                />
                <FormField
                  name="exp_insurance_umbrella"
                  label="Umbrella Insurance"
                  type="number"
                  placeholder="Umbrella Insurance"
                  defaultValue={
                    propertyData && propertyData.exp_insurance_umbrella
                  }
                  size="medium"
                  error={errors.exp_insurance_umbrella}
                  inputRef={register({
                    required: "Please enter a fee for umbrella insurance",
                  })}
                />
                <FormField
                  name="exp_insurance_hazard"
                  label="Hazard Insurance"
                  type="number"
                  placeholder="Hazard Insurance"
                  defaultValue={
                    propertyData && propertyData.exp_insurance_hazard
                  }
                  size="medium"
                  error={errors.exp_insurance_hazard}
                  inputRef={register({
                    required: "Please enter a fee for hazard insurance",
                  })}
                />
                <FormField
                  name="exp_water_sewer"
                  label="Water and Sewer"
                  type="number"
                  placeholder="Water and Sewer"
                  defaultValue={propertyData && propertyData.exp_water_sewer}
                  size="medium"
                  error={errors.exp_water_sewer}
                  inputRef={register({
                    required: "Please enter an amount for water and sewer",
                  })}
                />
                <FormField
                  name="exp_landscape"
                  label="Landscape"
                  type="number"
                  placeholder="Landscape"
                  defaultValue={propertyData && propertyData.exp_landscape}
                  size="medium"
                  error={errors.exp_landscape}
                  inputRef={register({
                    required:
                      "Please enter an amount for landscape maintenance",
                  })}
                />
                <FormField
                  name="exp_maintenance"
                  label="Maintenance"
                  type="number"
                  placeholder="Maintenance"
                  defaultValue={propertyData && propertyData.exp_maintenance}
                  size="medium"
                  error={errors.exp_maintenance}
                  inputRef={register({
                    required:
                      "Please enter an amount for any additional maintenance",
                  })}
                />
                <FormField
                  name="exp_vacancy"
                  label="Vacancy"
                  type="number"
                  placeholder="Vacancy"
                  defaultValue={propertyData && propertyData.exp_vacancy}
                  size="medium"
                  error={errors.exp_maintenance}
                  inputRef={register({
                    required:
                      "Please enter an amount for any rent lost due to vacancy",
                  })}
                />
              </section>

              <section className="column">
                <h3 className="title is-5">Monthly Income</h3>

                <table className="table is-fullwidth is-hoverable is-bordered">
                  <thead>
                    <tr>
                      <th className="pt-0" scope="col">
                        Unit
                      </th>
                      <th className="pt-0" scope="col">
                        Rent
                      </th>
                      <th className="pt-0" scope="col">
                        Parking
                      </th>
                      <th className="pt-0" scope="col">
                        Storage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {units
                      ?.sort((a, b) => a.number - b.number)
                      .map((unit, index) => (
                        <tr
                          className="is-clickable"
                          key={index}
                          onClick={() => setUpdatingUnitId(unit.id)}
                        >
                          <td>{unit.number}</td>
                          <td>{formatCurrency(unit.rent_current)}</td>
                          <td>{formatCurrency(unit.income_parking)}</td>
                          <td>{formatCurrency(unit.income_storage)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <button
                  className="button is-primary"
                  onClick={() => setCreatingUnit(true)}
                  type="button"
                >
                  Add Unit
                  <span className="icon is-small ml-2">
                    <i className="fas fa-plus"></i>
                  </span>
                </button>
              </section>
            </div>
          )}

          <div className="field">
            <div className="control is-flex is-justify-content-space-between">
              <button
                className={
                  "button is-primary my-2" + (pending ? " is-loading" : "")
                }
                type="submit"
              >
                {props.id ? "Save" : "Create"}
                <span className="icon is-small ml-2">
                  <i className="fas fa-check"></i>
                </span>
              </button>
              {props.id && units?.length < 1 && (
                <button
                  className="button is-danger my-2"
                  aria-label="delete"
                  type="button"
                  onClick={() => setDeletingProperty(props.id)}
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

      {creatingUnit && (
        <EditUnitModal
          propertyId={props.id}
          onDone={() => {
            setCreatingUnit(false);
          }}
        />
      )}

      {updatingUnitId && (
        <EditUnitModal
          propertyId={props.id}
          id={updatingUnitId}
          tab={props.tab}
          onDone={() => {
            setUpdatingUnitId(null);
          }}
        />
      )}

      {deletingProperty && (
        <DeleteModal
          onDone={() => setDeletingProperty(false)}
          onDelete={() => {
            props.onDelete();
          }}
        />
      )}
    </>
  );
}

export default EditProperty;
