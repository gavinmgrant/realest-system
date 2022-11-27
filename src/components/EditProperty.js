import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import FormAlert from "components/FormAlert";
import FormField from "components/FormField";
import EditUnitModal from "components/EditUnitModal";
import AddressAutocomplete from "components/AddressAutoComplete";
import DeleteModal from "./DeleteModal";
import RatesModal from "./RatesModal";
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
  const router = useRouter();
  const { register, handleSubmit, errors } = useForm();

  // This will fetch property if props.id is defined
  // Otherwise query does nothing and we assume
  // we are creating a new property.
  const { data: propertyData, status: propertyStatus } = useProperty(props.id);

  const auth = useAuth();
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [updatingUnitId, setUpdatingUnitId] = useState(null);
  const [isRatesModalOpen, setIsRatesModalOpen] = useState(false);
  const [deletingProperty, setDeletingProperty] = useState(false);
  const [canAddUnit, setCanAddUnit] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [propertyTax, setPropertyTax] = useState(0);
  const [percentPropertyTax, setPercentPropertyTax] = useState(0);
  const [downPayment, setDownPayment] = useState(0);
  const [percentDownPayment, setPercentDownPayment] = useState(0);

  const isProUser = auth.user.planIsActive && auth.user.planId === "pro";

  useEffect(() => {
    // Set initial state
    if (propertyData) {
      setPurchasePrice(propertyData.purchase_price);
      setPropertyTax(propertyData.exp_property_taxes);
      setPercentPropertyTax(
        (
          ((propertyData?.exp_property_taxes * 12) /
            propertyData?.purchase_price) *
          100
        ).toFixed(2)
      );
      setDownPayment(propertyData.down_payment);
      setPercentDownPayment(
        (
          (propertyData?.down_payment / propertyData?.purchase_price) *
          100
        ).toFixed(0)
      );
    }
  }, [
    propertyData?.purchase_price,
    propertyData?.exp_property_taxes,
    propertyData?.down_payment,
  ]);

  const { data: units } = useUnitsByProperty(props.id, auth.user.uid);

  useEffect(() => {
    if (!units) return;
    if (isProUser || units?.length < 1) setCanAddUnit(true);
    if (!isProUser && units?.length > 0) setCanAddUnit(false);
  }, [units, isProUser]);

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

  const handlePriceChange = (e) => {
    if (e.target.value) {
      setPurchasePrice(e.target.value);
      setPercentDownPayment(((downPayment / e.target.value) * 100).toFixed(0));
      setPercentPropertyTax(
        (((propertyTax * 12) / e.target.value) * 100).toFixed(2)
      );
    } else {
      setPurchasePrice(undefined);
    }
  };

  const handleDownPaymentChange = (e) => {
    if (e.target.value) {
      setDownPayment(e.target.value);
      setPercentDownPayment(
        ((e.target.value / purchasePrice) * 100).toFixed(0)
      );
    } else {
      setDownPayment(undefined);
    }
  };

  const handlePercentDownPaymentChange = (e) => {
    if (e.target.value) {
      setPercentDownPayment(e.target.value);
      setDownPayment((purchasePrice * (e.target.value / 100)).toFixed(0));
    } else {
      setPercentDownPayment(undefined);
    }
  };

  const handlePropertyTaxChange = (e) => {
    if (e.target.value) {
      setPropertyTax(e.target.value);
      setPercentPropertyTax(
        (((e.target.value * 12) / purchasePrice) * 100).toFixed(2)
      );
    } else {
      setPropertyTax(undefined);
    }
  };

  const handlePercentPropertyTaxChange = (e) => {
    if (e.target.value) {
      setPercentPropertyTax(e.target.value);
      setPropertyTax(
        ((purchasePrice * (e.target.value / 100)) / 12).toFixed(0)
      );
    } else {
      setPercentPropertyTax(undefined);
    }
  };

  return (
    <>
      <header className="panel panel-heading has-background-light py-3 px-4 is-flex is-justify-content-space-between is-align-items-center">
        <h2 className="title is-4 m-0">
          {props.id ? "Edit" : "Create"}
          {` `}Property
        </h2>
        <button className="button my-3" onClick={() => props.onDone()}>
          Cancel
          <span className="icon is-small ml-2">
            <i className="fas fa-ban"></i>
          </span>
        </button>
      </header>

      {isRatesModalOpen && (
        <RatesModal onDone={() => setIsRatesModalOpen(false)} />
      )}

      <div className="DashboardProperties__panel panel">
        {formAlert && (
          <FormAlert
            type={formAlert.type}
            message={formAlert.message}
            errors={errors}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {isProUser ? (
            <AddressAutocomplete
              address={propertyData && propertyData.address}
              label="Address"
              size="medium"
              autoFocus={propertyData && !propertyData.address}
              register={register}
              errors={errors}
            />
          ) : (
            <FormField
              name="address"
              label="Address"
              type="text"
              placeholder="Address"
              defaultValue={propertyData ? propertyData.address : undefined}
              size="medium"
              error={errors.address}
              autoFocus={true}
              inputRef={register({
                required: "Please enter an address",
              })}
              autoComplete="off"
            />
          )}

          {props.id && (
            <div className="columns is-desktop mt-4">
              <section className="column">
                <h3 className="title is-5">Mortgage</h3>
                <FormField
                  name="purchase_price"
                  label="Purchase Price"
                  type="number"
                  placeholder={1000000}
                  size="medium"
                  error={errors.purchase_price}
                  inputRef={register({
                    required: "Please enter a purchase price",
                  })}
                  value={purchasePrice}
                  onChange={handlePriceChange}
                />
                <div className="is-flex is-flex-direction-row mb-2">
                  <span className="mr-2 mb-1">
                    <FormField
                      name="down_payment"
                      label="Down Payment"
                      type="number"
                      placeholder={200000}
                      size="medium"
                      error={errors.down_payment}
                      inputRef={register({
                        required: "Please enter a down payment",
                      })}
                      value={downPayment}
                      onChange={handleDownPaymentChange}
                    />
                  </span>
                  <FormField
                    name="percent_down"
                    label="Percent Down (%)"
                    type="number"
                    step="0.01"
                    size="medium"
                    error={errors.percent_down}
                    value={percentDownPayment}
                    onChange={handlePercentDownPaymentChange}
                  />
                </div>
                <FormField
                  name="loan_interest_rate"
                  label="Loan Interest Rate (%)"
                  type="number"
                  step="0.01"
                  placeholder={6}
                  defaultValue={
                    propertyData ? propertyData.loan_interest_rate : undefined
                  }
                  size="medium"
                  error={errors.loan_interest_rate}
                  inputRef={register({
                    required: "Please enter an interest rate",
                  })}
                />
                <button
                  type="button"
                  className="button is-light mb-3"
                  onClick={() => setIsRatesModalOpen(true)}
                >
                  See current rates
                  <span className="icon ml-2">
                    <i className="fas fa-chart-line"></i>
                  </span>
                </button>
                <FormField
                  name="loan_period"
                  label="Loan Period (in years)"
                  type="number"
                  placeholder={30}
                  defaultValue={
                    propertyData ? propertyData.loan_period : undefined
                  }
                  size="medium"
                  error={errors.loan_period}
                  inputRef={register({
                    required: "Please enter the number of months",
                  })}
                />
              </section>

              <section className="column">
                <h3 className="title is-5">Monthly Expenses</h3>

                <div className="is-flex is-flex-direction-row mb-2">
                  <span className="mr-2 mb-1">
                    <FormField
                      name="exp_property_taxes"
                      label="Property Taxes"
                      type="number"
                      placeholder={0}
                      size="medium"
                      error={errors.exp_property_taxes}
                      inputRef={register({
                        required:
                          "Please enter an amount for monthly property taxes",
                      })}
                      value={propertyTax}
                      onChange={handlePropertyTaxChange}
                    />
                  </span>
                  <FormField
                    name="tax_rate"
                    label="Tax Rate (%)"
                    type="number"
                    step="0.01"
                    size="medium"
                    error={errors.tax_rate}
                    value={percentPropertyTax}
                    onChange={handlePercentPropertyTaxChange}
                  />
                </div>
                <FormField
                  name="exp_property_manager"
                  label="Property Manager Fee"
                  type="number"
                  placeholder={300}
                  defaultValue={
                    propertyData ? propertyData.exp_property_manager : undefined
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
                  placeholder={30}
                  defaultValue={
                    propertyData
                      ? propertyData.exp_insurance_umbrella
                      : undefined
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
                  placeholder={100}
                  defaultValue={
                    propertyData ? propertyData.exp_insurance_hazard : undefined
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
                  placeholder={150}
                  defaultValue={
                    propertyData ? propertyData.exp_water_sewer : undefined
                  }
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
                  placeholder={100}
                  defaultValue={
                    propertyData ? propertyData.exp_landscape : undefined
                  }
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
                  placeholder={500}
                  defaultValue={
                    propertyData ? propertyData.exp_maintenance : undefined
                  }
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
                  placeholder={0}
                  defaultValue={
                    propertyData ? propertyData.exp_vacancy : undefined
                  }
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
                      <th scope="col">Unit</th>
                      <th scope="col">Rent</th>
                      <th scope="col">Parking</th>
                      <th scope="col">Storage</th>
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
                  onClick={
                    canAddUnit
                      ? () => setCreatingUnit(true)
                      : () => router.push("/pricing")
                  }
                  type="button"
                >
                  {canAddUnit ? "Add Unit" : "Upgrade to add more units"}
                  <span className="icon is-small ml-2">
                    {canAddUnit ? (
                      <i className="fas fa-plus"></i>
                    ) : (
                      <i className="fas fa-lock"></i>
                    )}
                  </span>
                </button>
              </section>
            </div>
          )}

          <div className="field">
            <div className="control is-flex-tablet is-justify-content-space-between is-align-items-center">
              <button
                className={
                  "button is-primary my-2" + (pending ? " is-loading" : "")
                }
                type="submit"
              >
                {props.id ? "Save and See Analytics" : "Create"}
                <span className="icon is-small ml-2">
                  <i className="fas fa-check"></i>
                </span>
              </button>
              {auth.user.stripeCustomerId ? (
                <>
                  {props.id && units?.length < 1 ? (
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
                  ) : (
                    <div>
                      {props.id &&
                        "To delete a property, first delete all of its units."}
                    </div>
                  )}
                </>
              ) : (
                <div>
                  Upgrade to a{" "}
                  <Link href="/pricing">
                    <a>Pro Plan </a>
                  </Link>
                  to delete property.
                </div>
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
