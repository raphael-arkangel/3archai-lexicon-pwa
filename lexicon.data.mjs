// GENERATED from lexicon.json — do not edit by hand.
// 3archAI AI lexicon, version 2026.10.30, 85 terms.
export const LEXICON = {
  "name": "3archAI AI lexicon",
  "version": "2026.10.30",
  "count": 85,
  "description": "Core AI vocabulary to work with agents. Word of the day, plus the ten to know before you start.",
  "source": "Mined from 75,197 messages (Raphael), 9,445 (Gabriel), 5,771 (Michael); cross-checked 2026-10-30.",
  "rotation": {
    "epoch": "2026-10-30",
    "stride": 28,
    "lead_days": 10,
    "rule": "day 0-9 serve `starter` in order; day 10+ serve the remaining terms with index = ((day-10)*stride) mod 75"
  },
  "starter": [
    {
      "id": "session",
      "why": "the persistent thread; get it wrong and you re-explain everything, or assume memory that isn't there"
    },
    {
      "id": "agent",
      "why": "a worker with tools, not a search box; get it wrong and you ask questions all day and never give it work"
    },
    {
      "id": "context-window",
      "why": "how much it holds at once; get it wrong and old instructions are compacted away mid-task, silently"
    },
    {
      "id": "tool-call",
      "why": "how it touches real files and systems; get it wrong and you accept fluent answers about files nobody opened"
    },
    {
      "id": "gateway",
      "why": "the always-on process behind the channel; get it wrong and you debug the model when the daemon is down"
    },
    {
      "id": "channel",
      "why": "where the reply lands; get it wrong and work is done and the message is never seen"
    },
    {
      "id": "skill",
      "why": "a saved procedure; get it wrong and every session reinvents the method, differently"
    },
    {
      "id": "approval",
      "why": "the deliberate stop before damage; get it wrong and an irreversible action happens with no pause"
    },
    {
      "id": "provider",
      "why": "whose model, and the backup; get it wrong and one quota error ends the task"
    },
    {
      "id": "read-back-verification",
      "why": "fetching the changed target to prove the change; get it wrong and an API 'ok' is reported as done"
    }
  ],
  "groups": [
    {
      "id": "model",
      "title": "The model",
      "count": 10
    },
    {
      "id": "context",
      "title": "Context and memory",
      "count": 9
    },
    {
      "id": "agents",
      "title": "Agents and tools",
      "count": 15
    },
    {
      "id": "runtime",
      "title": "Runtime and plumbing",
      "count": 30
    },
    {
      "id": "delivery",
      "title": "Delivery and trust",
      "count": 21
    }
  ],
  "terms": [
    {
      "id": "model",
      "term": "Model",
      "group": "model",
      "definition": "the trained artefact that turns input into output. \"70B\" is a size, not a measure of quality."
    },
    {
      "id": "training",
      "term": "Training",
      "group": "model",
      "definition": "fitting the weights to data. Expensive, done once, by someone else."
    },
    {
      "id": "inference",
      "term": "Inference",
      "group": "model",
      "definition": "using the trained model. Every request you make is inference."
    },
    {
      "id": "token",
      "term": "Token",
      "group": "model",
      "definition": "the unit it reads and bills by; roughly four characters of English."
    },
    {
      "id": "context-window",
      "term": "Context window",
      "group": "model",
      "definition": "how many tokens it can see at once. Its desk, not its memory."
    },
    {
      "id": "prompt",
      "term": "Prompt",
      "group": "model",
      "definition": "the text you give it. For most users, the entire interface."
    },
    {
      "id": "system-prompt",
      "term": "System prompt",
      "group": "model",
      "definition": "standing instructions that outrank the conversation."
    },
    {
      "id": "structured-output",
      "term": "Structured output",
      "group": "model",
      "definition": "forcing a machine-readable shape, usually JSON."
    },
    {
      "id": "multimodal",
      "term": "Multimodal",
      "group": "model",
      "definition": "handles more than text: images, audio, video."
    },
    {
      "id": "hallucination",
      "term": "Hallucination",
      "group": "model",
      "definition": "fluent output that is not true. Structural, not a bug awaiting a patch."
    },
    {
      "id": "context",
      "term": "Context",
      "group": "context",
      "definition": "everything inside the window for this turn."
    },
    {
      "id": "compaction",
      "term": "Compaction",
      "group": "context",
      "definition": "summarising old turns so the window stays workable. Lossy, and worth watching."
    },
    {
      "id": "session",
      "term": "Session",
      "group": "context",
      "definition": "one continuous conversation; the unit that keeps state."
    },
    {
      "id": "memory",
      "term": "Memory",
      "group": "context",
      "definition": "notes stored outside the window and re-injected later."
    },
    {
      "id": "rag",
      "term": "RAG (retrieval)",
      "group": "context",
      "definition": "fetching documents and putting them in the prompt."
    },
    {
      "id": "grounding",
      "term": "Grounding",
      "group": "context",
      "definition": "tying an answer to supplied sources rather than to recall."
    },
    {
      "id": "citation",
      "term": "Citation",
      "group": "context",
      "definition": "naming the source of a claim; the audit trail of an answer."
    },
    {
      "id": "provenance",
      "term": "Provenance",
      "group": "context",
      "definition": "where content came from, and how you can prove it."
    },
    {
      "id": "source-of-truth",
      "term": "Source of truth",
      "group": "context",
      "definition": "the one place a fact lives, so two copies cannot quietly disagree."
    },
    {
      "id": "agent",
      "term": "Agent",
      "group": "agents",
      "definition": "a model that acts in a loop rather than answering once."
    },
    {
      "id": "agentic",
      "term": "Agentic",
      "group": "agents",
      "definition": "an arrangement where the AI takes steps and decides the next one."
    },
    {
      "id": "tool-call",
      "term": "Tool call",
      "group": "agents",
      "definition": "the model asking your code to run something and returning the result."
    },
    {
      "id": "skill",
      "term": "Skill",
      "group": "agents",
      "definition": "a saved procedure loaded when the task matches. Ours live in `~/.hermes/skills`."
    },
    {
      "id": "harness",
      "term": "Harness",
      "group": "agents",
      "definition": "the runtime that gives a model hands, memory and rules. Hermes is ours."
    },
    {
      "id": "orchestration",
      "term": "Orchestration",
      "group": "agents",
      "definition": "who runs, in what order, with which tools."
    },
    {
      "id": "subagent",
      "term": "Subagent",
      "group": "agents",
      "definition": "a child agent given one scoped job and its own context."
    },
    {
      "id": "delegation",
      "term": "Delegation",
      "group": "agents",
      "definition": "handing a whole task down to one."
    },
    {
      "id": "loop",
      "term": "Loop",
      "group": "agents",
      "definition": "think, act, observe, repeat. Agents fail by looping."
    },
    {
      "id": "turn",
      "term": "Turn",
      "group": "agents",
      "definition": "one exchange; the unit of work and of cost."
    },
    {
      "id": "autonomy",
      "term": "Autonomy",
      "group": "agents",
      "definition": "how far it may act without asking. A permission, not a feature."
    },
    {
      "id": "approval",
      "term": "Approval",
      "group": "agents",
      "definition": "a human gate before an action takes effect."
    },
    {
      "id": "guardrail",
      "term": "Guardrail",
      "group": "agents",
      "definition": "a hard limit enforced in code, not requested in a prompt."
    },
    {
      "id": "sandbox",
      "term": "Sandbox",
      "group": "agents",
      "definition": "a contained environment so an action cannot reach further."
    },
    {
      "id": "escalation",
      "term": "Escalation",
      "group": "agents",
      "definition": "handing a decision to a person when the agent is out of its depth."
    },
    {
      "id": "gateway",
      "term": "Gateway",
      "group": "runtime",
      "definition": "the process that receives messages and routes them to the agent."
    },
    {
      "id": "channel",
      "term": "Channel",
      "group": "runtime",
      "definition": "one place a conversation arrives from: Discord, Telegram, the API."
    },
    {
      "id": "bot",
      "term": "Bot",
      "group": "runtime",
      "definition": "the account that speaks as the agent on a platform."
    },
    {
      "id": "profile-soul",
      "term": "Profile / soul",
      "group": "runtime",
      "definition": "the persona file that makes one agent distinct from another on the same box."
    },
    {
      "id": "peer-peer-dm",
      "term": "Peer / peer DM",
      "group": "runtime",
      "definition": "another agent on another machine, reached directly. Agent-to-agent, not human-facing."
    },
    {
      "id": "tailscale",
      "term": "Tailscale",
      "group": "runtime",
      "definition": "the private network between our boxes. Neither hosting nor DNS covers it."
    },
    {
      "id": "worker",
      "term": "Worker",
      "group": "runtime",
      "definition": "the compute unit doing the job; on Cloudflare, the deployed function itself."
    },
    {
      "id": "service-process-port",
      "term": "Service / process / port",
      "group": "runtime",
      "definition": "what is running, under which name, listening where."
    },
    {
      "id": "systemd-unit-and-timer",
      "term": "Systemd unit and timer",
      "group": "runtime",
      "definition": "what actually runs cron, and what dies quietly when a job fails."
    },
    {
      "id": "oom-swap",
      "term": "OOM / swap",
      "group": "runtime",
      "definition": "running out of memory; the usual reason a gateway stops answering."
    },
    {
      "id": "cron",
      "term": "Cron",
      "group": "runtime",
      "definition": "a scheduled job that runs without a person."
    },
    {
      "id": "pwa",
      "term": "PWA",
      "group": "runtime",
      "definition": "a website installed like an app, offline-capable by design."
    },
    {
      "id": "api",
      "term": "API",
      "group": "runtime",
      "definition": "the door code calls through."
    },
    {
      "id": "endpoint",
      "term": "Endpoint",
      "group": "runtime",
      "definition": "the URL that door answers on."
    },
    {
      "id": "webhook",
      "term": "Webhook",
      "group": "runtime",
      "definition": "a call the other system makes to you when something happens."
    },
    {
      "id": "cli",
      "term": "CLI",
      "group": "runtime",
      "definition": "the command line; the shortest path to the truth on a box."
    },
    {
      "id": "environment-variable",
      "term": "Environment variable",
      "group": "runtime",
      "definition": "configuration handed to a process at start, kept out of the code."
    },
    {
      "id": "provider",
      "term": "Provider",
      "group": "runtime",
      "definition": "who supplies the model: DeepSeek, OpenRouter, Anthropic."
    },
    {
      "id": "fallback",
      "term": "Fallback",
      "group": "runtime",
      "definition": "the second provider or route used when the first fails."
    },
    {
      "id": "retry",
      "term": "Retry",
      "group": "runtime",
      "definition": "resending a failed call. Bound it, or it becomes a loop that costs money."
    },
    {
      "id": "idempotency-key",
      "term": "Idempotency key",
      "group": "runtime",
      "definition": "a label that makes a repeat of the same request harmless."
    },
    {
      "id": "rate-limit",
      "term": "Rate limit",
      "group": "runtime",
      "definition": "the provider's ceiling on your request volume."
    },
    {
      "id": "quota",
      "term": "Quota",
      "group": "runtime",
      "definition": "your own budget ceiling, which is a different thing from theirs."
    },
    {
      "id": "cache",
      "term": "Cache",
      "group": "runtime",
      "definition": "stored work reused. Cached context is what makes long sessions affordable."
    },
    {
      "id": "reset",
      "term": "Reset",
      "group": "runtime",
      "definition": "clearing state to start clean. A diagnosis, not a fix."
    },
    {
      "id": "health-check",
      "term": "Health check",
      "group": "runtime",
      "definition": "a cheap question that proves the thing is alive, not that it works."
    },
    {
      "id": "log",
      "term": "Log",
      "group": "runtime",
      "definition": "the record of what actually happened, as opposed to what was intended."
    },
    {
      "id": "watchdog",
      "term": "Watchdog",
      "group": "runtime",
      "definition": "a check that notices silence and says so."
    },
    {
      "id": "manifest",
      "term": "Manifest",
      "group": "runtime",
      "definition": "the declared state of a system, written down so drift can be measured."
    },
    {
      "id": "drift",
      "term": "Drift",
      "group": "runtime",
      "definition": "quiet change that erodes quality over months."
    },
    {
      "id": "deploy",
      "term": "Deploy",
      "group": "delivery",
      "definition": "moving code into production. With us, push to `main` is the release."
    },
    {
      "id": "repository",
      "term": "Repository",
      "group": "delivery",
      "definition": "the versioned record; branch, commit and pull request are its parts."
    },
    {
      "id": "commit-branch-merge",
      "term": "Commit / branch / merge",
      "group": "delivery",
      "definition": "a saved change, a line of work, and the joining of two lines."
    },
    {
      "id": "rollback",
      "term": "Rollback",
      "group": "delivery",
      "definition": "returning to the last known-good state. Not the same as a revert, and faster."
    },
    {
      "id": "preview-and-staging",
      "term": "Preview and staging",
      "group": "delivery",
      "definition": "the untrusted build, and the one that almost is production."
    },
    {
      "id": "cutover",
      "term": "Cutover",
      "group": "delivery",
      "definition": "the moment traffic moves from the old system to the new one."
    },
    {
      "id": "smoke-test-and-canary",
      "term": "Smoke test and canary",
      "group": "delivery",
      "definition": "a shallow check that it runs, and a small real audience before everyone."
    },
    {
      "id": "read-back-verification",
      "term": "Read-back / verification",
      "group": "delivery",
      "definition": "fetching the changed target to prove the change; an API saying \"ok\" is not proof."
    },
    {
      "id": "handoff",
      "term": "Handoff",
      "group": "delivery",
      "definition": "moving work between sessions, agents or people without losing the thread."
    },
    {
      "id": "domain",
      "term": "Domain",
      "group": "delivery",
      "definition": "the name that points at a service."
    },
    {
      "id": "hosting",
      "term": "Hosting",
      "group": "delivery",
      "definition": "where the service actually runs."
    },
    {
      "id": "dns-and-tls",
      "term": "DNS and TLS",
      "group": "delivery",
      "definition": "how the name finds the host, and how the connection is trusted."
    },
    {
      "id": "robots-and-noindex",
      "term": "Robots and noindex",
      "group": "delivery",
      "definition": "the two switches deciding whether the web may crawl and index a page."
    },
    {
      "id": "artifact",
      "term": "Artifact",
      "group": "delivery",
      "definition": "a file produced by work: a build, an image, a document."
    },
    {
      "id": "policy",
      "term": "Policy",
      "group": "delivery",
      "definition": "the written rule set the agent must obey."
    },
    {
      "id": "credential",
      "term": "Credential",
      "group": "delivery",
      "definition": "a key or password. Never in chat, never in git."
    },
    {
      "id": "oauth-mfa",
      "term": "OAuth / MFA",
      "group": "delivery",
      "definition": "the consent and second-factor steps that stop an agent acting as you."
    },
    {
      "id": "identity",
      "term": "Identity",
      "group": "delivery",
      "definition": "who the agent is on each platform, and what it may claim to be."
    },
    {
      "id": "allow-list",
      "term": "Allow-list",
      "group": "delivery",
      "definition": "the named people and hosts the agent acts for without re-verifying."
    },
    {
      "id": "backup",
      "term": "Backup",
      "group": "delivery",
      "definition": "the copy that proves a box can be rebuilt."
    },
    {
      "id": "provisioning",
      "term": "Provisioning",
      "group": "delivery",
      "definition": "bringing a machine or account to a known state."
    }
  ]
};

export default LEXICON;
