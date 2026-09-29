import { Box, Stack, Typography } from "@mui/material";
import { colourFor, wedges, type LanguageShare } from "../core/languages";

const PIE_SIZE = 72;
const PIE_BOX = 100;
const PIE_RADIUS = PIE_BOX / 2;
const SWATCH_SIZE = 10;
const SHARE_DECIMALS = 1;

function formatShare(share: number): string {
    return `${share.toFixed(SHARE_DECIMALS)}%`;
}

export function LanguagePie({ shares, label }: { shares: LanguageShare[], label: string; }) {
    if (shares.length === 0) {
        return null;
    }

    return (
        <Stack direction="row" sx={{ alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "auto auto", columnGap: 1, rowGap: 0.25, alignItems: "center" }}>
                {shares.map(({ name, share }) => (
                    <Box key={name} sx={{ display: "contents" }}>
                        <Stack direction="row" sx={{ alignItems: "center", gap: 0.75, minWidth: 0 }}>
                            <Box
                                sx={{
                                    flexShrink: 0,
                                    width: SWATCH_SIZE,
                                    height: SWATCH_SIZE,
                                    borderRadius: "2px",
                                    backgroundColor: colourFor(name)
                                }}
                            />
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>{name}</Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "end" }}>
                            {formatShare(share)}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Box
                component="svg"
                role="img"
                aria-label={label}
                viewBox={`0 0 ${PIE_BOX} ${PIE_BOX}`}
                sx={{
                    flexShrink: 0,
                    width: PIE_SIZE,
                    height: PIE_SIZE,
                    display: "block"
                }}
            >
                {wedges(shares, PIE_BOX / 2, PIE_RADIUS).map(({ name, colour, path }) => (
                    <Box component="path" key={name} d={path} sx={{ fill: colour }} />
                ))}
            </Box>
        </Stack>
    );
}
