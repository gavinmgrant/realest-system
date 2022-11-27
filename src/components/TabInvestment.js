import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  formatCurrency,
  formatPercentage,
  getPropertyType,
} from "../util/util";
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
import AnalyticsModal from "./AnalyticsModal";
import ShareModal from "./ShareModal";
import { useAuth } from "util/auth";

function TabInvestment(props) {
  const auth = useAuth();
  const router = useRouter();
  const [topic, setTopic] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const isProUser = auth.user.planIsActive && auth.user.planId === "pro";

  return (
    <div className={props.compareProperties && "column"}>
      {showModal && (
        <AnalyticsModal onDone={() => setShowModal(false)} topic={topic} />
      )}
      {showShareModal && (
        <ShareModal
          onDone={() => setShowShareModal(false)}
          url={`https://www.realestsystem.com/report/${props.currentPropertyId}`}
        />
      )}
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
          const totalIncome = getTotalIncome(
            props.properties,
            props.units,
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
              <div className="columns is-tablet-flex is-justify-content-space-between">
                <div className="is-flex is-align-items-center">
                  <h2
                    className={`title is-size-5 is-size-4-tablet mb-0 column ${
                      props.compareProperties && "is-fullwidth"
                    }`}
                  >
                    {property.address}
                  </h2>
                </div>
                {!props.compareProperties && (
                  <div className="column is-4 is-flex is-justify-content-flex-end">
                    <p
                      className={`tag my-2 mx-3 + " " + ${
                        getPropertyType(props.units, property.id).color
                      }`}
                    >
                      {getPropertyType(props.units, property.id).type}
                    </p>
                    {auth.user && (
                      <>
                        <button
                          className="button mr-3"
                          onClick={() => setShowShareModal(true)}
                        >
                          Share
                          <span className="icon is-small ml-2">
                            <i className="fas fa-share"></i>
                          </span>
                        </button>
                        <button
                          className="button is-primary"
                          onClick={() =>
                            props.setUpdatingPropertyId(property.id)
                          }
                        >
                          Edit
                          <span className="icon is-small ml-2">
                            <i className="fas fa-pen"></i>
                          </span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-2 mb-3" style={{ margin: "0" }}>
                <div className="columns">
                  {!router.pathname.includes("report") &&
                    (isProUser ? (
                      !props.compareProperties && (
                        <div className="column">
                          <iframe
                            frameBorder="0"
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/place?key=${
                              process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
                            }&q=${encodeURIComponent(
                              property.address
                            )}&maptype=satellite&zoom=19`}
                            allowFullScreen
                            style={{
                              height: "100%",
                              minHeight: "250px",
                              width: "100%",
                              border: "0",
                              borderRadius: "4px",
                            }}
                          ></iframe>
                        </div>
                      )
                    ) : (
                      <div className="column">
                        <div
                          className="notification p-4 is-flex is-justify-content-center is-align-items-center"
                          style={{ height: "100%", borderRadius: "4px" }}
                        >
                          <Link href="/pricing">
                            Upgrade to Pro Plan and see map.
                          </Link>
                          <span className="icon is-small ml-1">
                            <i className="fas fa-lock"></i>
                          </span>
                        </div>
                      </div>
                    ))}
                  <div className="column">
                    <div className="notification is-primary p-2">
                      <h3 className="title is-5 has-text-white mb-3 m-1">
                        Investment Analytics
                      </h3>
                      <table
                        className="table has-text-white is-fullwidth"
                        style={{ background: "none" }}
                      >
                        <tbody>
                          <tr>
                            <td>
                              <a
                                onClick={() => {
                                  setTopic("cash-flow");
                                  setShowModal(true);
                                }}
                              >
                                Monthly Cash Flow:
                                <span className="icon has-text-white is-small ml-1">
                                  <i className="fas fa-info-circle"></i>
                                </span>
                              </a>
                            </td>
                            <td className="has-text-right title is-6 has-text-white is-size-5-tablet">
                              {formatCurrency(
                                cashFlow(
                                  monthlyNOI(totalIncome, totalExpenses),
                                  monthlyPayment
                                )
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                onClick={() => {
                                  setTopic("grm");
                                  setShowModal(true);
                                }}
                              >
                                Gross Rent Multiplier:
                                <span className="icon has-text-white is-small ml-1">
                                  <i className="fas fa-info-circle"></i>
                                </span>
                              </a>
                            </td>
                            <td className="has-text-right title is-6 has-text-white is-size-5-tablet">
                              {grossRentMultiplier(
                                property.purchase_price,
                                totalIncome
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                onClick={() => {
                                  setTopic("cap-rate");
                                  setShowModal(true);
                                }}
                              >
                                Cap Rate:
                                <span className="icon has-text-white is-small ml-1">
                                  <i className="fas fa-info-circle"></i>
                                </span>
                              </a>
                            </td>
                            <td className="has-text-right title is-6 has-text-white is-size-5-tablet">
                              {formatPercentage(
                                capRate(
                                  annualNOI(totalIncome, totalExpenses),
                                  property.purchase_price
                                )
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                onClick={() => {
                                  setTopic("noi");
                                  setShowModal(true);
                                }}
                              >
                                NOI (Monthly):
                                <span className="icon has-text-white is-small ml-1">
                                  <i className="fas fa-info-circle"></i>
                                </span>
                              </a>
                            </td>
                            <td className="has-text-right title is-6 has-text-white is-size-5-tablet">
                              {formatCurrency(
                                monthlyNOI(totalIncome, totalExpenses)
                              )}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <a
                                onClick={() => {
                                  setTopic("noi");
                                  setShowModal(true);
                                }}
                              >
                                NOI (Yearly):
                                <span className="icon has-text-white is-small ml-1">
                                  <i className="fas fa-info-circle"></i>
                                </span>
                              </a>
                            </td>
                            <td className="has-text-right title is-6 has-text-white is-size-5-tablet">
                              {formatCurrency(
                                annualNOI(totalIncome, totalExpenses)
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={props.compareProperties ? "" : "columns is-desktop"}
              >
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
                        <td>Percent Down:</td>
                        <td className="has-text-right">
                          {formatPercentage(
                            (property.down_payment / property.purchase_price) *
                              100
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td>Loan Interest Rate:</td>
                        <td className="has-text-right">
                          {formatPercentage(property.loan_interest_rate)}
                        </td>
                      </tr>
                      <tr>
                        <td>Loan Period (in years):</td>
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
                        <td>Property Manager Fee:</td>
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
                    {props.units?.filter(
                      (unit) => unit.property_id === property.id
                    ).length === 0 && (
                      <p className="has-text-centered">
                        No units found for this property. Click the edit button
                        above to add one.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default TabInvestment;
