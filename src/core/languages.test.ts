import { describe, expect, it } from "vitest";
import { LANGUAGES, colourFor, sharesFor, wedges } from "./languages";

const WHOLE = 100;

describe("LANGUAGES", () => {
    it("accounts for the whole of every repository it knows", () => {
        Object.values(LANGUAGES).forEach(shares => {
            expect(shares.reduce((total, { share }) => total + share, 0)).toBeCloseTo(WHOLE, 1);
        });
    });

    it("orders every repository from its largest language down", () => {
        Object.values(LANGUAGES).forEach(shares => {
            const descending = [...shares].sort((first, second) => second.share - first.share);
            expect(shares.map(({ share }) => share)).toEqual(descending.map(({ share }) => share));
        });
    });
});

describe("wedges", () => {
    it("starts the first language at the top of the circle", () => {
        const [first] = wedges([{ name: "TypeScript", share: 25 }, { name: "Python", share: 75 }], 50, 50);

        expect(first?.path).toContain("M 50 50 L 50 0");
    });

    it("hands each language the arc the one before it ended on", () => {
        const [first, second] = wedges([{ name: "TypeScript", share: 25 }, { name: "Python", share: 75 }], 50, 50);
        const handover = first?.path.split("1 ")[1]?.replace(" Z", "");

        expect(second?.path).toContain(`L ${handover}`);
    });

    it("takes the long way round for a language holding more than half", () => {
        const [major, minor] = wedges([{ name: "TypeScript", share: 70 }, { name: "Python", share: 30 }], 50, 50);

        expect(major?.path).toContain("A 50 50 0 1 1");
        expect(minor?.path).toContain("A 50 50 0 0 1");
    });

    it("draws a whole circle for a repository written in one language", () => {
        const [only] = wedges([{ name: "TypeScript", share: 100 }], 50, 50);

        expect(only?.path).not.toContain("L 50 50");
        expect(only?.colour).toBe(colourFor("TypeScript"));
    });
});

describe("colourFor", () => {
    it("falls back to the colour of the leftovers for a language it has no colour for", () => {
        expect(colourFor("Brainfuck")).toBe(colourFor("Other"));
    });
});

describe("sharesFor", () => {
    it("has nothing to show for a repository it does not know", () => {
        expect(sharesFor("not-a-repository")).toEqual([]);
    });
});
