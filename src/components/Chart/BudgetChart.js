import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import "./budgetChart.scss";

export default function BudgetChart({
  chartData,
  budgets,
  totals,
  showTotal = true,
  layout,
  showTitle = true,
}) {
  return (
    <div
      className={`chart-container ${
        layout === "horizontal" ? "horizontal" : ""
      }`}
    >
      <div className="chart-wrapper">
        <PieChart width={250} height={250}>
          <Pie
            data={chartData}
            dataKey="value"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </div>

      <div className="textData">
        {showTitle && <h3>Spending Summary</h3>}
        {budgets.map((item) => (
          <div key={item.id} className="summary-item">
            <p>
              <strong
                style={{
                  borderLeft: `3.5px solid ${item.color}`,
                  padding: "0 0.5rem",
                  display: "inline-block",
                  borderRadius: "2px",
                }}
              >
                {item.name}
              </strong>
            </p>

            <p>
              <span className="spendOf">
                {new Intl.NumberFormat("en-EG", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(totals?.[item.name] || 0)}{" "}
                EGP
              </span>

              {showTotal && (
                <>
                  {" "}
                  of{" "}
                  {new Intl.NumberFormat("en-EG", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(item.amount)}{" "}
                  EGP
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
