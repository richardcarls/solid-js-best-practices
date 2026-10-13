import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const rulesDir = join(root, "rules");
const rules = readdirSync(rulesDir).filter((file) => /^\d+-\d+-.*\.md$/.test(file));
const skill = readFileSync(join(root, "SKILL.md"), "utf8");
const readme = readFileSync(join(root, "README.md"), "utf8");
const errors = [];

for (const file of rules) {
  const source = readFileSync(join(rulesDir, file), "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);

  if (!frontmatter) {
    errors.push(`${file}: missing YAML frontmatter`);

    continue;
  }

  for (const field of ["title", "category", "priority", "version_basis"]) {
    if (!new RegExp(`^${field}:`, "m").test(frontmatter[1])) {
      errors.push(`${file}: missing ${field}`);
    }
  }

  if (!/^version_basis: \["1\.x"(?:, "2\.x")?\]$/m.test(frontmatter[1]) &&
      !/^version_basis: \["2\.x"\]$/m.test(frontmatter[1])) {
    errors.push(`${file}: unsupported version_basis value`);
  }
}

for (let category = 1; category <= 9; category++) {
  const count = rules.filter((file) => file.startsWith(`${category}-`)).length;
  const heading = skill.match(new RegExp(`^### ${category}\\. .*\\((\\d+) rules\\)`, "m"));

  if (!heading || Number(heading[1]) !== count) {
    errors.push(`SKILL.md: category ${category} count should be ${count}`);

    continue;
  }

  const start = skill.indexOf(heading[0]) + heading[0].length;
  const end = skill.slice(start).search(/^#{2,3} /m);
  const section = end < 0 ? skill.slice(start) : skill.slice(start, start + end);
  const links = [...section.matchAll(new RegExp(`\\| \\[${category}-\\d+\\]\\(rules/([^)]*)\\)`, "g"))];

  if (links.length !== count || new Set(links.map((match) => match[1])).size !== count) {
    errors.push(`SKILL.md: category ${category} should index each of its ${count} rules once`);
  }

  const readmeRow = readme.match(new RegExp(`^\\| \\[[^\\]]+\\]\\(rules/${category}-[^)]*\\) \\| (\\d+) \\|`, "m"));

  if (!readmeRow || Number(readmeRow[1]) !== count) {
    errors.push(`README.md: category ${category} count should be ${count}`);
  }
}

const declaredTotal = readme.match(/\*\*(\d+) actionable rules\*\*/);

if (!declaredTotal || Number(declaredTotal[1]) !== rules.length) {
  errors.push(`README.md: headline should report ${rules.length} rules`);
}

const markdownFiles = ["SKILL.md", "README.md", "AGENTS.md", "CHANGELOG.md", "docs/version-support-plan.md"]
  .map((file) => join(root, file))
  .concat(rules.map((file) => join(rulesDir, file)));

for (const file of markdownFiles) {
  const source = readFileSync(file, "utf8");

  for (const [, target] of source.matchAll(/\]\(([^)]+)\)/g)) {
    if (/^(?:https?:|mailto:|#)/.test(target)) {
      continue;
    }

    const path = target.split("#", 1)[0];

    if (path && !existsSync(resolve(dirname(file), path))) {
      errors.push(`${file.slice(root.length + 1)}: missing link ${target}`);
    }
  }
}

if (errors.length) {
  throw new Error(errors.join("\n"));
}

console.log(`Checked ${rules.length} rules, indexes, frontmatter, and local links.`);
