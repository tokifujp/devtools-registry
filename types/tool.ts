export interface Tool {
  id: string;
  name: string;
  category: string;
  tags: string[];
  officialSite?: string;
  githubUrl?: string;
  description: string;
  installations: Installation[];
  usage: Usage;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Installation {
  id: string;
  os: string;
  installMethod: string;
  commands: string;
  configFiles?: string;
  configNotes?: string;
  installedAt?: string;
  notes?: string;
}

export interface Usage {
  commonCommands: Command[];
  tips: string;
}

export interface Command {
  id: string;
  command: string;
  description: string;
}
