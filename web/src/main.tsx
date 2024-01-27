import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { Layout } from "@/layouts/layout.component";
import { ThemeToggleProvider } from "@/layouts/navbar/theme-toggle/theme-toggle.provider";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";
import "./main.css";
import { TooltipProvider } from "./components/ui/tooltip";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeToggleProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>
                <BrowserRouter>
                    <Routes>
                        <Route
                            element={
                                <Layout>
                                    <Outlet />
                                </Layout>
                            }
                        >
                            <Route path="/" element={<HomePage />} />
                            <Route path="/matches/:date?" element={<HomePage />} />
                            <Route element={<NotFoundPage />} path="*" />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeToggleProvider>
    </React.StrictMode>,
);
