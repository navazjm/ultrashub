import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { ThemeToggleProvider } from "@/layouts/navbar/theme-toggle/theme-toggle.provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/layouts/layout";
import { MatchesPage } from "@/pages/matches";
import { MatchPage } from "@/pages/match";
import { NotFoundPage } from "@/pages/not-found";
import "./main.css";

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
                            <Route path="/" element={<MatchesPage />} />
                            <Route path="/matches/:date?" element={<MatchesPage />} />
                            <Route path="/match/:id" element={<MatchPage />} />
                            <Route element={<NotFoundPage />} path="*" />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeToggleProvider>
    </React.StrictMode>,
);
