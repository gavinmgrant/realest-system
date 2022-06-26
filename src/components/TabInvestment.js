import React from "react";
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

function TabInvestment(props) {
  return (
    <>
      {props.properties
        .filter((prop) => prop.id === props.currentPropertyId)
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
          const totalIncome = getTotalIncome(props.properties, props.units, property.id);
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
                <h2 className="title is-4 mb-0 column">{property.address}</h2>
                <div className="column is-flex-tablet is-justify-content-flex-end">
                  <button
                    className="button is-primary"
                    onClick={() => props.setUpdatingPropertyId(property.id)}
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
                  <table className="table is-fullwidth is-bordered">
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
                  <table className="table is-fullwidth is-bordered">
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
                  <h3 className="title is-5">Monthly Income</h3>
                  <div className="table-container">
                    <table className="table is-fullwidth is-bordered">
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
                        {props.units &&
                          props.units
                            .filter((unit) => unit.property_id === property.id)
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
                                  <td>{formatCurrency(unit.income_parking)}</td>
                                  <td>{formatCurrency(unit.income_storage)}</td>
                                  <td className="has-text-right">
                                    {formatCurrency(totalIncome)}
                                  </td>
                                </tr>
                              );
                            })}
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td>Total:</td>
                          <td className="has-text-right">
                            {formatCurrency(totalIncome)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {props.units.filter((unit) => unit.property_id === property.id)
                      .length === 0 && (
                      <p className="has-text-centered">
                        No units found for this property. Click the edit button
                        above to add one.
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
    </>
  );
}

export default TabInvestment;
