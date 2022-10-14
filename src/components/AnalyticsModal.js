import React from "react";

function AnalyticsModal(props) {
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={() => props.onDone()} />
      <div className="EditItemModal__card card">
        <header className="card-header">
          <p className="card-header-title">
            {props.topic === "cash-flow" && "Monthly Cash Flow"}
            {props.topic === "grm" && "Gross Rent Multiplier"}
            {props.topic === "cap-rate" && "Capitalization (Cap) Rate"}
            {props.topic === "noi" && "Net Operating Income (NOI)"}
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

        <div className="m-3">
          {props.topic === "cash-flow" && (
            <p>
              The result of subtracting the total monthly expenses (including
              the monthly mortgage) from the total monthly expenses. The higher
              the better.
            </p>
          )}
          {props.topic === "grm" && (
            <table className="table is-fullwidth is-bordered">
              <tbody>
                <tr>
                  <td>Value</td>
                  <td>Explanation</td>
                </tr>
                <tr>
                  <td>Over 20</td>
                  <td>
                    Cashflow = Negative (even with 20% down)
                    <br />
                    Awesome Appreciation
                  </td>
                </tr>
                <tr>
                  <td>17-20</td>
                  <td>
                    Cashflow = Negative (even with 20% down)
                    <br />
                    Great Appreciation
                  </td>
                </tr>
                <tr>
                  <td>12-16</td>
                  <td>
                    Cashflow = Break even with 20% down
                    <br />
                    Good Appreciation
                  </td>
                </tr>
                <tr>
                  <td>8-11</td>
                  <td>
                    Cashflow = Medium to good
                    <br />
                    Medium Appreciation
                  </td>
                </tr>
                <tr>
                  <td>6-7</td>
                  <td>
                    Cashflow = Excellent
                    <br />
                    Low Appreciation
                  </td>
                </tr>
                <tr>
                  <td>Under 6</td>
                  <td>
                    Cashflow = Awesome
                    <br />
                    Little to No Appreciation
                  </td>
                </tr>
              </tbody>
            </table>
          )}
          {props.topic === "cap-rate" && (
            <p>
              The rate of return on a real estate investment property based on
              the income that the property is expected to generate. Generally,
              4% to 10% per year is a good range.
            </p>
          )}
          {props.topic === "noi" && (
            <p>
              This takes all revenue from the property and subtracts all
              reasonably necessary operating expenses.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsModal;
