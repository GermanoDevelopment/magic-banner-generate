import fs from 'fs/promises';
import path from 'path';

export type EventShape = 'circle' | 'rectangle';

export interface EventConfig {
  id: string;
  nome: string;
  templatePath: string; // the path relative to /public
  overlay: {
    top: number;
    left: number;
    width: number;
    height: number;
    shape?: EventShape;
  };
}

const DATA_FILE = path.join(process.cwd(), 'data', 'events.json');

export async function getEvents(): Promise<EventConfig[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    // Se o arquivo não existir, retorna um array vazio.
    // Assim o fallback de criação vai iniciar zerado ou apenas loga erro se não for ENOENT
    if (error.code !== 'ENOENT')
      console.error('Database reading error:', error);
    return [];
  }
}

export async function saveEvents(events: EventConfig[]): Promise<void> {
  // Garante que a pasta 'data' existe
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (e) {}

  await fs.writeFile(DATA_FILE, JSON.stringify(events, null, 2), 'utf-8');
}

export async function getEventById(
  id: string
): Promise<EventConfig | undefined> {
  const events = await getEvents();
  return events.find((evt) => evt.id === id);
}
