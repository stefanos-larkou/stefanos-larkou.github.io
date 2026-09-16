import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { COFFEE_URL, CoffeeLink } from "./CoffeeLink";
import { renderWithProviders } from "../test-utils";

describe("CoffeeLink", () => {
    it("links to the Buy Me a Coffee page", () => {
        renderWithProviders(<CoffeeLink />);
        expect(screen.getByRole("link", { name: "Buy me a coffee (opens in a new tab)" })).toHaveAttribute("href", COFFEE_URL);
    });

    it("opens in a new tab without handing over the opener", () => {
        renderWithProviders(<CoffeeLink />);
        const link = screen.getByRole("link", { name: "Buy me a coffee (opens in a new tab)" });
        expect(link).toHaveAttribute("target", "_blank");
        expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
});
