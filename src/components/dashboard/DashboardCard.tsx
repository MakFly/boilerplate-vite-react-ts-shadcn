import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const DashboardCard = ({ title, value, icon, subtext }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-zinc-400">{subtext}</p>
    </CardContent>
  </Card>
);

export default DashboardCard;
