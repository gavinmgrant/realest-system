import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FormAlert from "components/FormAlert";
import EditProperty from "components/EditProperty";
import EditUnitModal from "components/EditUnitModal";
import { useAuth } from "util/auth";
import { usePropertiesByUser, useUnitsByUser, deleteProperty } from "util/db";
import { formatCurrency, formatPercentage } from "../util/util";
import {
  totalAmount,
  getTotalIncome,
  monthlyLoanPayment,
  monthlyNOI,
  annualNOI,
  grossRentMultiplier,
  cashFlow,
  capRate,
} from "../util/calculations";

function DashboardProperties() {
  const router = useRouter();
  const auth = useAuth();

  const {
    data: properties,
    status: propertiesStatus,
    error: propertiesError,
  } = usePropertiesByUser(auth.user.uid);

  const { data: units } = useUnitsByUser(auth.user.uid);

  const [creatingProperty, setCreatingProperty] = useState(false);
  const [currentPropertyId, setCurrentPropertyId] = useState(null);
  const [updatingPropertyId, setUpdatingPropertyId] = useState(null);
  const [creatingUnit, setCreatingUnit] = useState(false);
  const [updatingUnitId, setUpdatingUnitId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("investment");
  const propertiesAreEmpty = !properties || properties?.length === 0;

  const isProUser =
    auth.user.planIsActive &&
    (auth.user.planId === "pro" || auth.user.planId === "business");

  const canAddProperty = properties?.length < 3 || isProUser;

  const handleAddProperty = () => {
    if (canAddProperty) {
      setCreatingProperty(true);
    } else {
      router.replace("/pricing");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setCreatingProperty(false);
    setUpdatingPropertyId(null);
    scrollToTop();
  }, [properties]);

  return (
    <>
      {propertiesError && (
        <div className="mb-3">
          <FormAlert type="error" message={propertiesError.message} />
        </div>
      )}

      {!creatingProperty && !updatingPropertyId && (
        <div>
          <div className="panel panel-heading has-background-light py-3 px-4 is-flex is-justify-content-space-between is-align-items-center">
            <h2 className="title is-4 m-0">Properties</h2>
            {currentPropertyId ? (
              <button
                className="button is-primary"
                onClick={() => setCurrentPropertyId(null)}
              >
                View All
                <span className="icon ml-2">
                  <i className="fas fa-arrow-left"></i>
                </span>
              </button>
            ) : (
              <button className="button is-primary" onClick={handleAddProperty}>
                {canAddProperty ? "Add Property" : "Upgrade to Add"}
                <span className="icon is-small ml-2">
                  <i className="fas fa-plus"></i>
                </span>
              </button>
            )}
          </div>

          {currentPropertyId && (
            <div className="tabs is-toggle is-centered mb-4 is-flex-tablet">
              <ul>
                <li
                  className={selectedTab === "investment" ? "is-active" : ""}
                  onClick={() => setSelectedTab("investment")}
                >
                  <a>Investment Evaluation</a>
                </li>
                <li
                  className={selectedTab === "rent-roll" ? "is-active" : ""}
                  onClick={() => setSelectedTab("rent-roll")}
                >
                  <a>Rent Roll</a>
                </li>
              </ul>
            </div>
          )}

          {(propertiesStatus === "loading" || propertiesAreEmpty) && (
            <div className="py-5 px-3">
              {propertiesStatus === "loading" && (
                <div className="loader is-loading mx-auto" />
              )}

              {propertiesStatus !== "loading" && propertiesAreEmpty && (
                <div className="has-text-centered">
                  <p>
                    You have no properties. Click the add property button above
                    to make one!
                  </p>
                </div>
              )}
            </div>
          )}

          {properties &&
            !currentPropertyId &&
            properties.map((property) => {
              return (
                <div
                  className="card p-3 mb-4 is-clickable"
                  key={property.id}
                  onClick={() => {
                    setSelectedTab("investment");
                    setCurrentPropertyId(property.id);
                  }}
                >
                  <h3 className="title is-5 mb-0">{property.address}</h3>
                </div>
              );
            })}

          {currentPropertyId &&
            selectedTab === "investment" &&
            properties
              .filter((prop) => prop.id === currentPropertyId)
              .map((property) => {
                const expenses = Array.from([
                  property.exp_property_taxes,
                  property.exp_property_manager,
                  property.exp_insurance_umbrella,
                  property.exp_insurance_hazard,
                  property.exp_water_sewer,
                  property.exp_landscape,
                  property.exp_maintenance,
                  property.exp_vacancy,
                ]);
                const totalExpenses = totalAmount(expenses);
                const totalIncome = getTotalIncome(
                  properties,
                  units,
                  property.id
                );
                const monthlyPayment = monthlyLoanPayment(
                  property.purchase_price,
                  property.down_payment,
                  property.loan_interest_rate,
                  property.loan_period
                );

                return (
                  <div
                    className="DashboardProperties__panel panel mb-4"
                    key={property.id}
                  >
                    <div className="columns is-tablet">
                      <h2 className="title is-4 mb-0 column">
                        {property.address}
                      </h2>
                      <div className="column is-flex-tablet is-justify-content-flex-end">
                        <button
                          className="button is-primary"
                          onClick={() => setUpdatingPropertyId(property.id)}
                        >
                          Edit
                          <span className="icon is-small ml-2">
                            <i className="fas fa-pen"></i>
                          </span>
                        </button>
                      </div>
                    </div>
                    <div className="columns is-desktop">
                      <div className="column p-3">
                        <h3 className="title is-5">Mortgage</h3>
                        <table className="table is-fullwidth">
                          <tbody>
                            <tr>
                              <td>Purchase Price:</td>
                              <td className="has-text-right">
                                {formatCurrency(property.purchase_price)}
                              </td>
                            </tr>
                            <tr>
                              <td>Down Payment:</td>
                              <td className="has-text-right">
                                {formatCurrency(property.down_payment)}
                              </td>
                            </tr>
                            <tr>
                              <td>Loan Interest Rate:</td>
                              <td className="has-text-right">
                                {formatPercentage(property.loan_interest_rate)}
                              </td>
                            </tr>
                            <tr>
                              <td>Loan Period (in months):</td>
                              <td className="has-text-right">
                                {property.loan_period || 0}
                              </td>
                            </tr>
                            <tr>
                              <td>Monthly Mortgage Payment:</td>
                              <td className="has-text-right">
                                {formatCurrency(monthlyPayment)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="column p-3">
                        <h3 className="title is-5">Monthly Expenses</h3>
                        <table className="table is-fullwidth">
                          <tbody>
                            <tr>
                              <td>Property Taxes:</td>
                              <td className="has-text-right">
                                {formatCurrency(property.exp_property_taxes)}
                              </td>
                            </tr>
                            <tr>
                              <td>Property Manager:</td>
                              <td className="has-text-right">
                                {formatCurrency(property.exp_property_manager)}
                              </td>
                            </tr>
                            <tr>
                              <td>Umbrella Insurance:</td>
                              <td className="has-text-right">
                                {formatCurrency(
                                  property.exp_insurance_umbrella
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>Hazard Insurance:</td>
                              <td className="has-text-right">
                                {formatCurrency(property.exp_insurance_hazard)}
                              </td>
                            </tr>
                            <tr>
                              <td>Water and Sewer:</td>
                              <td className="has-text-right">
                                {formatCurrency(property.exp_water_sewer)}
                              </td>
                            </tr>
                            <tr>
                              <td>Landscape:</td>
                              <td className="has-text-right">
                                {formatCurrency(property.exp_landscape)}
                              </td>
                            </tr>
                            <tr>
                              <td>Maintenance:</td>
                              <td className="has-text-right">
                                {formatCurrency(property.exp_maintenance)}
                              </td>
                            </tr>
                            <tr>
                              <td>Vacancy:</td>
                              <td className="has-text-right">
                                {formatCurrency(property.exp_vacancy)}
                              </td>
                            </tr>
                            <tr>
                              <td>Total:</td>
                              <td className="has-text-right">
                                {formatCurrency(totalExpenses)}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="column p-3">
                        <h3 className="title is-5">Monthly Income</h3>
                        <div className="table-container">
                          <table className="table is-fullwidth">
                            <thead>
                              <tr>
                                <th className="has-text-left" scope="col">
                                  Unit
                                </th>
                                <th className="has-text-left" scope="col">
                                  Rent
                                </th>
                                <th
                                  className="is-hidden-tablet has-text-left"
                                  scope="col"
                                >
                                  Pkg
                                </th>
                                <th
                                  className="is-hidden-mobile has-text-left"
                                  scope="col"
                                >
                                  Parking
                                </th>
                                <th
                                  className="is-hidden-tablet has-text-left"
                                  scope="col"
                                >
                                  Sto
                                </th>
                                <th
                                  className="is-hidden-mobile has-text-left"
                                  scope="col"
                                >
                                  Storage
                                </th>
                                <th className="has-text-right" scope="col">
                                  Total
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {units &&
                                units
                                  .filter(
                                    (unit) => unit.property_id === property.id
                                  )
                                  .sort((a, b) => a.number - b.number)
                                  .map((unit, index) => {
                                    const income = Array.from([
                                      unit.rent_current,
                                      unit.income_parking,
                                      unit.income_storage,
                                    ]);
                                    const totalIncome = totalAmount(income);

                                    return (
                                      <tr key={index}>
                                        <td>{unit.number}</td>
                                        <td>
                                          {formatCurrency(unit.rent_current)}
                                        </td>
                                        <td>
                                          {formatCurrency(unit.income_parking)}
                                        </td>
                                        <td>
                                          {formatCurrency(unit.income_storage)}
                                        </td>
                                        <td className="has-text-right">
                                          {formatCurrency(totalIncome)}
                                        </td>
                                      </tr>
                                    );
                                  })}
                              <tr>
                                <td>Total:</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="has-text-right">
                                  {formatCurrency(totalIncome)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          {units.filter(
                            (unit) => unit.property_id === property.id
                          ).length === 0 && (
                            <p className="has-text-centered">
                              No units found for this property. Click the edit
                              button above to add one.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="columns">
                      <div className="notification is-primary column is-two-thirds m-3 mt-5">
                        <h3 className="title is-5 has-text-white">
                          Investment Analytics
                        </h3>
                        <table
                          className="table has-text-white is-fullwidth"
                          style={{ background: "none" }}
                        >
                          <tbody>
                            <tr>
                              <td>Total Cash Flow:</td>
                              <td className="has-text-right title is-5 has-text-white">
                                {formatCurrency(
                                  cashFlow(
                                    monthlyNOI(totalIncome, totalExpenses),
                                    monthlyPayment
                                  )
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>Gross Rent Multiplier:</td>
                              <td className="has-text-right title is-5 has-text-white">
                                {grossRentMultiplier(
                                  property.purchase_price,
                                  totalIncome
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>CAP Rate:</td>
                              <td className="has-text-right title is-5 has-text-white">
                                {capRate(
                                  annualNOI(totalIncome, totalExpenses),
                                  property.purchase_price
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>NOI (Monthly):</td>
                              <td className="has-text-right title is-5 has-text-white">
                                {formatCurrency(
                                  monthlyNOI(totalIncome, totalExpenses)
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td>NOI (Yearly):</td>
                              <td className="has-text-right title is-5 has-text-white">
                                {formatCurrency(
                                  annualNOI(totalIncome, totalExpenses)
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="column"></div>
                    </div>
                  </div>
                );
              })}

          {currentPropertyId &&
            selectedTab === "rent-roll" &&
            properties
              .filter((prop) => prop.id === currentPropertyId)
              .map((property) => {
                const totalIncome = getTotalIncome(
                  properties,
                  units,
                  property.id
                );
                const monthlyPayment = monthlyLoanPayment(
                  property.purchase_price,
                  property.down_payment,
                  property.loan_interest_rate,
                  property.loan_period
                );

                return (
                  <div
                    className="DashboardProperties__panel panel mb-4"
                    key={property.id}
                  >
                    <div className="columns is-desktop">
                      <h2 className="title is-4 mb-0 column">
                        {property.address}
                      </h2>
                    </div>
                    <div className="columns is-desktop">
                      <div className="column p-3">
                        <div className="table-container">
                          {units &&
                            units
                              .filter(
                                (unit) => unit.property_id === property.id
                              )
                              .sort((a, b) => a.number - b.number)
                              .map((unit, index) => {
                                const income = Array.from([
                                  unit.rent_current,
                                  unit.income_parking,
                                  unit.income_storage,
                                ]);
                                const totalIncome = totalAmount(income);

                                return (
                                  <div key={unit.id} className="mb-4">
                                    <h3 className="title is-5">
                                      Unit {unit.number}
                                    </h3>
                                    <div className="columns is-desktop">
                                      <div className="column">
                                        <table className="table is-fullwidth is-hoverable">
                                          <thead>
                                            <tr>
                                              <th
                                                className="has-text-left"
                                                scope="col"
                                              >
                                                Market Rent
                                              </th>
                                              <th
                                                className="is-hidden-tablet has-text-left"
                                                scope="col"
                                              >
                                                Br
                                              </th>
                                              <th
                                                className="is-hidden-mobile has-text-left"
                                                scope="col"
                                              >
                                                Bedrooms
                                              </th>
                                              <th
                                                className="is-hidden-tablet has-text-left"
                                                scope="col"
                                              >
                                                Ba
                                              </th>
                                              <th
                                                className="is-hidden-mobile has-text-left"
                                                scope="col"
                                              >
                                                Baths
                                              </th>
                                              <th
                                                className="has-text-left"
                                                scope="col"
                                              >
                                                Area
                                              </th>
                                              <th
                                                className="has-text-right"
                                                scope="col"
                                              >
                                                $/SF
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr
                                              key={index}
                                              className="is-clickable"
                                              onClick={() =>
                                                setUpdatingUnitId(unit.id)
                                              }
                                            >
                                              <td className="has-text-left">
                                                {formatCurrency(
                                                  unit.rent_market
                                                ) || "TBD"}
                                              </td>
                                              <td className="has-text-left">
                                                {unit.bedrooms || "TBD"}
                                              </td>
                                              <td className="has-text-left">
                                                {unit.baths || "TBD"}
                                              </td>
                                              <td className="has-text-left">
                                                {unit.floor_area || "TBD"}
                                              </td>
                                              <td className="has-text-right">
                                                {unit.floor_area ? formatCurrency(
                                                  (
                                                    totalIncome /
                                                    unit.floor_area
                                                  ).toFixed(2)
                                                ) : "TBD"}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                      <div className="column">
                                        <table className="table is-fullwidth is-hoverable">
                                          <thead>
                                            <tr>
                                              <th
                                                className="has-text-left"
                                                scope="col"
                                              >
                                                Current Rent
                                              </th>
                                              <th
                                                className="is-hidden-tablet has-text-left"
                                                scope="col"
                                              >
                                                Pkg
                                              </th>
                                              <th
                                                className="is-hidden-mobile has-text-left"
                                                scope="col"
                                              >
                                                Parking
                                              </th>
                                              <th
                                                className="is-hidden-tablet has-text-left"
                                                scope="col"
                                              >
                                                Sto
                                              </th>
                                              <th
                                                className="is-hidden-mobile has-text-left"
                                                scope="col"
                                              >
                                                Storage
                                              </th>
                                              <th
                                                className="has-text-right"
                                                scope="col"
                                              >
                                                Total
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr
                                              key={index}
                                              className="is-clickable"
                                              onClick={() =>
                                                setUpdatingUnitId(unit.id)
                                              }
                                            >
                                              <td className="has-text-left">
                                                {formatCurrency(
                                                  unit.rent_current
                                                )}
                                              </td>
                                              <td className="has-text-left">
                                                {formatCurrency(
                                                  unit.income_parking
                                                )}
                                              </td>
                                              <td className="has-text-left">
                                                {formatCurrency(
                                                  unit.income_storage
                                                )}
                                              </td>
                                              <td className="has-text-right">
                                                {formatCurrency(totalIncome)}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          {units.filter(
                            (unit) => unit.property_id === property.id
                          ).length > 0 ? (
                            <div className="is-fullwidth is-flex is-justify-content-space-between notification is-primary mt-4">
                              <p className="mr-2">Monthly Rent Schedule:</p>
                              <p className="has-text-right title is-5 has-text-white">
                                {formatCurrency(totalIncome)}
                              </p>
                            </div>
                          ) : (
                            <p className="has-text-centered">
                              No units found for this property.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      )}

      {creatingProperty && (
        <EditProperty
          onDone={() => {
            setCreatingProperty(false);
            scrollToTop();
          }}
        />
      )}

      {updatingPropertyId && (
        <EditProperty
          id={updatingPropertyId}
          tab={selectedTab}
          onDone={() => {
            setUpdatingPropertyId(null);
            scrollToTop();
          }}
          onDelete={() => {
            setUpdatingPropertyId(null);
            deleteProperty(currentPropertyId);
            setCurrentPropertyId(null);
          }}
        />
      )}

      {creatingUnit && (
        <EditUnitModal
          propertyId={updatingPropertyId}
          onDone={() => setCreatingUnit(false)}
        />
      )}

      {updatingUnitId && (
        <EditUnitModal
          propertyId={updatingPropertyId}
          id={updatingUnitId}
          tab={selectedTab}
          onDone={() => setUpdatingUnitId(null)}
        />
      )}
    </>
  );
}

export default DashboardProperties;
