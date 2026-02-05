const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/medals.html";

const OUTPUT_DIR = path.join(__dirname, "medals");
const OUTPUT_FILE = path.join(__dirname, "medals.js");
const REACT_PATH = "@/assets/images/medals";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Télécharge une image depuis une URL absolue
 * et retourne uniquement le nom du fichier.
 */
async function downloadImage(url) {
  if (!url || !url.startsWith("http")) return null;

  const filename = path.basename(url);
  const outputPath = path.join(OUTPUT_DIR, filename);

  if (!fs.existsSync(outputPath)) {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Échec téléchargement: ${url}`);
      return null;
    }
    const buffer = await res.buffer();
    fs.writeFileSync(outputPath, buffer);
    console.log(`Image téléchargée: ${filename}`);
  }

  return filename;
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  console.log("Chargement de la page…");
  await page.goto(URL, { waitUntil: "networkidle0" });
  await sleep(500);
  console.log("Récupération des données…");

  const medalsData = await page.evaluate(() => {
    const table = document.querySelector("#Medals-table");
    if (!table) return [];

    const headers = Array.from(table.querySelectorAll("thead th")).map(th =>
      th.innerText.trim()
    );

    return Array.from(table.querySelectorAll("tbody tr")).map(tr => {
      const cells = Array.from(tr.querySelectorAll("td"));
      const obj = {};

      cells.forEach((td, i) => {
        const img = td.querySelector("img");
        const text = td.innerText.trim();

        switch (i) {
            case 0:
            obj.image = img?.src || null;
            break;

            case 1:
            obj.name = text;
            break;

            case 2:
            obj.description = text;
            break;
        }
        });

      return obj;
    });
  });

  console.log(`Nombre de medals récupérés : ${medalsData.length}`);

  console.log("Téléchargement des images…");

  for (const np of medalsData) {
    np.image = await downloadImage(np.image);

    if (np.medal) np.medal.image = await downloadImage(np.medal.image);

  }

  console.log("Génération du fichier medals.js…");

  let fileContent = "module.exports = [\n";

  for (const np of medalsData) {

  const safeTextColor = np.description
  ? np.description
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";

    fileContent += "  {\n";
    fileContent += `    image: ${np.image ? `require('${REACT_PATH}/${np.image}')` : "null"},\n`;
    fileContent += `    name: '${np.name}',\n`;
    fileContent += `    description: '${safeTextColor}',\n`;
    fileContent += "  },\n";
  }

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");

  console.log("medals.js généré avec succès.");
  await browser.close();
}

main().catch(console.error);
