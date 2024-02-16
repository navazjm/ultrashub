import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { ThemeToggleProvider } from "@/layouts/navbar/theme-toggle/theme-toggle.provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/layouts/layout";
import { MatchesPage } from "@/pages/matches";
import { MatchPage } from "@/pages/match";
import { TermsOfServicePage } from "@/pages/policies/terms";
import { SecurityPolicyPage } from "@/pages/policies/security";
import { PrivacyPolicyPage } from "@/pages/policies/privacy";
import { NotFoundPage } from "@/pages/not-found";
import "./main.css";
import { CompetitionsPage } from "./pages/competitions";

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
                            <Route path="/matches/date/:date?" element={<MatchesPage />} />
                            <Route path="/match/id/:id" element={<MatchPage />} />
                            <Route path="/competitions/all" element={<CompetitionsPage />} />
                            <Route path="/competitions/id/:id" element={<NotFoundPage />} />
                            <Route path="/policies/terms-of-service" element={<TermsOfServicePage />} />
                            <Route path="/policies/security" element={<SecurityPolicyPage />} />
                            <Route path="/policies/privacy" element={<PrivacyPolicyPage />} />
                            <Route element={<NotFoundPage />} path="*" />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </ThemeToggleProvider>
    </React.StrictMode>,
);
