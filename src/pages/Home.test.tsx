import { screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./Home";
import { sharesFor } from "../core/languages";
import { PROJECTS } from "../core/pages";
import type { Project } from "../core/pages";
import { renderWithProviders } from "../test-utils";

const INSIDE = PROJECTS.filter(project => project.path !== undefined);
const ALONGSIDE = PROJECTS.filter(project => project.url?.startsWith("/"));
const AWAY = PROJECTS.filter(project => project.newTab === true);

function cardFor(project: Project): HTMLElement {
    const name = project.newTab === true ? `${project.heading} (opens in a new tab)` : project.heading;
    return screen.getByRole("link", { name });
}

function outsideTheCards(text: string): HTMLElement[] {
    return screen.getAllByText(text).filter(node => node.closest("a") === null);
}

function settled() {
    vi.stubGlobal("matchMedia", (query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => false
    }));
}

describe("Home", () => {
    beforeEach(settled);
    afterEach(() => vi.unstubAllGlobals());

    it("offers a way into every project in the registry", () => {
        renderWithProviders(<Home />);
        INSIDE.forEach(project => {
            expect(screen.getByRole("link", { name: project.heading })).toHaveAttribute("href", project.path);
        });
        expect(INSIDE.length).toBeGreaterThan(1);
    });

    it("sends a project that is a site of its own to that site, in a new tab", () => {
        renderWithProviders(<Home />);
        expect(AWAY).not.toHaveLength(0);
        AWAY.forEach(project => {
            const link = cardFor(project);
            expect(link).toHaveAttribute("href", project.url);
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
        });
    });

    it("keeps a project that lives alongside this site in the tab the visitor is already in", () => {
        renderWithProviders(<Home />);
        expect(ALONGSIDE).not.toHaveLength(0);
        ALONGSIDE.forEach(project => {
            const link = cardFor(project);
            expect(link).toHaveAttribute("href", project.url);
            expect(link).not.toHaveAttribute("target");
        });
    });

    it("says what each project is, in the words its own page uses", () => {
        renderWithProviders(<Home />);
        PROJECTS.forEach(project => {
            expect(project.blurb).toBeTruthy();
            expect(screen.getByText(project.blurb)).toBeInTheDocument();
        });
    });

    it("names the technologies in the introduction", () => {
        renderWithProviders(<Home />);
        expect(outsideTheCards("TypeScript")).toHaveLength(1);
        expect(outsideTheCards("Python")).toHaveLength(1);
    });

    it("names the frameworks each project is built with, on that project's own card", () => {
        renderWithProviders(<Home />);
        PROJECTS.forEach(project => {
            const card = cardFor(project);

            expect(project.tech).not.toHaveLength(0);
            project.tech.forEach(tech => expect(within(card).getByText(tech)).toBeInTheDocument());
        });
    });

    it("breaks down the languages of each project's repository, on that project's own card", () => {
        renderWithProviders(<Home />);
        PROJECTS.forEach(project => {
            const card = cardFor(project);
            const shares = sharesFor(project.repo);

            expect(shares).not.toHaveLength(0);
            shares.forEach(({ name }) => expect(within(card).getByText(name)).toBeInTheDocument());
        });
    });

    it("goes nowhere inside the site that is not a registered project", () => {
        renderWithProviders(<Home />);
        const inside = screen.getAllByRole("link")
            .map(link => link.getAttribute("href") ?? "")
            .filter(href => href.startsWith("/"));

        const registered = [...INSIDE.map(project => project.path), ...ALONGSIDE.map(project => project.url)];
        expect(inside.sort()).toEqual(registered.sort());
    });
});

async function loadAt(path: string) {
    vi.spyOn(performance, "getEntriesByType").mockReturnValue([{ name: `http://localhost${path}` } as PerformanceEntry]);
    vi.resetModules();
    const { default: Loaded } = await import("./Home");
    renderWithProviders(<Loaded />);
}

describe("Home intro", () => {
    afterEach(() => vi.restoreAllMocks());

    it("plays when the page was loaded at the home page", async () => {
        await loadAt("/");
        expect(document.body).toHaveAttribute("inert");
    });

    it("stays away when the page was loaded at a project and came home later", async () => {
        await loadAt("/random-walks");
        expect(document.body).not.toHaveAttribute("inert");
    });
});
