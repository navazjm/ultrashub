import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu";
import { ThemeToggleComponent } from "./theme-toggle/theme-toggle";
import ultrashubLogo from "@/assets/img/logo.png";

export const NavbarComponent = () => {
    return (
        <div className="w-full max-w-full min-w-full shadow-sm shadow-muted sticky top-0 bg-background z-10">
            <NavigationMenu className="w-10/12 max-w-10/12 min-w-10/12 xl:w-7/12 xl:min-w-7/12 xl:max-w-7/12 m-auto justify-between py-1">
                <a href="/" className="flex gap-x-2 content-center">
                    <img src={ultrashubLogo} width="30px" />
                    <h3 className="text-2xl font-black">UltrasHub</h3>
                </a>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <ThemeToggleComponent />
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
};