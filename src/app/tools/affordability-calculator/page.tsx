"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

function formatPrice(price: number) {
  if (price >= 10000000) return `${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `${(price / 100000).toFixed(1)} L`;
  return `${(price / 1000).toFixed(0)}K`;
}

export default function AffordabilityCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [existingEMIs, setExistingEMIs] = useState(0);
  const [downPaymentSavings, setDownPaymentSavings] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);

  const result = useMemo(() => {
    // Banks typically allow 40-50% of net income for EMIs
    const maxEMI = monthlyIncome * 0.45 - existingEMIs;
    if (maxEMI <= 0) return { maxEMI: 0, maxLoan: 0, maxProperty: 0, recommendedEMI: 0, recommendedProperty: 0, monthlyExpense: 0 };

    // Calculate max loan from max EMI
    const monthlyRate = interestRate / 100 / 12;
    const months = loanTenure * 12;
    const maxLoan = monthlyRate === 0
      ? maxEMI * months
      : maxEMI * (Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, months));

    // Add down payment savings
    const maxProperty = maxLoan + downPaymentSavings;

    // Recommended (conservative — 35% of income)
    const recommendedEMI = monthlyIncome * 0.35 - existingEMIs;
    const recommendedLoan = monthlyRate === 0
      ? recommendedEMI * months
      : recommendedEMI * (Math.pow(1 + monthlyRate, months) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, months));
    const recommendedProperty = recommendedLoan + downPaymentSavings;

    return {
      maxEMI: Math.round(maxEMI),
      maxLoan: Math.round(maxLoan),
      maxProperty: Math.round(maxProperty),
      recommendedEMI: Math.round(recommendedEMI),
      recommendedProperty: Math.round(recommendedProperty),
      monthlyExpense: Math.round(maxEMI + existingEMIs),
    };
  }, [monthlyIncome, existingEMIs, downPaymentSavings, interestRate, loanTenure]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Home Affordability <span className="text-gold-gradient">Calculator</span>
        </h1>
        <p className="text-sm text-muted">
          Find out how much property you can afford based on your income and savings. Get a clear picture before you start looking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Monthly Income (Net)</span>
              <span className="text-gold font-medium">{formatINR(monthlyIncome)}</span>
            </div>
            <input
              type="range" min={20000} max={1000000} step={5000}
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Existing EMIs</span>
              <span className="font-medium">{formatINR(existingEMIs)}</span>
            </div>
            <input
              type="range" min={0} max={200000} step={1000}
              value={existingEMIs}
              onChange={(e) => setExistingEMIs(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Down Payment Savings</span>
              <span className="text-gold font-medium">{formatINR(downPaymentSavings)}</span>
            </div>
            <input
              type="range" min={0} max={20000000} step={100000}
              value={downPaymentSavings}
              onChange={(e) => setDownPaymentSavings(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Interest Rate</span>
              <span className="font-medium">{interestRate}%</span>
            </div>
            <input
              type="range" min={6} max={12} step={0.25}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Loan Tenure</span>
              <span className="font-medium">{loanTenure} years</span>
            </div>
            <input
              type="range" min={5} max={30}
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </Card>

        <div className="space-y-4">
          {/* Main result */}
          <Card className="p-5 text-center bg-gold-muted border-gold/20">
            <p className="text-xs text-gold mb-1">You can afford a property up to</p>
            <p className="text-3xl font-bold text-gold">{formatPrice(result.maxProperty)}</p>
            <p className="text-xs text-muted mt-2">
              Max EMI: {formatINR(result.maxEMI)}/mo &middot; Loan: {formatPrice(result.maxLoan)}
            </p>
          </Card>

          {/* Conservative recommendation */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-success" />
              <h3 className="font-semibold text-sm">Recommended (Conservative)</h3>
            </div>
            <p className="text-2xl font-bold text-success mb-1">{formatPrice(result.recommendedProperty)}</p>
            <p className="text-xs text-muted">
              EMI at 35% of income ({formatINR(result.recommendedEMI)}/mo) — comfortable with savings room
            </p>
          </Card>

          {/* Tips */}
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-2">Quick Tips</h3>
            <ul className="space-y-1.5 text-xs text-muted">
              <li className="flex items-start gap-1.5">
                <span className="text-gold mt-0.5">&#8226;</span>
                Banks approve loans where EMI is max 45-50% of net income
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-gold mt-0.5">&#8226;</span>
                20-25% down payment gets you the best interest rates
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-gold mt-0.5">&#8226;</span>
                Keep 6 months of EMI as emergency fund before buying
              </li>
            </ul>
          </Card>

          <a
            href={`https://wa.me/919582806827?text=${encodeURIComponent(
              `Hi Kawal, I'm looking to buy a property.\n\nMy budget: Up to ${formatPrice(result.maxProperty)}\nMonthly income: ${formatINR(monthlyIncome)}\nDown payment: ${formatINR(downPaymentSavings)}\n\nCan you suggest properties in my range?`
            )}`}
            target="_blank" rel="noopener noreferrer"
          >
            <Button className="w-full" size="lg">
              Find Properties in Your Budget
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
