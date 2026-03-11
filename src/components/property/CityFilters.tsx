"use client";

export type SortOption = "default" | "price-low" | "price-high" | "newest";

interface CityFiltersProps {
  type: string;
  budget: string;
  sort: SortOption;
  transaction: string;
  onTypeChange: (t: string) => void;
  onBudgetChange: (b: string) => void;
  onSortChange: (s: SortOption) => void;
  onTransactionChange: (t: string) => void;
}

const transactionTypes = ["All", "Buy", "Rent"];
const propertyTypes = ["All", "Flat", "Shop", "Villa", "Plot", "Office"];
const budgets = ["All", "Under 30L", "30L - 50L", "50L - 1Cr", "Above 1Cr"];
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Latest First" },
];

function PillRow({ items, selected, onSelect }: { items: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto scrollbar-none scroll-snap-x pb-1 -mx-1 px-1">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`filter-pill shrink-0 px-3.5 py-2 text-xs rounded-full border transition-all duration-200 cursor-pointer active:scale-95 ${
            selected === item
              ? "bg-gold-muted text-gold border-gold/30 shadow-sm shadow-gold/10"
              : "bg-surface-light text-muted border-surface-border hover:border-gold/20 hover:text-foreground"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

export function CityFilters({ type, budget, sort, transaction, onTypeChange, onBudgetChange, onSortChange, onTransactionChange }: CityFiltersProps) {
  return (
    <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-lg -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 sm:py-4 mb-4 sm:mb-6 border-b border-surface-border/50 space-y-2.5 sm:space-y-3">
      {/* Buy / Rent — compact row */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] sm:text-xs text-muted shrink-0 font-medium uppercase tracking-wider">Looking to</span>
        <PillRow items={transactionTypes} selected={transaction} onSelect={onTransactionChange} />
      </div>

      {/* Type */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] sm:text-xs text-muted shrink-0 font-medium uppercase tracking-wider">Type</span>
        <PillRow items={propertyTypes} selected={type} onSelect={onTypeChange} />
      </div>

      {/* Budget + Sort row */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] sm:text-xs text-muted shrink-0 font-medium uppercase tracking-wider">Budget</span>
        <div className="flex-1 flex gap-1.5 overflow-x-auto scrollbar-none scroll-snap-x pb-1 -mx-1 px-1">
          {budgets.map((b) => (
            <button
              key={b}
              onClick={() => onBudgetChange(b)}
              className={`filter-pill shrink-0 px-3.5 py-2 text-xs rounded-full border transition-all duration-200 cursor-pointer active:scale-95 ${
                budget === b
                  ? "bg-gold-muted text-gold border-gold/30 shadow-sm shadow-gold/10"
                  : "bg-surface-light text-muted border-surface-border hover:border-gold/20 hover:text-foreground"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="shrink-0 bg-surface-light border border-surface-border rounded-lg px-2.5 py-2 text-xs focus:outline-none focus:border-gold/50 text-muted"
        >
          {sortOptions.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
