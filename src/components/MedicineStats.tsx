import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Card } from "@/components/ui/card";

interface StatsData {
  totalMedicines: number;
  totalScans: number;
  legalProducts: number;
}

interface MedicineStatsProps {
  stats: StatsData | undefined;
}

export function MedicineStats({ stats }: MedicineStatsProps) {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!stats || !chartRef.current) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    const data = [
      { label: "Legal", value: stats.legalProducts, color: "#10B981" },
      { label: "Total Medicines", value: stats.totalMedicines, color: "#8B5CF6" },
      { label: "Total Scans", value: stats.totalScans, color: "#F59E0B" },
    ];

    const width = 300;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 40, left: 50 };

    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add bars
    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.label) || 0)
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => y(0) - y(d.value))
      .attr("fill", (d) => d.color)
      .attr("stroke", "#000")
      .attr("stroke-width", 3);

    // Add x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("font-weight", "bold")
      .style("font-size", "10px");

    // Add y-axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-weight", "bold")
      .style("font-size", "10px");

    // Add value labels on bars
    svg
      .selectAll(".label")
      .data(data)
      .join("text")
      .attr("class", "label")
      .attr("x", (d) => (x(d.label) || 0) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .style("font-weight", "black")
      .style("font-size", "14px")
      .text((d) => d.value);
  }, [stats]);

  return (
    <Card className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] p-4">
      <h3 className="text-xl font-black mb-4 text-center">STATISTICS CHART</h3>
      <div className="flex justify-center">
        <svg ref={chartRef}></svg>
      </div>
    </Card>
  );
}
