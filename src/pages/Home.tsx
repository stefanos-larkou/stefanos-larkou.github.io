import { Box, Chip, Container, Fade, Stack, Typography, useMediaQuery } from "@mui/material";
import { Suspense, useRef, useState } from "react";
import { Link as RouterLink } from "react-router";
import { ContactLinks } from "../components/ContactLinks";
import { HomeBackdrop } from "../components/HomeBackdrop";
import { Intro, SETTLE_MS } from "../components/Intro";
import type { Stage } from "../components/Intro";
import { PROJECTS } from "../core/pages";
import type { Project } from "../core/pages";
import { STILL } from "../core/preview";
import { glass } from "../core/surfaces";

const NAME = "Stefanos Larkou";
const ROLE = "Software engineer";

const ABOUT = "I build web applications end to end, from the interface down to the database. My "
    + "background is in computer science and data analysis. Below are a few "
    + "interactive projects that are easier to follow by watching them run than by reading boring code, "
    + "the rest of what I build is on GitHub.";

const TECHNOLOGIES = ["TypeScript", "React", "Angular", "C#", ".NET", "Azure", "SQL", "Python"];

const BIO_WIDTH = "65ch";
const PANEL_RADIUS = 6;
const PREVIEW_HEIGHT = { xs: 200, sm: 240 };

function loadedAtHome(): boolean {
    const [load] = performance.getEntriesByType("navigation");
    return !load || new URL(load.name).pathname === "/";
}

let introducing = loadedAtHome();

export default function Home() {
    const still = useMediaQuery(STILL);
    const [stage, setStage] = useState<Stage>(still || !introducing ? "done" : "typing");
    const nameRef = useRef<HTMLHeadingElement>(null);

    const arrived = stage !== "typing";
    const landed = stage === "done";

    return (
        <>
            {!landed && (
                <Intro
                    name={NAME}
                    stage={stage}
                    lands={nameRef}
                    onTyped={() => setStage("settling")}
                    onLanded={() => {
                        introducing = false;
                        setStage("done");
                    }}
                />
            )}
            <HomeBackdrop />
            <Box sx={{ position: "relative", zIndex: 1 }}>
                <Box sx={{ position: "sticky", top: 0, display: "flex", alignItems: "center", minHeight: "72svh" }}>
                    <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 }, display: "flex", justifyContent: "center" }}>
                        <Stack spacing={3} sx={{ width: "100%", maxWidth: BIO_WIDTH, textAlign: "start" }}>
                            <Fade in={arrived} timeout={SETTLE_MS}>
                                <Typography variant="overline" color="text.secondary">{ROLE}</Typography>
                            </Fade>
                            <Typography variant="h1" ref={nameRef} sx={{ opacity: landed ? 1 : 0 }}>
                                {NAME}
                            </Typography>
                            <Fade in={arrived} timeout={SETTLE_MS}>
                                <Typography variant="body1" color="text.secondary">{ABOUT}</Typography>
                            </Fade>
                            <Fade in={arrived} timeout={SETTLE_MS} style={{ transitionDelay: `${SETTLE_MS / 4}ms` }}>
                                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                                    {TECHNOLOGIES.map(name => (
                                        <Chip
                                            key={name}
                                            label={name}
                                            variant="outlined"
                                            sx={{ borderColor: "brand.soft" }}
                                        />
                                    ))}
                                </Stack>
                            </Fade>
                            <Fade in={arrived} timeout={SETTLE_MS} style={{ transitionDelay: `${SETTLE_MS / 2}ms` }}>
                                <Box>
                                    <ContactLinks />
                                </Box>
                            </Fade>
                        </Stack>
                    </Container>
                </Box>

                <Box
                    sx={theme => ({
                        position: "relative",
                        minHeight: "100svh",
                        borderTop: "2px solid",
                        borderColor: "brand.soft",
                        borderTopLeftRadius: theme.spacing(PANEL_RADIUS),
                        borderTopRightRadius: theme.spacing(PANEL_RADIUS),
                        ...glass(theme)
                    })}
                >
                    <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
                        <Stack spacing={4}>
                            <Typography variant="h2">Projects</Typography>
                            {PROJECTS.map(project => <ProjectCard key={project.path ?? project.url} project={project} />)}
                        </Stack>
                    </Container>
                </Box>
            </Box>
        </>
    );
}

function ProjectCard({ project }: { project: Project; }) {
    const Preview = project.preview;
    const away = project.url !== undefined;
    const destination = away
        ? { component: "a" as const, href: project.url, target: "_blank", rel: "noopener noreferrer" }
        : { component: RouterLink, to: project.path };

    return (
        <Box
            {...destination}
            aria-label={away ? `${project.heading} (opens in a new tab)` : project.heading}
            sx={theme => ({
                display: "grid",
                gap: { xs: 2, sm: 3 },
                gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "minmax(0, 5fr) minmax(0, 7fr)" },
                alignItems: "center",
                p: { xs: 2, sm: 2.5 },
                borderRadius: theme.spacing(3),
                border: "1px solid",
                borderColor: "divider",
                color: "inherit",
                textDecoration: "none",
                transition: "transform 200ms ease, border-color 200ms ease",
                "&:hover": { transform: "translateY(-3px)", borderColor: "text.secondary" },
                "@media (prefers-reduced-motion: reduce)": { transition: "none", "&:hover": { transform: "none" } }
            })}
        >
            <Box
                sx={theme => ({
                    height: PREVIEW_HEIGHT,
                    borderRadius: theme.spacing(2),
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "stretch",
                    background: project.accent,
                    "& > *": { flex: 1, minWidth: 0, minHeight: 0 },
                    "& canvas": { maxWidth: "100%", maxHeight: "100%" }
                })}
            >
                {project.image
                    ? (
                        <Box
                            component="img"
                            src={project.image}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", alignSelf: "center", p: 2 }}
                        />
                    )
                    : (
                        <Suspense fallback={null}>
                            {Preview && <Preview />}
                        </Suspense>
                    )}
            </Box>

            <Stack spacing={1}>
                <Typography variant="h5" component="h3">{project.heading}</Typography>
                <Typography variant="body2" color="text.secondary">{project.blurb}</Typography>
            </Stack>
        </Box>
    );
}
