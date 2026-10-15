import { readFile } from "node:fs/promises";
import { promoteCatalog } from "./catalog.mjs";
const repo = "nikgraphx/Pudu-desktop";
if (process.env.GITHUB_REPOSITORY?.toLowerCase() !== repo.toLowerCase())
  throw Error("Unexpected repository");
const token = process.env.GITHUB_TOKEN;
if (!token) throw Error("Missing workflow token");
async function api(path, options = {}) {
  const response = await fetch(`https://api.github.com/repos/${repo}/${path}`, {
    ...options,
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    },
  });
  if (!response.ok) throw Error(`GitHub metadata API: ${response.status}`);
  return response.json();
}
const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, "utf8"));
const tag = event.release?.tag_name || event.inputs?.tag || undefined;
const file = await api("contents/downloads.json?ref=main");
const old = JSON.parse(Buffer.from(file.content, "base64").toString());
const releases = [];
for (let page = 1; page <= 10; page++) {
  const batch = await api(`releases?per_page=100&page=${page}`);
  releases.push(...batch);
  if (batch.length < 100) break;
}
const next = promoteCatalog(old, releases, tag);
if (
  JSON.stringify({
    schema: old.schema,
    current: old.current,
    previous: old.previous,
  }) === JSON.stringify(next)
)
  console.log("Stable download catalog already current.");
else {
  await api("contents/downloads.json", {
    method: "PUT",
    body: JSON.stringify({
      message: "Sync stable desktop downloads",
      branch: "main",
      sha: file.sha,
      content: Buffer.from(
        JSON.stringify(
          { ...next, updatedAt: new Date().toISOString() },
          null,
          2,
        ) + "\n",
      ).toString("base64"),
    }),
  });
  console.log(
    "Stable release catalog updated:",
    next.current.map((r) => `${r.platform} ${r.version}`).join(", "),
  );
}
