import { createBrowserRouter } from "react-router";
import { Board } from "@/pages/broad";

const routers = [
    {
        path: "/",
        element: <div>Home</div>
    },
    {
        path: "/board",
        element: <Board />
    }
];

export const router = createBrowserRouter(routers);