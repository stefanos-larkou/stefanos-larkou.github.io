import { Box, IconButton, Tooltip } from "@mui/material";

export const COFFEE_URL = "https://buymeacoffee.com/stefanoslarkou";

const LABEL = "Buy me a coffee";
const MARK_SIZE = 28;

export function CoffeeLink() {
    return (
        <Tooltip title={LABEL} placement="bottom">
            <IconButton
                component="a"
                href={COFFEE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${LABEL} (opens in a new tab)`}
                sx={{ p: 0.75 }}
            >
                <Box
                    component="img"
                    src="/buymeacoffee.png"
                    alt=""
                    sx={{ width: MARK_SIZE, height: MARK_SIZE, borderRadius: "50%", border: "1px solid", borderColor: "divider" }}
                />
            </IconButton>
        </Tooltip>
    );
}
