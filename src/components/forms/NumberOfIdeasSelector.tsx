'use client';

interface NumberOfIdeasSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function NumberOfIdeasSelector({
  value,
  onChange,
}: NumberOfIdeasSelectorProps) {
  const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-foreground">Number of Ideas</h3>
      <div className="flex items-center gap-4">
        {/* Stepper */}
        <div className="flex items-center bg-card-bg border border-card-border rounded-lg">
          <button
            type="button"
            onClick={() => onChange(Math.max(1, value - 1))}
            disabled={value <= 1}
            className="px-3 py-2 text-foreground hover:bg-card-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="px-4 py-2 text-lg font-semibold text-foreground min-w-[3rem] text-center border-x border-card-border">
            {value}
          </span>
          <button
            type="button"
            onClick={() => onChange(Math.min(10, value + 1))}
            disabled={value >= 10}
            className="px-3 py-2 text-foreground hover:bg-card-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Quick select buttons */}
        <div className="flex gap-1">
          {[3, 5, 10].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange(num)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                value === num
                  ? 'bg-accent text-white'
                  : 'bg-card-bg border border-card-border text-muted hover:text-foreground hover:border-muted'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Dropdown alternative (hidden on larger screens) */}
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="md:hidden w-full px-3 py-2 bg-card-bg border border-card-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
      >
        {options.map((num) => (
          <option key={num} value={num}>
            {num} {num === 1 ? 'idea' : 'ideas'}
          </option>
        ))}
      </select>
    </div>
  );
}
