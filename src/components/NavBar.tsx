import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Input } from "@/components/ui/input";
import { BarChart, Menu, Users, Bell, User } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";

const Sidebar = () => (
  <nav className="flex flex-col space-y-2 p-4">
    <Button variant="ghost" className="justify-start">
      <Users className="mr-2 h-4 w-4" />
      Utilisateurs
    </Button>
    <Button variant="ghost" className="justify-start">
      <BarChart className="mr-2 h-4 w-4" />
      Annonces
    </Button>
  </nav>
);

const MobileSidebar = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon">
        <Menu className="h-6 w-6" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-[280px] sm:w-[240px]">
      <SheetHeader>
        <SheetTitle>Menu</SheetTitle>
        <SheetDescription>Navigation du dashboard</SheetDescription>
      </SheetHeader>
      <Sidebar />
    </SheetContent>
  </Sheet>
);

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
  {
    title: "Builder Request",
    href: "/builder-request",
    description:
      "A tool to help you build and execute HTTP requests and generate cURL commands.",
  },
];

const Navbar = () => (
  <header className="border-b">
    <div className="flex h-16 items-center px-4">
      <div className="flex items-center space-x-4">
        <MobileSidebar />
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Accueil</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <User className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Profil
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Gérez votre profil et vos préférences.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="ml-auto flex items-center space-x-4">
        <Input
          className="w-64 hidden md:inline-flex"
          placeholder="Rechercher..."
        />
        <Button size="icon" variant="ghost">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="outline" className="hidden md:inline-flex">
          Déconnexion
        </Button>
        <ModeToggle />
      </div>
    </div>
  </header>
);

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
