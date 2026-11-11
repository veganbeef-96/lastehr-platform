# Last EHR (brainstorming copy)

An experiment in putting an AI assistant in front of electronic health record (EHR) data, using the FHIR standard. The assistant can search and read patient records. Any change it wants to make is shown to a human for approval before it is saved.

> **This is an unofficial, personal brainstorming copy.** It is not the official project and is not affiliated with or endorsed by its original maintainers, Medplum, or Vercel. The original project is at <https://github.com/cbetz/last-ehr>.
>
> Use synthetic data only. This is not medical software and must not be used for patient care.

**It reads the chart broadly.** 25 of [US Core 9.0.0](https://hl7.org/fhir/us/core/)'s 27 readable resource types, across 23 patient-scoped sections, following references so authors, encounters, and provenance stop being dead pointers. The coverage page lists the ceiling and what is not yet readable: [docs/fhir-coverage.md](./docs/fhir-coverage.md).

## Architecture

```
  Browser chat UI  ──►  Next.js app (app/, components/)
                              │
                              ▼
                 Agent endpoint (app/api/chat/route.ts)
                 • LLM via the Vercel AI SDK
                 • FHIR tools: search, read, propose writes
                              │
                              ▼
                 Backend interface (lib/fhir/backend.ts)
                 • one small interface, many adapters
                              │
             ┌────────────────┼──────────────────────┐
             ▼                ▼                      ▼
        Medplum          HAPI, Firely,         Epic and Oracle
     (main target)    Aidbox, Oystehr        Health sandboxes
                      (local test servers)   (experimental)
                              │
                              ▼
                        FHIR server with
                        (synthetic) patient data

  Write path:  agent proposes → human approves or declines → save to FHIR

  MCP server:  packages/mcp  (@lastehr/mcp)
               Lets MCP-capable AI clients (Claude, Cursor) use the same tools.

  Conformance: packages/conformance  (@lastehr/agent-write-conformance)
               Checks that an agent follows the write-approval protocol.
```

### Key ideas

- **Humans approve writes.** The agent never saves a change on its own. Each proposed change is shown as an approval card first.
- **One backend interface.** Each FHIR server is a small adapter behind the same interface, so the agent code does not change between backends.
- **Writes are opt-in for MCP.** The MCP server is read-only unless `LASTEHR_MCP_WRITES=proposal` is set.

## Folder guide

| Path | What it is |
| --- | --- |
| `app/` | Next.js pages and API routes (chat, demo, docs) |
| `components/` | React UI components |
| `lib/` | Core logic: FHIR adapters, agent helpers, docs registry |
| `packages/mcp/` | Standalone MCP server package |
| `packages/conformance/` | Checks for the agent write-approval protocol |
| `examples/fhir-adapter-starter/` | Starter template for a new FHIR adapter |
| `scripts/` | Command-line tools: demos, evals, seeding, checks |
| `docs/` | Project documentation |
| `test/`, `e2e/`, `work-e2e/` | Unit and browser tests |
| `docker/`, `docker-compose*.yml` | Local FHIR servers and container setup |
| `tools/demo-video/` | Tooling for demo recordings |

## Running it locally

Requirements: Node.js (version in `.nvmrc`) and npm.

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev                  # starts the web app
npm test                     # runs the unit tests
```

Most of the configuration lives in `.env.example`, with comments for each option.

## Licensing and attribution

The code is still licensed under the **Apache License 2.0**, which is what the original project uses. See [`LICENSE`](./LICENSE) and [`NOTICE`](./NOTICE). The notice file also credits the third-party libraries this project uses (Medplum and the Vercel AI SDK).
