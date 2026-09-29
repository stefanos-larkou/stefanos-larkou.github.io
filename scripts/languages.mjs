import { writeFile } from "node:fs/promises";

const OWNER = "stefanos-larkou";
const REPOSITORIES = ["Find-My-Way", "RWalk", "forecast", "dinopedia"];
const OUTPUT = new URL("../src/core/languages.generated.json", import.meta.url);

const WHOLE = 100;
const MINIMUM_SHARE = 2;
const OTHER = "Other";
const DECIMALS = 1;
const INDENT = 4;

const STEPS = 10 ** DECIMALS;

function balanced(shares) {
    const counted = shares.map(({ name, share }) => ({
        name,
        steps: Math.floor(share * STEPS),
        remainder: (share * STEPS) % 1
    }));

    const shortfall = WHOLE * STEPS - counted.reduce((total, { steps }) => total + steps, 0);
    [...counted]
        .sort((first, second) => second.remainder - first.remainder)
        .slice(0, shortfall)
        .forEach(entry => entry.steps += 1);

    return counted.map(({ name, steps }) => ({ name, share: steps / STEPS }));
}

function sharesFrom(bytes) {
    const total = Object.values(bytes).reduce((sum, size) => sum + size, 0);
    if (total === 0) {
        return [];
    }

    const measured = Object.entries(bytes).map(([name, size]) => ({ name, share: (WHOLE * size) / total }));
    const listed = measured.filter(({ share }) => share >= MINIMUM_SHARE);
    const leftover = measured
        .filter(({ share }) => share < MINIMUM_SHARE)
        .reduce((sum, { share }) => sum + share, 0);

    if (leftover > 0) {
        listed.push({ name: OTHER, share: leftover });
    }

    return balanced(listed.sort((first, second) => second.share - first.share));
}

async function bytesFor(repository) {
    const token = process.env.LANGUAGES_TOKEN;
    const headers = { accept: "application/vnd.github+json" };
    if (token) {
        headers.authorization = `Bearer ${token}`;
    }

    const response = await fetch(`https://api.github.com/repos/${OWNER}/${repository}/languages`, { headers });
    if (!response.ok) {
        throw new Error(`${repository} answered ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

async function refresh() {
    const shares = Object.fromEntries(await Promise.all(REPOSITORIES.map(async repository => {
        const measured = sharesFrom(await bytesFor(repository));
        if (measured.length === 0) {
            throw new Error(`${repository} reported no languages`);
        }

        return [repository, measured];
    })));

    await writeFile(OUTPUT, `${JSON.stringify(shares, null, INDENT)}\n`);

    for (const [repository, listed] of Object.entries(shares)) {
        console.log(`${repository}: ${listed.map(({ name, share }) => `${name} ${share}%`).join(", ")}`);
    }
}

try {
    await refresh();
}
catch (error) {
    console.error(`Nothing was written. ${error.message}`);
    process.exitCode = 1;
}
