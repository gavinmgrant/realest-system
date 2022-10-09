import React from "react";
import { formatCurrency } from "../util/util";
import { totalAmount, getTotalIncome } from "../util/calculations";

function TabRentRoll(props) {
  return (
    <>
      {props.properties
        .filter((prop) => prop.id === props.currentPropertyId)
        .map((property) => {
          const totalIncome = getTotalIncome(
            props.properties,
            props.units,
            property.id
          );
          return (
            <div
              className="DashboardProperties__panel panel mb-4"
              key={property.id}
            >
              <div className="columns is-desktop">
                <h2 className="title is-4 mb-0 column">{property.address}</h2>
              </div>
              <div className="columns is-desktop">
                <div className="column p-3">
                  <div className="table-container">
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
                            <section key={unit.id}>
                              <hr className="my-1" />
                              <h3
                                className="title is-5 mt-3 is-clickable"
                                onClick={() => props.setUpdatingUnitId(unit.id)}
                              >
                                Unit {unit.number}
                              </h3>
                              <div className="columns is-desktop">
                                <div className="column">
                                  <table className="table is-fullwidth is-hoverable is-bordered">
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
                                          props.setUpdatingUnitId(unit.id)
                                        }
                                      >
                                        <td className="has-text-left">
                                          {formatCurrency(unit.rent_current)}
                                        </td>
                                        <td className="has-text-left">
                                          {formatCurrency(unit.income_parking)}
                                        </td>
                                        <td className="has-text-left">
                                          {formatCurrency(unit.income_storage)}
                                        </td>
                                        <td className="has-text-right">
                                          {formatCurrency(totalIncome)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <div className="column">
                                  <table className="table is-fullwidth is-hoverable is-bordered">
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
                                          props.setUpdatingUnitId(unit.id)
                                        }
                                      >
                                        <td className="has-text-left">
                                          {formatCurrency(unit.rent_market) ||
                                            "TBD"}
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
                                          {unit.floor_area
                                            ? formatCurrency(
                                                (
                                                  totalIncome / unit.floor_area
                                                ).toFixed(2)
                                              )
                                            : "TBD"}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                              <hr className="my-1" />
                            </section>
                          );
                        })}
                    {props.units.filter(
                      (unit) => unit.property_id === property.id
                    ).length > 0 ? (
                      <div className="is-fullwidth is-flex is-justify-content-space-between notification is-primary mt-4">
                        <p className="mr-2">Monthly Rent Schedule:</p>
                        <p className="has-text-right title is-6 has-text-white is-size-5-tablet">
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
    </>
  );
}

export default TabRentRoll;
