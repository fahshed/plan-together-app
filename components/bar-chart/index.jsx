import { Box } from "@chakra-ui/react";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

const colors = [
  "purple.solid",
  "orange.solid",
  "teal.solid",
  "cyan.solid",
  "pink.solid",
  "gray.solid",
  "green.solid",
  "yellow.solid",
  "red.solid",
  "blue.solid",
];

export default function ExpenseBarChart({ data, dataKey, caption }) {
  const coloredData = data.map((item, idx) => ({
    ...item,
    color: colors[idx % colors.length],
  }));

  const chart = useChart({
    data: coloredData,
  });

  return (
    <Box
      w="lg"
      pt="4"
      pr="4"
      pb="6"
      bg="white"
      rounded="md"
      borderColor="gray.400"
      borderWidth="1px"
    >
      <Chart.Root maxH="sm" chart={chart}>
        <BarChart data={chart.data}>
          <CartesianGrid vertical={false} />
          <XAxis
            axisLine={false}
            tickLine={false}
            dataKey={chart.key("label")}
            // tickFormatter={(value) => value.slice(0, 3)}
            label={{
              value: caption,
              position: "insideBottom",
              offset: -15,
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickFormatter={chart.formatNumber({
              style: "currency",
              currency: "USD",
              notation: "compact",
            })}
          />
          <Tooltip
            cursor={{ fill: chart.color("bg.muted") }}
            animationDuration={0}
            content={<Chart.Tooltip />}
          />
          <Bar
            isAnimationActive={false}
            dataKey={chart.key("expense")}
            radius={4}
          >
            {chart.data.map((item) => (
              <Cell key={item[dataKey]} fill={chart.color(item.color)} />
            ))}
          </Bar>
        </BarChart>
      </Chart.Root>
    </Box>
  );
}
