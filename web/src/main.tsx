import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { AuthProvider } from "@/components/common/auth/auth.context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/layouts/layout";
import { ThemeToggleProvider } from "@/layouts/navbar/theme-toggle/theme-toggle.provider";
import { CompetitionsPage } from "@/pages/competitions";
import { CompetitionPage } from "@/pages/competition";
import { MatchesPage } from "@/pages/matches";
import { MatchPage } from "@/pages/match";
import { NotFoundPage } from "@/pages/not-found";
import { PrivacyPolicyPage } from "@/pages/policies/privacy";
import { SecurityPolicyPage } from "@/pages/policies/security";
import { TeamPage } from "@/pages/team";
import { TermsOfServicePage } from "@/pages/policies/terms";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <AuthProvider>
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
                                <Route path="/matches/id/:id" element={<MatchPage />} />
                                <Route path="/competitions/all" element={<CompetitionsPage />} />
                                <Route path="/competitions/id/:id" element={<CompetitionPage />} />
                                <Route path="/teams/id/:id" element={<TeamPage />} />
                                <Route path="/policies/terms-of-service" element={<TermsOfServicePage />} />
                                <Route path="/policies/security" element={<SecurityPolicyPage />} />
                                <Route path="/policies/privacy" element={<PrivacyPolicyPage />} />
                                <Route element={<NotFoundPage />} path="*" />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </TooltipProvider>
            </ThemeToggleProvider>
        </AuthProvider>
    </React.StrictMode>,
);
