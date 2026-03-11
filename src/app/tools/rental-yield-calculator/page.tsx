"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default function RentalYieldCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(5000000);
  const [monthlyRent, setMonthlyRent] = useState(15000);
  const [maintenanceMonthly, setMaintenanceMonthly] = useState(3000);
  const [vacancyMonths, setVacancyMonths] = useState(1);
  const [appreciation, setAppreciation] = useState(8);

  const result = useMemo(() => {
    const annualRent = monthlyRent * (12 - vacancyMonths);
    const annualMaintenance = maintenanceMonthly * 12;
    const netAnnualRent = annualRent - annualMaintenance;
    const grossYield = (annualRent / purchasePrice) * 100;
    const netYield = (netAnnualRent / purchasePrice) * 100;
    const appreciationValue = purchasePrice * (appreciation / 100);
    const totalReturn = netAnnualRent + appreciationValue;
    const totalReturnPct = (totalReturn / purchasePrice) * 100;
    const breakEvenYears = purchasePrice / netAnnualRent;

    return {
      annualRent,
      netAnnualRent,
      grossYield,
      netYield,
      appreciationValue,
      totalReturn,
      totalReturnPct,
      breakEvenYears: Math.ceil(breakEvenYears),
    };
  }, [purchasePrice, monthlyRent, maintenanceMonthly, vacancyMonths, appreciation]);

  const yieldColor = result.netYield >= 5 ? "text-success" : result.netYield >= 3 ? "text-gold" : "text-danger";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Rental Yield <span className="text-gold-gradient">Calculator</span>
        </h1>
        <p className="text-sm text-muted">
          Calculate your property&apos;s rental return, net yield, and total investment return including appreciation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Purchase Price</span>
              <span className="text-gold font-medium">{formatINR(purchasePrice)}</span>
            </div>
            <input
              type="range" min={500000} max={50000000} step={100000}
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Monthly Rent</span>
              <span className="text-gold font-medium">{formatINR(monthlyRent)}</span>
            </div>
            <input
              type="range" min={2000} max={200000} step={1000}
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Monthly Maintenance</span>
              <span className="font-medium">{formatINR(maintenanceMonthly)}</span>
            </div>
            <input
              type="range" min={0} max={20000} step={500}
              value={maintenanceMonthly}
              onChange={(e) => setMaintenanceMonthly(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Vacancy (months/year)</span>
              <span className="font-medium">{vacancyMonths}</span>
            </div>
            <input
              type="range" min={0} max={6} step={1}
              value={vacancyMonths}
              onChange={(e) => setVacancyMonths(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Expected Appreciation</span>
              <span className="font-medium">{appreciation}%/yr</span>
            </div>
            <input
              type="range" min={0} max={25} step={0.5}
              value={appreciation}
              onChange={(e) => setAppreciation(Number(e.target.value))}
              className="w-full accent-gold"
            />
          </div>
        </Card>

        <div className="space-y-4">
          {/* Yield Score */}
          <Card className="p-5 text-center">
            <p className="text-xs text-muted mb-1">Net Rental Yield</p>
            <p className={`text-4xl font-bold ${yieldColor}`}>{result.netYield.toFixed(1)}%</p>
            <p className="text-xs text-muted mt-1">
              {result.netYield >= 5 ? "Excellent" : result.netYield >= 3 ? "Average" : "Below Average"} yield
            </p>
          </Card>

          <Card className="p-5">
            <h3 className="font-semibold mb-3">Annual Breakdown</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Gross Rental Income</span>
                <span>{formatINR(result.annualRent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Net Rental Income</span>
                <span>{formatINR(result.netAnnualRent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Gross Yield</span>
                <span>{result.grossYield.toFixed(1)}%</span>
              </div>
              <div className="border-t border-surface-border pt-2 flex justify-between">
                <span className="text-muted">Appreciation Value</span>
                <span className="text-success">+{formatINR(result.appreciationValue)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Annual Return</span>
                <span className="text-gold">{formatINR(result.totalReturn)} ({result.totalReturnPct.toFixed(1)}%)</span>
              </div>
              <div className="flex justify-between text-xs text-muted pt-1">
                <span>Break-even</span>
                <span>~{result.breakEvenYears} years</span>
              </div>
            </div>
          </Card>

          <a
            href={`https://wa.me/919582806827?text=${encodeURIComponent(
              `Hi Kawal, I'm evaluating a rental investment:\n\nProperty: ${formatINR(purchasePrice)}\nRent: ${formatINR(monthlyRent)}/mo\nNet Yield: ${result.netYield.toFixed(1)}%\nTotal Return: ${result.totalReturnPct.toFixed(1)}%\n\nCan you suggest high-yield properties?`
            )}`}
            target="_blank" rel="noopener noreferrer"
          >
            <Button className="w-full" size="lg">
              Find High-Yield Properties
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
