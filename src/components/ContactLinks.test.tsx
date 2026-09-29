import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContactLinks } from "./ContactLinks";
import { renderWithProviders } from "../test-utils";

describe("ContactLinks", () => {
    it("offers each way of getting in touch", () => {
        renderWithProviders(<ContactLinks />);
        expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", "https://github.com/stefanos-larkou");
        expect(screen.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", "https://www.linkedin.com/in/stefanos-larkou");
        expect(screen.getByRole("link", { name: /Email/ })).toHaveAttribute("href", "mailto:s.larkou@outlook.com");
    });

    it("names the account and not only the service", () => {
        renderWithProviders(<ContactLinks />);
        expect(screen.getByText("s.larkou@outlook.com")).toBeInTheDocument();
    });

    it("opens another site in its own tab, and the mail client in place", () => {
        renderWithProviders(<ContactLinks />);
        expect(screen.getByRole("link", { name: /GitHub/ })).toHaveAttribute("target", "_blank");
        expect(screen.getByRole("link", { name: /Email/ })).not.toHaveAttribute("target");
    });
});
