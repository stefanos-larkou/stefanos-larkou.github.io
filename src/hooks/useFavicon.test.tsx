import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useFavicon } from "./useFavicon";

function Marked({ href }: { href: string; }) {
    useFavicon(href);
    return null;
}

function icons(): HTMLLinkElement[] {
    return [...document.head.querySelectorAll<HTMLLinkElement>("link[rel='icon']")];
}

describe("useFavicon", () => {
    beforeEach(() => {
        document.head.innerHTML = "<link rel=\"icon\" type=\"image/svg+xml\" href=\"/icon.svg\">";
    });

    it("marks the tab with the icon it was given", () => {
        render(<Marked href="/find-my-way.svg" />);
        expect(icons().map(link => link.getAttribute("href"))).toEqual(["/find-my-way.svg"]);
    });

    it("leaves exactly one icon behind, whatever was there before", () => {
        const { rerender } = render(<Marked href="/find-my-way.svg" />);
        rerender(<Marked href="/random-walks.svg" />);
        rerender(<Marked href="/icon.svg" />);

        expect(icons()).toHaveLength(1);
    });

    it("puts a new element in and never points the old one somewhere else", () => {
        const { rerender } = render(<Marked href="/find-my-way.svg" />);
        const before = icons()[0];
        rerender(<Marked href="/random-walks.svg" />);
        expect(icons()[0]).not.toBe(before);
        expect(before?.isConnected).toBe(false);
    });

    it("says nothing new when the icon has not changed", () => {
        const { rerender } = render(<Marked href="/find-my-way.svg" />);
        const before = icons()[0];

        rerender(<Marked href="/find-my-way.svg" />);

        expect(icons()[0]).toBe(before);
    });
});
