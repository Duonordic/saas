"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const data = [
  { date: "Jan 1", deployments: 12, successes: 10, failures: 2 },
  { date: "Jan 2", deployments: 8, successes: 7, failures: 1 },
  { date: "Jan 3", deployments: 15, successes: 14, failures: 1 },
  { date: "Jan 4", deployments: 10, successes: 9, failures: 1 },
  { date: "Jan 5", deployments: 18, successes: 16, failures: 2 },
];

const chartConfig = {
  deployment: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function AnalyticsOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Deployment Analytics</CardTitle>
        <CardDescription>
          Deployment activity and success rates over time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="min-h-80 w-full" config={chartConfig}>
          <BarChart data={data}>
            <CartesianGrid vertical={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Bar
              dataKey="deployments"
              fill="#3b82f6"
              name="Total Deployments"
            />
            <Bar dataKey="successes" fill="#10b981" name="Successful" />
            <Bar dataKey="failures" fill="#ef4444" name="Failed" />
          </BarChart>
        </ChartContainer>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">63</div>
            <div className="text-sm text-muted-foreground">
              Total Deployments
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">56</div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">7</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
