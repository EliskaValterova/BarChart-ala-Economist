import React, { useMemo } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  // Size and Margins
  const margin = { top: 15, right: 20, bottom: 0, left: 10 };
  const width = 650;
  const height = 360;
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Sorting
  const sortedData = useMemo(
    () => [...data].sort((a, b) => b.count - a.count),
    [data],
  );

  // D3 škály
  const yScale = useMemo(() =>
    d3
      .scaleBand()
      .domain(sortedData.map((d) => d.name))
      .range([0, innerHeight])
      .padding(0.3),
  );

  const xScale = useMemo(
    () => d3.scaleLinear().domain([0, 55]).range([0, innerWidth]),
    [innerWidth],
  );

  const ticks = xScale.ticks(11);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-10   ">
      {/* Header */}
      <div className="mb-6">
        <div className="w-full h-0.5 bg-[#e3120b]" />
        <div className="w-10 h-2 bg-[#e3120b] mb-1" />
        <h2 className="text-lg font-semibold text-neutral-800 text-left">
          Escape artists
        </h2>
        <p className="text-base text-neutral-800 text-left ">
          Number of laboratory-acquired infections, 1970-2021
        </p>
      </div>

      <svg
        width="100%"
        height="auto"
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Vertical grid & labels */}
          {ticks.map((tick) => (
            <g key={tick} transform={`translate(${xScale(tick)}, 0)`}>
              <line
                y1={0}
                y2={innerHeight}
                className="stroke-neutral-200 stroke-1"
              />
              <text
                y={-10}
                textAnchor="middle"
                className="fill-neutral-400 text-[11px] font-semibold "
              >
                {tick}
              </text>
            </g>
          ))}

          {/* Bars */}
          {sortedData.map((d) => {
            const barWidth = xScale(d.count);
            const isTooSmall = barWidth < 90;

            return (
              <g key={d.name} transform={`translate(0, ${yScale(d.name)})`}>
                <rect
                  width={barWidth}
                  height={yScale.bandwidth()}
                  className="fill-[#006ba2] transition-opacity hover:opacity-90"
                />

                {/* Dynamic labels in&out */}
                <text
                  x={isTooSmall ? barWidth + 8 : 8}
                  y={yScale.bandwidth() / 2}
                  alignmentBaseline="middle"
                  className={`text-xs font-medium select-none ${
                    isTooSmall ? "fill-[#006ba2]" : "fill-white"
                  }`}
                >
                  {d.name}
                </text>
              </g>
            );
          })}

          {/* Zero line */}
          <line
            y1={0}
            y2={innerHeight}
            className="stroke-neutral-700 stroke-1"
          />
        </g>
      </svg>

      {/* Footer */}
      <div className="text-sm text-neutral-500 font-semibold text-left pl-3">
        <p>
          Sources: Laboratory-Acquired Infection Database; American Biological
          Safety Association
        </p>
        <p>The Economist</p>
      </div>
    </div>
  );
};

export default BarChart;
