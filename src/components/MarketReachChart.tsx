import { useEffect, useRef } from "react";
import * as d3 from "d3";

export function MarketReachChart() {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const data = [
      { region: "North", verifications: 28500 },
      { region: "South", verifications: 35200 },
      { region: "East", verifications: 31800 },
      { region: "West", verifications: 26400 },
      { region: "Central", verifications: 22100 },
    ];

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };

    const svg = d3
      .select(chartRef.current)
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.region))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.verifications) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colors = ["#8B5CF6", "#10B981", "#F59E0B", "#EC4899", "#06B6D4"];

    // Add bars
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.region) || 0)
      .attr("y", (d) => y(d.verifications))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.verifications))
      .attr("fill", (_, i) => colors[i])
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
      .attr("x", (d) => (x(d.region) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.verifications) - 5)
      .attr("text-anchor", "middle")
      .style("font-weight", "black")
      .style("font-size", "14px")
      .text((d) => d3.format(".2s")(d.verifications));
  }, []);

  return (
    <div className="flex justify-center">
      <svg ref={chartRef}></svg>
    </div>
  );
}
