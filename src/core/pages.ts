import { lazy } from "react";
import type { ComponentType, LazyExoticComponent } from "react";

export interface Page {
    path: string;
    title: string;
    element: LazyExoticComponent<ComponentType>;
    heading?: string;
    blurb?: string;
    tech?: string[];
    repo?: string;
    info?: LazyExoticComponent<ComponentType>;
    preview?: LazyExoticComponent<ComponentType>;
    accent?: string;
    icon?: string;
}

export const TITLE_PREFIX = "SL | ";

const HEX_LATTICE = "repeating-linear-gradient(60deg, rgba(255, 255, 255, 0.07) 0 1px, transparent 1px 26px), "
    + "repeating-linear-gradient(-60deg, rgba(255, 255, 255, 0.07) 0 1px, transparent 1px 26px), "
    + "repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.07) 0 1px, transparent 1px 22px), "
    + "linear-gradient(150deg, #0d3b34, #1b6a55)";

const WALK_LATTICE = "repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 24px), "
    + "repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 24px), "
    + "linear-gradient(150deg, #1a2a4d, #35507f)";

const SKY = "linear-gradient(135deg, #2f7fd6, #9fd0f0)";

const PARCHMENT = "linear-gradient(180deg, #efe8dc, #c3b298)";

export const PAGES: Page[] = [
    {
        path: "/",
        title: "Stefanos Larkou",
        element: lazy(() => import("../pages/Home"))
    },
    {
        path: "/find-my-way",
        title: "Find My Way",
        heading: "Find My Way",
        blurb: "A pathfinding visualiser on a hexagonal grid. Each map is a randomly generated "
            + "irregular connected shape. A search begins at a root hex and works outwards until it "
            + "reaches the target hex, with a playback that replays every cell it considered on the way.",
        tech: ["React", "MUI", "Canvas"],
        repo: "Find-My-Way",
        element: lazy(() => import("../pages/FindMyWay")),
        info: lazy(() => import("../components/AboutFindMyWay")),
        preview: lazy(() => import("../components/FindMyWayPreview")),
        accent: HEX_LATTICE,
        icon: "/find-my-way.svg"
    },
    {
        path: "/random-walks",
        title: "Random Walks",
        heading: "Random Walks",
        blurb: "A random walk visualiser in one, two and three dimensions. A crowd of walkers starts "
            + "at a shared origin and each one takes a step in a direction chosen at random, over and "
            + "over. The playback replays every step, and the statistics run a far larger crowd to "
            + "measure what the walk does against what probability theory says it should.",
        tech: ["React", "MUI", "Canvas", "Three.js", "Chart.js"],
        repo: "RWalk",
        element: lazy(() => import("../pages/RandomWalks")),
        info: lazy(() => import("../components/AboutRandomWalks")),
        preview: lazy(() => import("../components/RandomWalksPreview")),
        accent: WALK_LATTICE,
        icon: "/random-walks.svg"
    }
];

export interface Project {
    heading: string;
    blurb: string;
    tech: string[];
    repo: string;
    preview?: LazyExoticComponent<ComponentType>;
    image?: string;
    accent?: string;
    path?: string;
    url?: string;
    newTab?: boolean;
}

const ROUTED: Project[] = PAGES.flatMap(page => page.heading && page.blurb && page.tech && page.repo
    ? [{ heading: page.heading, blurb: page.blurb, tech: page.tech, repo: page.repo, preview: page.preview, accent: page.accent, path: page.path }]
    : []);

export const DINOPEDIA_URL = "https://dinopedia.io";
export const FORECAST_URL = import.meta.env.VITE_FORECAST_URL ?? "/forecast/";

export const PROJECTS: Project[] = [
    ...ROUTED,
    {
        heading: "Forecast",
        blurb: "A weather forecast for Larnaca that keeps score of itself. Four times a day it saves what "
            + "three global models predict, corrects them with a gradient-boosted model trained on two years "
            + "of archived forecasts, and grades every prediction against ERA5 once the truth catches up.",
        tech: ["React", "MUI", "Chart.js", "pandas", "NumPy"],
        repo: "forecast",
        url: FORECAST_URL,
        accent: SKY,
        image: "/forecast.svg"
    },
    {
        heading: "Dinopedia",
        blurb: "A dinosaur encyclopaedia and a daily guessing game, built end to end: an Angular front "
            + "end, an ASP.NET Core API and an SQL database, all running on Azure. Browse and filter the "
            + "catalogue, watch Pangaea break apart on an interactive palaeo globe of the Mesozoic, or "
            + "try to name the day's mystery dinosaur.",
        tech: ["Angular", "Angular Material", "Three.js", "Chart.js", "ASP.NET Core", "EF Core", "SQL Server", "Azure"],
        repo: "dinopedia",
        url: DINOPEDIA_URL,
        newTab: true,
        accent: PARCHMENT,
        image: "/dinopedia-logo.svg"
    }
];
