import { describe, expect, it } from "vitest";
import { boardFor, halfExtent, planRun, planShow, travelFrom } from "./drift";
import type { Point } from "./drift";

const VIEWPORT: Point = { x: 1920, y: 1080 };
const SAMPLE = 500;

function runs(viewport: Point = VIEWPORT) {
    return Array.from({ length: SAMPLE }, (_, key) => planRun(key, viewport, Math.random));
}

function outside(point: Point, size: number, angle: number, viewport: Point): boolean {
    const margin = halfExtent(size, angle) - 0.5;
    return point.x < margin || point.y < margin || point.x > viewport.x - margin || point.y > viewport.y - margin;
}

describe("planRun", () => {
    it("keeps the whole board on screen from start to finish", () => {
        const escaping = runs().filter(run => outside(run.from, run.size, run.angle, VIEWPORT) || outside(run.to, run.size, run.angle, VIEWPORT));
        expect(escaping).toEqual([]);
    });

    it("gives every run somewhere to travel", () => {
        const stuck = runs().filter(run => Math.hypot(run.to.x - run.from.x, run.to.y - run.from.y) < 1);
        expect(stuck).toEqual([]);
    });

    it("takes the longer of the two directions open to it", () => {
        const shortchanged = runs().filter(run => {
            const travelled = Math.hypot(run.to.x - run.from.x, run.to.y - run.from.y);
            return travelled + 0.5 < travelFrom(run.from, run.angle + 180, VIEWPORT, halfExtent(run.size, run.angle));
        });
        expect(shortchanged).toEqual([]);
    });
});

describe("planShow", () => {
    const shows = Array.from({ length: SAMPLE }, () => planShow(Math.random));

    it("puts on both kinds of show", () => {
        expect(shows.some(show => show.kind === "search")).toBe(true);
        expect(shows.some(show => show.kind === "walk")).toBe(true);
    });

    it("gives every show a while to run", () => {
        expect(shows.filter(show => !(show.seconds > 0))).toEqual([]);
    });

    it("keeps a walk flat, so the home page never reaches for WebGL", () => {
        const walks = shows.filter(show => show.kind === "walk");
        expect(walks.filter(walk => walk.dimensions !== 2)).toEqual([]);
    });

    it("varies what it asks for instead of repeating one show", () => {
        expect(new Set(shows.map(show => show.seed)).size).toBeGreaterThan(SAMPLE / 2);
    });
});

describe("halfExtent", () => {
    it("is half the board when it is not rotated", () => {
        expect(halfExtent(400, 0)).toBeCloseTo(200);
        expect(halfExtent(400, 90)).toBeCloseTo(200);
    });

    it("is widest on the diagonal", () => {
        expect(halfExtent(400, 45)).toBeGreaterThan(halfExtent(400, 20));
        expect(halfExtent(400, 45)).toBeCloseTo(400 * Math.SQRT2 / 2);
    });
});

describe("boardFor", () => {
    it("scales with the shorter side of the viewport", () => {
        expect(boardFor({ x: 1920, y: 1080 })).toBeGreaterThan(boardFor({ x: 1920, y: 800 }));
    });

    it("never asks for more room than the viewport can give", () => {
        const viewport = { x: 1200, y: 900 };
        expect(halfExtent(boardFor(viewport), 45)).toBeLessThan(Math.min(viewport.x, viewport.y) / 2);
    });
});
