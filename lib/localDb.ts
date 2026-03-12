import { createContext } from "react";
import { EventConfig } from "./db";
import { nanoid } from "nanoid";

// We'll use local storage as our "database" for the MVP admin area.
// We prepopulate it with the initial mock if empty.
const DB_KEY = "magic-banner-events";

const initialMockEvents: EventConfig[] = [
  {
    id: "evento-magico-2026",
    nome: "Evento Mágico 2026",
    templatePath: "/templates/evento-magico-2026.png",
    overlay: { top: 150, left: 100, width: 400, height: 400, shape: "circle" },
  },
  {
    id: "tech-conference-brasil",
    nome: "Tech Conference Brasil",
    templatePath: "/templates/tech-conference-brasil.png",
    overlay: { top: 200, left: 200, width: 400, height: 300, shape: "rectangle" },
  },
];

export function getLocalEvents(): EventConfig[] {
  if (typeof window === "undefined") return initialMockEvents;
  const stored = localStorage.getItem(DB_KEY);
  if (!stored) {
    localStorage.setItem(DB_KEY, JSON.stringify(initialMockEvents));
    return initialMockEvents;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return initialMockEvents;
  }
}

export function saveLocalEvents(events: EventConfig[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DB_KEY, JSON.stringify(events));
}
