"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function InvestmentCalculatorPage() {
  const [purchasePrice, setPurchasePrice] = useState(5000000);
  const [annualAppreciation, setAnnualAppreciation] = useState(8);
  const [holdingPeriod, setHoldingPeriod] = useState(5);
  const [rentalYield, setRentalYield] = useState(3);
  const [stampDuty, setStampDuty] = useState(7); // UP stamp duty
  const [brokerage, setBrokerage] = useState(1);

  const result = useMemo(() => {
    const futureValue = purchasePrice * Math.pow(1 + annualAppreciation / 100, holdingPeriod);
    const capitalGain = futureValue - purchasePrice;
    const totalRentalIncome = (purchasePrice * rentalYield / 100) * holdingPeriod;
    const acquisitionCost = purchasePrice * stampDuty / 100;
    const sellingCost = futureValue * brokerage / 100;
    const totalCost = purchasePrice + acquisitionCost;
    const netProfit = capitalGain + totalRentalIncome - acquisitionCost - sellingCost;
    const totalReturn = netProfit / totalCost * 100;
    const annualizedReturn = (Math.pow(1 + netProfit / totalCost, 1 / holdingPeriod) - 1) * 100;

    return {
      futureValue: Math.round(futureValue),
      capitalGain: Math.round(capitalGain),
      totalRentalIncome: Math.round(totalRentalIncome),
      acquisitionCost: Math.round(acquisitionCost),
      sellingCost: Math.round(sellingCost),
      netProfit: Math.round(netProfit),
      totalReturn: totalReturn.toFixed(1),
      annualizedReturn: annualizedReturn.toFixed(1),
      monthlyRent: Math.round(purchasePrice * rentalYield / 100 / 12),
    };
  }, [purchasePrice, annualAppreciation, holdingPeriod, rentalYield, stampDuty, brokerage]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          Investment <span className="text-gold-gradient">Calculator</span>
        </h1>
        <p className="text-muted max-w-xl mx-auto">
          Estimate your returns on property investment. Factor in appreciation, rental yield, and costs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Inputs */}
        <Card className="lg:col-span-3 p-6">
          {/* Purchase Price */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Purchase Price</label>
              <div className="flex items-center gap-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1">
                <span className="text-xs text-muted">&#8377;</span>
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value) || 0)}
                  className="w-28 bg-transparent text-sm text-right outline-none"
                />
              </div>
            </div>
            <input type="range" min={500000} max={50000000} step={100000} value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-muted mt-1"><span>5 L</span><span>5 Cr</span></div>
          </div>

          {/* Appreciation */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Annual Appreciation</label>
              <div className="flex items-center gap-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1">
                <input type="number" value={annualAppreciation} step={0.5}
                  onChange={(e) => setAnnualAppreciation(Number(e.target.value) || 0)}
                  className="w-14 bg-transparent text-sm text-right outline-none" />
                <span className="text-xs text-muted">%</span>
              </div>
            </div>
            <input type="range" min={0} max={25} step={0.5} value={annualAppreciation}
              onChange={(e) => setAnnualAppreciation(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-muted mt-1"><span>0%</span><span>25%</span></div>
          </div>

          {/* Holding Period */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Holding Period</label>
              <div className="flex items-center gap-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1">
                <input type="number" value={holdingPeriod}
                  onChange={(e) => setHoldingPeriod(Number(e.target.value) || 1)}
                  className="w-10 bg-transparent text-sm text-right outline-none" />
                <span className="text-xs text-muted">Yr</span>
              </div>
            </div>
            <input type="range" min={1} max={20} step={1} value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-muted mt-1"><span>1 Year</span><span>20 Years</span></div>
          </div>

          {/* Rental Yield */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Rental Yield (annual)</label>
              <div className="flex items-center gap-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1">
                <input type="number" value={rentalYield} step={0.5}
                  onChange={(e) => setRentalYield(Number(e.target.value) || 0)}
                  className="w-14 bg-transparent text-sm text-right outline-none" />
                <span className="text-xs text-muted">%</span>
              </div>
            </div>
            <input type="range" min={0} max={8} step={0.5} value={rentalYield}
              onChange={(e) => setRentalYield(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-muted mt-1"><span>0%</span><span>8%</span></div>
          </div>

          {/* Costs row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted mb-1 block">Stamp Duty + Reg.</label>
              <div className="flex items-center gap-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1.5">
                <input type="number" value={stampDuty} step={0.5}
                  onChange={(e) => setStampDuty(Number(e.target.value) || 0)}
                  className="w-full bg-transparent text-sm outline-none" />
                <span className="text-xs text-muted">%</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Selling Brokerage</label>
              <div className="flex items-center gap-1 bg-surface-light border border-surface-border rounded-lg px-3 py-1.5">
                <input type="number" value={brokerage} step={0.5}
                  onChange={(e) => setBrokerage(Number(e.target.value) || 0)}
                  className="w-full bg-transparent text-sm outline-none" />
                <span className="text-xs text-muted">%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Result */}
        <Card className="lg:col-span-2 p-6 flex flex-col">
          <div className="text-center mb-6">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Net Profit (after costs)</p>
            <p className={`text-3xl font-bold ${result.netProfit >= 0 ? "text-success" : "text-danger"}`}>
              {formatINR(result.netProfit)}
            </p>
            <p className="text-sm text-muted mt-1">
              {result.annualizedReturn}% annualized return
            </p>
          </div>

          <div className="space-y-2.5 flex-1">
            <div className="flex justify-between py-1.5 border-b border-surface-border">
              <span className="text-xs text-muted">Purchase Price</span>
              <span className="text-xs font-medium">{formatINR(purchasePrice)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-surface-border">
              <span className="text-xs text-muted">Value after {holdingPeriod} yr</span>
              <span className="text-xs font-medium text-gold">{formatINR(result.futureValue)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-surface-border">
              <span className="text-xs text-muted">Capital Gain</span>
              <span className="text-xs font-medium text-success">{formatINR(result.capitalGain)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-surface-border">
              <span className="text-xs text-muted">Total Rental ({holdingPeriod} yr)</span>
              <span className="text-xs font-medium text-success">{formatINR(result.totalRentalIncome)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-surface-border">
              <span className="text-xs text-muted">Monthly Rent (est.)</span>
              <span className="text-xs font-medium">{formatINR(result.monthlyRent)}/mo</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-surface-border">
              <span className="text-xs text-muted">Stamp Duty + Reg.</span>
              <span className="text-xs font-medium text-danger">-{formatINR(result.acquisitionCost)}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-surface-border">
              <span className="text-xs text-muted">Selling Cost</span>
              <span className="text-xs font-medium text-danger">-{formatINR(result.sellingCost)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-bold">Total Return</span>
              <span className="text-sm font-bold text-gold">{result.totalReturn}%</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-surface-border">
            <a
              href={`https://wa.me/919582806827?text=${encodeURIComponent(`Hi Kawal, I'm looking at property investment around ₹${(purchasePrice / 100000).toFixed(0)}L. Can you suggest properties with good appreciation potential?`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="w-full">Get Investment Advice</Button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
