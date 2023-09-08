(() => {
    "use strict"

    const themeSwitcherBtn = document.querySelector("#bd-theme");
    const getStoredTheme = () => localStorage.getItem("theme");
    const setStoredTheme = theme => localStorage.setItem("theme", theme);

    const getPreferredTheme = () => {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }

    const setTheme = theme => {
        document.documentElement.setAttribute("data-bs-theme", theme);
    }

    setTheme(getPreferredTheme());

    const showActiveTheme = (theme) => {
        if (!themeSwitcherBtn) {
            return;
        }

        const svgIconHref = theme === "light" ? "#sun-fill" : "#moon-stars-fill";
        themeSwitcherBtn.querySelector("svg use").setAttribute("href", svgIconHref);
        document.documentElement.setAttribute("data-bs-theme", theme);
    }

    window.addEventListener("DOMContentLoaded", () => {
        showActiveTheme(getPreferredTheme());
    });

    if (themeSwitcherBtn) {
        themeSwitcherBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-bs-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            const svgIconHref = newTheme === "light" ? "#sun-fill" : "#moon-stars-fill";
            themeSwitcherBtn.querySelector("svg use").setAttribute("href", svgIconHref);
            document.documentElement.setAttribute("data-bs-theme", newTheme);
            setStoredTheme(newTheme);
        });
    }
})()
