"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function formatCurrency(amount: number) {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `${(amount / 100000).toFixed(2)} L`;
  return amount.toLocaleString("en-IN");
}

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function EMICalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(5000000); // 50 lakh
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20); // years

  const emi = useMemo(() => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const months = tenure * 12;

    if (monthlyRate === 0) return principal / months;

    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  }, [loanAmount, interestRate, tenure]);

  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - loanAmount;
  const principalPercent = (loanAmount / totalPayment) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          EMI <span className="text-gold-gradient">Calculator</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto">
          Calculate your monthly EMI for home loans. Adjust the amount, interest rate, and tenure to plan your finances.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-3 p-6">
          {/* Loan Amount */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Loan Amount</label>
              <div className="flex items-center gap-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1">
                <span className="text-xs text-muted">&#8377;</span>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value) || 0)}
                  className="w-28 bg-transparent text-sm text-right outline-none"
                />
              </div>
            </div>
            <input
              type="range"
              min={100000}
              max={50000000}
              step={100000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>1 L</span>
              <span>5 Cr</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Interest Rate (p.a.)</label>
              <div className="flex items-center gap-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1">
                <input
                  type="number"
                  value={interestRate}
                  step={0.1}
                  onChange={(e) => setInterestRate(Number(e.target.value) || 0)}
                  className="w-16 bg-transparent text-sm text-right outline-none"
                />
                <span className="text-xs text-muted">%</span>
              </div>
            </div>
            <input
              type="range"
              min={5}
              max={15}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>5%</span>
              <span>15%</span>
            </div>
          </div>

          {/* Tenure */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Loan Tenure</label>
              <div className="flex items-center gap-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1">
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value) || 1)}
                  className="w-12 bg-transparent text-sm text-right outline-none"
                />
                <span className="text-xs text-muted">Yr</span>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>1 Year</span>
              <span>30 Years</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted mt-1">Quick:</span>
            {[
              { label: "30L / 20Y", amount: 3000000, rate: 8.5, years: 20 },
              { label: "50L / 20Y", amount: 5000000, rate: 8.5, years: 20 },
              { label: "75L / 25Y", amount: 7500000, rate: 8.75, years: 25 },
              { label: "1Cr / 25Y", amount: 10000000, rate: 8.75, years: 25 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  setLoanAmount(preset.amount);
                  setInterestRate(preset.rate);
                  setTenure(preset.years);
                }}
                className="px-3 py-1 text-xs rounded-full border border-surface-border bg-surface-light text-muted hover:border-gold/30 hover:text-gold transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Result */}
        <Card className="lg:col-span-2 p-6 flex flex-col">
          <div className="text-center mb-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Monthly EMI</p>
            <p className="text-4xl font-bold text-gold">{formatINR(Math.round(emi))}</p>
          </div>

          {/* Visual breakdown */}
          <div className="mb-6">
            <div className="h-3 rounded-full overflow-hidden bg-surface-light flex">
              <div
                className="bg-gold rounded-l-full transition-all duration-300"
                style={{ width: `${principalPercent}%` }}
              />
              <div
                className="bg-gold/30 rounded-r-full transition-all duration-300"
                style={{ width: `${100 - principalPercent}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                <span className="text-xs text-muted">Principal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gold/30" />
                <span className="text-xs text-muted">Interest</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-3 flex-1">
            <div className="flex justify-between py-2 border-b border-surface-border">
              <span className="text-sm text-muted">Principal Amount</span>
              <span className="text-sm font-medium">{formatINR(loanAmount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-surface-border">
              <span className="text-sm text-muted">Total Interest</span>
              <span className="text-sm font-medium text-gold/80">{formatINR(Math.round(totalInterest))}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium">Total Payment</span>
              <span className="text-sm font-bold">{formatINR(Math.round(totalPayment))}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 pt-4 border-t border-surface-border">
            <a
              href={`https://wa.me/919582806827?text=${encodeURIComponent(`Hi Kawal, I'm looking for a home loan of ₹${formatCurrency(loanAmount)} at ${interestRate}% for ${tenure} years. EMI comes to about ₹${Math.round(emi).toLocaleString("en-IN")}/month. Can you help with the best rates?`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full" size="lg">
                Get Best Loan Rates
              </Button>
            </a>
            <p className="text-xs text-muted text-center mt-2">
              We have tie-ups with SBI, HDFC, ICICI &amp; more
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
