"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const states = [
  { id: "up", name: "Uttar Pradesh", stampDutyMale: 7, stampDutyFemale: 6, registration: 1, note: "1% rebate for female buyers" },
  { id: "gj", name: "Gujarat", stampDutyMale: 4.9, stampDutyFemale: 4.9, registration: 1, note: "4.9% uniform rate" },
  { id: "dl", name: "Delhi", stampDutyMale: 6, stampDutyFemale: 4, registration: 1, note: "2% rebate for female buyers" },
  { id: "hr", name: "Haryana", stampDutyMale: 7, stampDutyFemale: 5, registration: 1.5, note: "2% rebate for female buyers" },
  { id: "rj", name: "Rajasthan", stampDutyMale: 6, stampDutyFemale: 5, registration: 1, note: "1% rebate for female buyers" },
  { id: "mh", name: "Maharashtra", stampDutyMale: 6, stampDutyFemale: 5, registration: 1, note: "1% rebate in Mumbai for female" },
];

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default function StampDutyCalculator() {
  const [propertyValue, setPropertyValue] = useState(5000000);
  const [stateId, setStateId] = useState("up");
  const [gender, setGender] = useState<"male" | "female">("male");

  const state = states.find((s) => s.id === stateId)!;
  const stampDutyRate = gender === "female" ? state.stampDutyFemale : state.stampDutyMale;

  const result = useMemo(() => {
    const stampDuty = (propertyValue * stampDutyRate) / 100;
    const registration = (propertyValue * state.registration) / 100;
    const total = stampDuty + registration;
    return { stampDuty, registration, total, stampDutyRate };
  }, [propertyValue, stampDutyRate, state.registration]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">
          Stamp Duty <span className="text-gold-gradient">Calculator</span>
        </h1>
        <p className="text-sm text-muted">
          Calculate stamp duty and registration charges for your property purchase across Indian states.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Property Value</span>
              <span className="text-gold font-medium">{formatINR(propertyValue)}</span>
            </div>
            <input
              type="range"
              min={500000} max={50000000} step={100000}
              value={propertyValue}
              onChange={(e) => setPropertyValue(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] text-muted mt-1">
              <span>5L</span><span>5Cr</span>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">State</label>
            <select
              value={stateId}
              onChange={(e) => setStateId(e.target.value)}
              className="w-full bg-surface-light border border-surface-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
            >
              {states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Buyer Gender</label>
            <div className="flex gap-3">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                    gender === g
                      ? "bg-gold-muted text-gold border-gold/30"
                      : "bg-surface-light text-muted border-surface-border hover:border-gold/20"
                  }`}
                >
                  {g === "male" ? "Male" : "Female"}
                </button>
              ))}
            </div>
            {gender === "female" && (
              <p className="text-[10px] text-success mt-1.5">{state.note}</p>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="font-semibold mb-4">Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Property Value</span>
                <span>{formatINR(propertyValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Stamp Duty ({result.stampDutyRate}%)</span>
                <span>{formatINR(result.stampDuty)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Registration ({state.registration}%)</span>
                <span>{formatINR(result.registration)}</span>
              </div>
              <div className="border-t border-surface-border pt-3 flex justify-between">
                <span className="font-semibold">Total Cost</span>
                <span className="text-xl font-bold text-gold">{formatINR(result.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Total Property Cost</span>
                <span className="font-medium">{formatINR(propertyValue + result.total)}</span>
              </div>
            </div>
          </Card>

          <a
            href={`https://wa.me/919582806827?text=${encodeURIComponent(
              `Hi Kawal, I'm looking at a property worth ${formatINR(propertyValue)} in ${state.name}.\n\nStamp Duty: ${formatINR(result.stampDuty)} (${result.stampDutyRate}%)\nRegistration: ${formatINR(result.registration)}\nTotal extra: ${formatINR(result.total)}\n\nCan you help me with the documentation and best deals?`
            )}`}
            target="_blank" rel="noopener noreferrer"
          >
            <Button className="w-full" size="lg">
              Get Expert Guidance on WhatsApp
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
