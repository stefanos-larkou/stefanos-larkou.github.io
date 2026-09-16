import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Tooltip, Typography, useMediaQuery, useScrollTrigger } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Suspense, useEffect, useState } from "react";
import { Link as RouterLink, useLocation } from "react-router";
import { CoffeeLink } from "./components/CoffeeLink";
import { ThemeToggle } from "./components/ThemeToggle";
import { PAGES, TITLE_PREFIX } from "./core/pages";
import { glass } from "./core/surfaces";
import { useFavicon } from "./hooks/useFavicon";
import { AppRoutes } from "./routes";

const SITE_ICON = "/icon.svg";
const HOME = "/";

export function App() {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const { pathname } = useLocation();
    const [informing, setInforming] = useState(false);
    const page = PAGES.find(candidate => candidate.path === pathname);
    const Info = page?.info;
    const accent = page?.accent;

    const buried = useScrollTrigger();

    useFavicon(page?.icon ?? SITE_ICON);

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [pathname]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100svh" }}>
            {page && <title>{page.path === HOME ? page.title : `${TITLE_PREFIX}${page.title}`}</title>}
            <Stack
                direction="row"
                sx={theme => ({
                    alignItems: "center",
                    gap: 1,
                    px: 4,
                    py: 2,
                    flex: "0 0 auto",
                    position: "sticky",
                    top: 0,
                    zIndex: theme.zIndex.appBar,
                    ...glass(theme),
                    transform: buried ? "translateY(-100%)" : "none",
                    transition: "transform 240ms ease",
                    "@media (prefers-reduced-motion: reduce)": { transition: "none" }
                })}
            >
                {page?.heading && (
                    <Tooltip title="Back to the home page" placement="bottom">
                        <IconButton component={RouterLink} to="/" aria-label="Back to the home page" sx={{ ml: -1 }}>
                            <ArrowBackIcon />
                        </IconButton>
                    </Tooltip>
                )}
                {page?.heading && <Typography variant="h4" component="h1">{page.heading}</Typography>}
                {Info && (
                    <Tooltip title={`About ${page?.heading}`} placement="bottom">
                        <IconButton onClick={() => setInforming(true)} aria-label={`About ${page?.heading}`}>
                            <InfoOutlinedIcon />
                        </IconButton>
                    </Tooltip>
                )}
                <Box sx={{ ml: "auto", display: "flex" }}>
                    <CoffeeLink />
                    <ThemeToggle />
                </Box>
            </Stack>
            <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: { xs: "auto", md: 0 } }}>
                <AppRoutes />
            </Box>
            <Dialog
                open={informing && Boolean(Info)}
                onClose={() => setInforming(false)}
                fullScreen={fullScreen}
                maxWidth="sm"
                fullWidth
                scroll="paper"
            >
                <DialogTitle sx={{ position: "relative", pr: 7, background: accent, color: accent ? "common.white" : undefined }}>
                    {page?.heading}
                    <IconButton
                        onClick={() => setInforming(false)}
                        aria-label="Close"
                        sx={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: "inherit" }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        {page?.blurb && <Typography variant="body1">{page.blurb}</Typography>}
                        <Suspense fallback={null}>
                            {Info && <Info />}
                        </Suspense>
                    </Stack>
                </DialogContent>
            </Dialog>
        </Box>
    );
}
