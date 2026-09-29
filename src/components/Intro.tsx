import { Box, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import { flight } from "../core/flight";
import { useTypewriter } from "../hooks/useTypewriter";

export type Stage = "typing" | "settling" | "done";

interface IntroProps {
    name: string;
    stage: Stage;
    lands: RefObject<HTMLElement | null>;
    onTyped: () => void;
    onLanded: () => void;
}

const TYPING_MS = 95;
const HOLD_MS = 420;
export const SETTLE_MS = 750;

const INTRO_SIZE = "clamp(2.5rem, 9vw, 6rem)";
const BLINK = "1.05s";

function sizeOf(element: HTMLElement): number {
    return Number.parseFloat(getComputedStyle(element).fontSize);
}

export function Intro({ name, stage, lands, onTyped, onLanded }: IntroProps) {
    const writer = useTypewriter(name, TYPING_MS, stage === "typing");
    const nameRef = useRef<HTMLSpanElement>(null);
    const typed = writer.done;

    useEffect(() => {
        if (stage !== "typing") return;

        document.body.setAttribute("inert", "");

        return () => document.body.removeAttribute("inert");
    }, [stage]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.removeProperty("overflow");
        };
    }, []);

    useEffect(() => {
        if (!typed || stage !== "typing") return;

        const timer = setTimeout(onTyped, HOLD_MS);

        return () => clearTimeout(timer);
    }, [typed, stage, onTyped]);

    useEffect(() => {
        const flying = nameRef.current;
        const target = lands.current;
        if (stage !== "settling" || !flying || !target) return;

        flying.style.transition = `transform ${SETTLE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`;
        flying.style.transform = flight(
            flying.getBoundingClientRect(),
            target.getBoundingClientRect(),
            sizeOf(target) / sizeOf(flying)
        );
    }, [stage, lands]);

    return (
        <Box
            aria-hidden
            onTransitionEnd={event => event.propertyName === "transform" && onLanded()}
            sx={{
                position: "fixed",
                inset: 0,
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: stage === "typing" ? "auto" : "none",
                backgroundColor: "background.default",
                transition: `background-color ${SETTLE_MS}ms ease`,
                ...(stage === "settling" && { backgroundColor: "transparent" })
            }}
        >
            <Typography
                ref={nameRef}
                component="span"
                sx={{
                    fontSize: INTRO_SIZE,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: "-0.02em",
                    whiteSpace: "nowrap",
                    transformOrigin: "top left"
                }}
            >
                {writer.typed}
                <Box
                    component="span"
                    sx={{
                        color: "brand.main",
                        visibility: stage === "typing" ? "visible" : "hidden",
                        animation: stage === "typing" ? `blink ${BLINK} steps(2, start) infinite` : "none",
                        "@keyframes blink": { to: { opacity: 0 } }
                    }}
                >
                    _
                </Box>
            </Typography>
        </Box>
    );
}
