(() => {
    "use strict"

    const themeSwitcherBtns = document.querySelectorAll(".bd-theme");
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
        if (themeSwitcherBtns.length === 0) {
            return;
        }

        const svgIconHref = theme === "light" ? "#sun-fill" : "#moon-stars-fill";
        themeSwitcherBtns.forEach(btn => btn.querySelector("svg use").setAttribute("href", svgIconHref))
        document.documentElement.setAttribute("data-bs-theme", theme);
    }

    window.addEventListener("DOMContentLoaded", () => {
        showActiveTheme(getPreferredTheme());
    });

    themeSwitcherBtns.forEach(themeSwitcherBtn => {
        themeSwitcherBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-bs-theme");
            const newTheme = currentTheme === "light" ? "dark" : "light";
            const svgIconHref = newTheme === "light" ? "#sun-fill" : "#moon-stars-fill";
            themeSwitcherBtns.forEach(btn => btn.querySelector("svg use").setAttribute("href", svgIconHref))
            document.documentElement.setAttribute("data-bs-theme", newTheme);
            setStoredTheme(newTheme);
        });
    });
})()
