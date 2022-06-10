import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import FormAlert from "components/FormAlert";
import EditProperty from "components/EditProperty";
import { useAuth } from "util/auth";
import { usePropertiesByUser, useUnitsByUser } from "util/db";
import { formatCurrency, formatPercentage } from "../util/util";
import {
  totalAmount,
  monthlyNOI,
  annualNOI,
  grossRentMultiplier,
} from "../util/calculations";

function DashboardProperties(props) {
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

  const handleAddProperty = () => {
    if (properties?.length < 1 || isProUser) {
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

  const getTotalIncome = (id) => {
    const property = properties.find((property) => property.id === id);
    let total = 0;
    for (let i = 0; i < units?.length; i++) {
      if (units[i].property_id === property.id) {
        total += units[i].rent_current;
        total += units[i].income_parking;
        total += units[i].income_storage;
      }
    }
    return total;
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
          <div className="panel has-background-light mb-4 py-3 px-4 is-flex is-justify-content-space-between is-align-items-center">
            <h2 className="title is-4 m-0">Properties</h2>
            <button className="button is-primary" onClick={handleAddProperty}>
              Add Property
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

              return (
                <div
                  className="DashboardProperties__panel panel p-4 mb-4"
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
                      </button>
                    </div>
                  </div>
                  <div className="columns is-tablet">
                    <div className="column p-3">
                      <h3 className="title is-5">Mortgage</h3>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Purchase Price:</td>
                            <td>{formatCurrency(property.purchase_price)}</td>
                          </tr>
                          <tr>
                            <td>Down Payment:</td>
                            <td>{formatCurrency(property.down_payment)}</td>
                          </tr>
                          <tr>
                            <td>Loan Interest Rate:</td>
                            <td>
                              {formatPercentage(property.loan_interest_rate)}
                            </td>
                          </tr>
                          <tr>
                            <td>Loan Period (in months):</td>
                            <td>{property.loan_period}</td>
                          </tr>
                        </tbody>
                      </table>

                      <h3 className="title is-5">Expenses</h3>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Property Taxes:</td>
                            <td>
                              {formatCurrency(property.exp_property_taxes)}
                            </td>
                          </tr>
                          <tr>
                            <td>Property Manager:</td>
                            <td>
                              {formatCurrency(property.exp_property_manager)}
                            </td>
                          </tr>
                          <tr>
                            <td>Umbrella Insurance:</td>
                            <td>
                              {formatCurrency(property.exp_insurance_umbrella)}
                            </td>
                          </tr>
                          <tr>
                            <td>Hazard Insurance:</td>
                            <td>
                              {formatCurrency(property.exp_insurance_hazard)}
                            </td>
                          </tr>
                          <tr>
                            <td>Water and Sewer:</td>
                            <td>{formatCurrency(property.exp_water_sewer)}</td>
                          </tr>
                          <tr>
                            <td>Landscape:</td>
                            <td>{formatCurrency(property.exp_landscape)}</td>
                          </tr>
                          <tr>
                            <td>Maintenance:</td>
                            <td>{formatCurrency(property.exp_maintenance)}</td>
                          </tr>
                          <tr>
                            <td>Vacancy:</td>
                            <td>{formatCurrency(property.exp_vacancy)}</td>
                          </tr>
                          <tr>
                            <td>Total Expenses:</td>
                            <td>{formatCurrency(totalExpenses)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="column p-3">
                      <h3 className="title is-5">Income</h3>
                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Unit</th>
                            <th scope="col">Rent</th>
                            <th scope="col">Parking</th>
                            <th scope="col">Storage</th>
                            <th scope="col">Total</th>
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
                                    <td>{formatCurrency(unit.rent_current)}</td>
                                    <td>
                                      {formatCurrency(unit.income_parking)}
                                    </td>
                                    <td>
                                      {formatCurrency(unit.income_storage)}
                                    </td>
                                    <td>{formatCurrency(totalIncome)}</td>
                                  </tr>
                                );
                              })}
                          <tr>
                            <td>Total Income:</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{formatCurrency(getTotalIncome(property.id))}</td>
                          </tr>
                        </tbody>
                      </table>
                      <h3 className="title is-5">Investment Analytics</h3>
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>Total Cash Flow:</td>
                            <td>TODO</td>
                          </tr>
                          <tr>
                            <td>Gross Rent Multiplier (GRM):</td>
                            <td>
                              {grossRentMultiplier(
                                property.purchase_price,
                                getTotalIncome(property.id)
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>CAP Rate:</td>
                            <td>TODO</td>
                          </tr>
                          <tr>
                            <td>NOI (Monthly):</td>
                            <td>TODO</td>
                          </tr>
                          <tr>
                            <td>NOI (Yearly):</td>
                            <td>TODO</td>
                          </tr>
                          <tr>
                            <td>Appreciation (Yearly):</td>
                            <td>TODO</td>
                          </tr>
                        </tbody>
                      </table>
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
