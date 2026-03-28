import { z } from 'zod';

const CommandSchema = z.object({
  command: z.string().max(500),
  description: z.string().max(500),
});

const InstallationSchema = z.object({
  os: z.string().max(100),
  commands: z.array(z.string().max(1000)).max(50),
  configFiles: z.string().max(5000).optional(),
  configNotes: z.string().max(5000).optional(),
  date: z.string().optional(),
  installationNotes: z.string().max(5000).optional(),
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
    commands: z.array(CommandSchema).max(100),
    tips: z.string().max(5000).optional(),
  }),
  notes: z.string().max(10000),
});
