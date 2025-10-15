import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function VerificationTrendsChart() {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const data = [
      { month: "Jan", legal: 45000, counterfeit: 1200, expired: 800 },
      { month: "Feb", legal: 52000, counterfeit: 1100, expired: 750 },
      { month: "Mar", legal: 61000, counterfeit: 950, expired: 680 },
      { month: "Apr", legal: 68000, counterfeit: 850, expired: 620 },
      { month: "May", legal: 75000, counterfeit: 720, expired: 580 },
      { month: "Jun", legal: 83000, counterfeit: 650, expired: 520 },
    ];

    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 120, bottom: 60, left: 60 };

    const svg = d3
      .select(chartRef.current)
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.legal + d.counterfeit + d.expired) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add bars for legal
    svg
      .selectAll(".bar-legal")
      .data(data)
      .join("rect")
      .attr("class", "bar-legal")
      .attr("x", (d) => x(d.month) || 0)
      .attr("y", (d) => y(d.legal))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.legal))
      .attr("fill", "#10B981")
      .attr("stroke", "#000")
      .attr("stroke-width", 3);

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-weight", "bold")
      .style("font-size", "14px");

    // Add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(".2s")))
      .selectAll("text")
      .style("font-weight", "bold")
      .style("font-size", "12px");

    // Add y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", margin.left - 45)
      .attr("x", -(height / 2))
      .attr("text-anchor", "middle")
      .style("font-weight", "black")
      .style("font-size", "14px")
      .text("VERIFICATIONS");

    // Add value labels on bars
    svg
      .selectAll(".label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => (x(d.month) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.legal) - 5)
      .attr("text-anchor", "middle")
      .style("font-weight", "black")
      .style("font-size", "12px")
      .text((d) => d3.format(".2s")(d.legal));

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${width - margin.right + 10}, ${margin.top})`);

    const legendData = [
      { label: "Legal", color: "#10B981" },
      { label: "Counterfeit", color: "#FF0080" },
      { label: "Expired", color: "#FFD700" },
    ];

    legendData.forEach((item, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 25})`);

      legendRow
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", item.color)
        .attr("stroke", "#000")
        .attr("stroke-width", 2);

      legendRow
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-weight", "bold")
        .style("font-size", "12px")
        .text(item.label);
    });
  }, []);

  return (
    <div className="flex justify-center overflow-x-auto">
      <svg ref={chartRef}></svg>
    </div>
  );
}
