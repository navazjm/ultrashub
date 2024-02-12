import { useContext } from "react";
import { ThemeToggleProviderContext } from "./theme-toggle.provider";

export const useTheme = () => {
    const context = useContext(ThemeToggleProviderContext);

    if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
