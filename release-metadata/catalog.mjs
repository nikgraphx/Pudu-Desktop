// Release metadata only. This repository contains no Pudu application source.
const base = "https://github.com/nikgraphx/Pudu-desktop/releases/";
const compare = (a, b) => {
  const av = a.version.split(".").map(Number),
    bv = b.version.split(".").map(Number);
  return bv[0] - av[0] || bv[1] - av[1] || bv[2] - av[2];
};
export function releaseEntry(release, platform) {
  if (
    !release ||
    release.draft ||
    release.prerelease ||
    !/^v\d+\.\d+\.\d+$/.test(release.tag_name) ||
    !Number.isFinite(Date.parse(release.published_at))
  )
    return null;
  const version = release.tag_name.slice(1);
  const asset = (name) =>
    release.assets.find(
      (a) =>
        a.name === name &&
        a.state === "uploaded" &&
        Number.isSafeInteger(a.size) &&
        a.size > 0 &&
        a.browser_download_url.toLowerCase() ===
          `${base}download/v${version}/${name}`.toLowerCase(),
    );
  const names =
    platform === "mac"
      ? ["arm64", "x64"].map((arch) => `Pudu-${version}-mac-${arch}.dmg`)
      : [`Pudu-${version}-win-x64.exe`];
  const required =
    platform === "mac"
      ? [
          ...names,
          ...["arm64", "x64"].map((arch) => `Pudu-${version}-mac-${arch}.zip`),
          "latest-mac.yml",
        ]
      : [...names, `${names[0]}.blockmap`];
  if (!required.every(asset)) return null;
  return {
    platform,
    version,
    publishedAt: release.published_at,
    notesUrl: `${base}tag/v${version}`,
    assets: names.map((name) => ({
      arch: name.includes("-arm64.") ? "arm64" : "x64",
      url: asset(name).browser_download_url,
      filename: name,
      size: asset(name).size,
    })),
  };
}
export function promoteCatalog(old, releases, tag) {
  // Only promote the triggering product tag. Never import historical bootstrap
  // releases merely because they exist; reconcile previously promoted entries.
  const promoted = new Set(
    [...(old.current || []), ...(old.previous || [])].map(
      (r) => `v${r.version}`,
    ),
  );
  if (tag) promoted.add(tag);
  const entries = releases
    .filter((r) => promoted.has(r.tag_name))
    .flatMap((r) =>
      ["mac", "windows"].map((p) => releaseEntry(r, p)).filter(Boolean),
    );
  const current = ["mac", "windows"]
    .map((p) => entries.filter((r) => r.platform === p).sort(compare)[0])
    .filter(Boolean);
  const previous = entries
    .filter(
      (r) =>
        !current.some(
          (c) => c.platform === r.platform && c.version === r.version,
        ),
    )
    .sort(compare)
    .slice(0, 20);
  return { schema: 1, current, previous };
}
