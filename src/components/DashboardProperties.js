import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FormAlert from "components/FormAlert";
import EditProperty from "components/EditProperty";
import { useAuth } from "util/auth";
import { usePropertiesByUser, useUnitsByUser } from "util/db";
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
  const [updatingPropertyId, setUpdatingPropertyId] = useState(null);

  const propertiesAreEmpty = !properties || properties?.length === 0;

  const isProUser =
    auth.user.planIsActive &&
    (auth.user.planId === "pro" || auth.user.planId === "business");

  const canAddProperty = properties?.length < 1 || isProUser;

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
            <button className="button is-primary" onClick={handleAddProperty}>
              {canAddProperty ? "Add Property" : "Upgrade to Add"}
              <span class="icon is-small ml-2">
                <i class="fas fa-plus"></i>
              </span>
            </button>
          </div>

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
            properties.map((property, index) => {
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
                  key={index}
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
                        <span class="icon is-small ml-2">
                          <i class="fas fa-pen"></i>
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
                              {property.loan_period}
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
                      <h3 className="title is-5">Expenses</h3>
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
                              {formatCurrency(property.exp_insurance_umbrella)}
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
                      <h3 className="title is-5">Income</h3>
                      <div className="table-container">
                        <table className="table is-fullwidth">
                          <thead>
                            <tr>
                              <th className="has-text-left" scope="col">Unit</th>
                              <th className="has-text-left" scope="col">Rent</th>
                              <th className="is-hidden-tablet has-text-left" scope="col">
                                Pkg
                              </th>
                              <th className="is-hidden-mobile has-text-left" scope="col">
                                Parking
                              </th>
                              <th className="is-hidden-tablet has-text-left" scope="col">
                                Sto
                              </th>
                              <th className="is-hidden-mobile has-text-left" scope="col">
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
                      </div>
                    </div>
                  </div>
                  <div className="columns">
                    <div className="notification is-primary column is-two-thirds m-3">
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
                            <td className="has-text-right">
                              <strong>
                                {formatCurrency(
                                  cashFlow(
                                    monthlyNOI(totalIncome, totalExpenses),
                                    monthlyPayment
                                  )
                                )}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td>Gross Rent Multiplier:</td>
                            <td className="has-text-right">
                              <strong>
                                {grossRentMultiplier(
                                  property.purchase_price,
                                  totalIncome
                                )}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td>CAP Rate:</td>
                            <td className="has-text-right">
                              <strong>
                                {capRate(
                                  annualNOI(totalIncome, totalExpenses),
                                  property.purchase_price
                                )}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td>NOI (Monthly):</td>
                            <td className="has-text-right">
                              <strong>
                                {formatCurrency(
                                  monthlyNOI(totalIncome, totalExpenses)
                                )}
                              </strong>
                            </td>
                          </tr>
                          <tr>
                            <td>NOI (Yearly):</td>
                            <td className="has-text-right">
                              <strong>
                                {formatCurrency(
                                  annualNOI(totalIncome, totalExpenses)
                                )}
                              </strong>
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
          onDone={() => {
            setUpdatingPropertyId(null);
            scrollToTop();
          }}
        />
      )}
    </>
  );
}

export default DashboardProperties;
