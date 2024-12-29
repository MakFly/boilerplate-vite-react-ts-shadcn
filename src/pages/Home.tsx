import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart, Users, CreditCard, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "@/components/ui/avatar";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Navbar from "@/components/NavBar";

const RecentSale = ({ name, email, amount }) => (
  <div className="flex items-center">
    <Avatar className="h-9 w-9">
      <AvatarImage src="https://ui.shadcn.com/avatars/01.png" alt={name} />
    </Avatar>
    <div className="ml-4 space-y-1">
      <p className="text-sm font-medium leading-none">{name}</p>
      <p className="text-sm text-zinc-400">{email}</p>
    </div>
    <div className="ml-auto font-medium">+${amount}</div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="flex flex-col">
      {/* <Navbar /> */}
      <div className="flex flex-1 overflow-hidden">
        {/* <aside className="w-64 border-r border-zinc-700 bg-zinc-900 hidden md:block">
          <Sidebar />
        </aside> */}
        <main className="flex-1 overflow-y-auto p-2">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <div className="flex items-center space-x-4">
              <div className="bg-zinc-800 text-white px-4 py-2 rounded-md text-sm">
                {/* Mets moi la date du jours */}
                {new Date().toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                -{" "}
                {new Date().toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <Button variant="outline" className="hidden md:inline-flex">
                Télécharger le rapport
              </Button>
            </div>
          </div>

          <div className="mb-8 overflow-x-auto scrollbar-hide">
            <Tabs defaultValue="music" className="h-full space-y-6">
              <div className="flex space-x-4 pb-3 md:pb-0 min-w-max md:min-w-0">
                <TabsList>
                  <TabsTrigger value="music" className="relative">
                    Music
                  </TabsTrigger>
                  <TabsTrigger value="views">Vue ensemble</TabsTrigger>
                  <TabsTrigger value="live" disabled>
                    Live
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="music"
                className="border-none p-0 outline-none"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <DashboardCard
                    title="Revenu Total"
                    value="45 231,89 €"
                    icon={<CreditCard className="h-4 w-4 text-zinc-400" />}
                    subtext="+20.1% depuis le mois dernier"
                  />
                  <DashboardCard
                    title="Abonnements"
                    value="+2350"
                    icon={<Users className="h-4 w-4 text-zinc-400" />}
                    subtext="+180.1% depuis le mois dernier"
                  />
                  <DashboardCard
                    title="Ventes"
                    value="+12 234"
                    icon={<CreditCard className="h-4 w-4 text-zinc-400" />}
                    subtext="+19% depuis le mois dernier"
                  />
                  <DashboardCard
                    title="Actifs maintenant"
                    value="+573"
                    icon={<Activity className="h-4 w-4 text-zinc-400" />}
                    subtext="+201 depuis la dernière heure"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Vue d'ensemble</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart className="h-[300px] w-full" />
              </CardContent>
            </Card>

            <Card className="text-black">
              <CardHeader>
                <CardTitle>Ventes récentes</CardTitle>
                <p className="text-sm text-zinc-400">
                  Vous avez effectué 265 ventes ce mois-ci.
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                <RecentSale
                  name="Olivia Martin"
                  email="olivia.martin@email.com"
                  amount="1 999,00"
                />
                <RecentSale
                  name="Jackson Lee"
                  email="jackson.lee@email.com"
                  amount="39,00"
                />
                <RecentSale
                  name="Isabella Nguyen"
                  email="isabella.nguyen@email.com"
                  amount="299,00"
                />
                <RecentSale
                  name="William Kim"
                  email="will@email.com"
                  amount="99,00"
                />
                <RecentSale
                  name="Sofia Davis"
                  email="sofia.davis@email.com"
                  amount="39,00"
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
