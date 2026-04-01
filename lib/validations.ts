import { z } from 'zod';

const CommandSchema = z.object({
  id: z.string().max(50).optional(),
  command: z.string().max(500),
  description: z.string().max(500),
});

const InstallationSchema = z.object({
  id: z.string().max(50).optional(),
  os: z.string().max(100),
  installMethod: z.string().max(200).optional().default(''),
  commands: z.string().max(5000).optional().default(''),
  configFiles: z.string().max(5000).optional(),
  configNotes: z.string().max(5000).optional(),
  installedAt: z.string().optional(),
  notes: z.string().max(5000).optional(),
});

export const ToolSchema = z.object({
  id: z.string().max(50),
  name: z.string().min(1).max(200),
  category: z.string().min(1).max(100),
  tags: z.array(z.string().max(50)).max(20),
  officialSite: z.string().url().or(z.literal('')).optional(),
  githubUrl: z.string().url().or(z.literal('')).optional(),
  description: z.string().max(10000),
  installations: z.array(InstallationSchema).max(20),
  usage: z.object({
    commonCommands: z.array(CommandSchema).max(100),
    tips: z.string().max(5000),
  }),
  notes: z.string().max(10000),
});
