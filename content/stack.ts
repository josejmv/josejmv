import type { StackItemInput } from "./schema";

export const stack = [
  { id: "nextjs", label: "Next.js · RSC" },
  { id: "react", label: "React" },
  { id: "typescript", label: "TypeScript" },
  { id: "nestjs", label: "NestJS" },
  { id: "python-fastapi", label: "Python · FastAPI" },
  { id: "postgresql", label: "PostgreSQL" },
  { id: "redis-bullmq", label: "Redis · BullMQ" },
  { id: "docker-gitlab-ci", label: "Docker · GitLab CI" },
  { id: "aws-bedrock", label: "AWS Bedrock · LLMs" },
  { id: "claude-code", label: "Claude Code" },
] satisfies StackItemInput[];
