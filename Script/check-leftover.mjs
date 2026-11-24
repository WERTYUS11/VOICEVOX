import fs from "fs";
import path from "path";

const KANA = /[\u3041-\u309F\u30A0-\u30FF\uFF66-\uFF9F]/; // 平假名/片假名/半角片假名
let hits = 0;

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|vue|js|tsx|json|html)$/.test(name)) scan(p);
  }
}

function scan(file) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    const t = line.trim();
    if (!t || t.startsWith("//") || t.startsWith("*")) return; // 跳过注释
    if (KANA.test(t)) {
      hits++;
      console.log(`${file}:${i + 1}  ${t.slice(0, 100)}`);
    }
  });
}

walk(process.argv[2] || "src");
console.log(`\n共 ${hits} 行仍含日文假名`);
