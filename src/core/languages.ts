import generated from "./languages.generated.json";

export interface LanguageShare {
    name: string;
    share: number;
}

export const OTHER_LANGUAGE = "Other";

export const LANGUAGE_COLOURS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    Python: "#3572A5",
    "C#": "#7355dd",
    SCSS: "#c6538c",
    CSS: "#663399",
    HTML: "#e34c26",
    PowerShell: "#012456",
    [OTHER_LANGUAGE]: "#9aa0a6"
};

export const LANGUAGES: Record<string, LanguageShare[]> = generated;

export function sharesFor(repo: string): LanguageShare[] {
    return LANGUAGES[repo] ?? [];
}

export function colourFor(name: string): string {
    return LANGUAGE_COLOURS[name] ?? LANGUAGE_COLOURS[OTHER_LANGUAGE] ?? "";
}

export interface Wedge {
    name: string;
    colour: string;
    path: string;
}

const WHOLE = 100;
const HALF = WHOLE / 2;
const TURN = 2 * Math.PI;
const QUARTER_TURN = TURN / 4;

function edge(share: number, centre: number, radius: number): string {
    const angle = (TURN * share) / WHOLE - QUARTER_TURN;
    return `${centre + radius * Math.cos(angle)} ${centre + radius * Math.sin(angle)}`;
}

export function wedges(shares: LanguageShare[], centre: number, radius: number): Wedge[] {
    let turned = 0;

    return shares.map(({ name, share }) => {
        const from = turned;
        turned += share;

        const path = share >= WHOLE
            ? `M ${centre} ${centre - radius} A ${radius} ${radius} 0 1 1 ${centre - 0.01} ${centre - radius} Z`
            : `M ${centre} ${centre} L ${edge(from, centre, radius)} `
                + `A ${radius} ${radius} 0 ${share > HALF ? 1 : 0} 1 ${edge(turned, centre, radius)} Z`;

        return { name, colour: colourFor(name), path };
    });
}
