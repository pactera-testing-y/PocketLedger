import { LedgerPage } from "@/pages/LedgerPage";
import { StatisticPage } from "@/pages/LedgerPage/statisticPage";
import { createBrowserRouter } from "react-router";


const routers = [
    {
        path: "/",
        element: <LedgerPage />
    },
    {
        path: "/statistics",
        element: <StatisticPage />
    }
];

export const router = createBrowserRouter(routers);