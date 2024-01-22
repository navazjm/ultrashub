import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { Layout } from "@/layouts/layout.component";
import { ThemeToggleProvider } from "@/layouts/navbar/theme-toggle/theme-toggle.provider";
import { HomePage } from "@/pages/home";
import { NotFoundPage } from "@/pages/not-found";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ThemeToggleProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
                        <Route element={<NotFoundPage />} path="*" />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeToggleProvider>
    </React.StrictMode>,
);
