const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/misc.html";
const OUTPUT_DIR = path.join(__dirname, "emoteFistBump");
const OUTPUT_FILE = path.join(__dirname, "emoteFistBump.js");
const REACT_PATH = "@/assets/images/emoteFistBump";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Créer le dossier emote si nécessaire
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function downloadImage(url, outputPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erreur téléchargement ${url}: ${res.statusText}`);
  const buffer = await res.buffer();
  fs.writeFileSync(outputPath, buffer);
  console.log(`Image téléchargée: ${outputPath}`);
}

async function main() {

  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  console.log("Chargement de la page...");
  await page.goto(URL, { waitUntil: "networkidle0" });

  // === Onglet Emote ===
  console.log("Activation de l'onglet Emote...");
  await page.click("#emote-tab");
  await sleep(500);

  // === Récupération du tableau ===
  console.log("Récupération des données du tableau...");
  let tableData = await page.evaluate(() => {
    const table = document.querySelector('#emoteFistBump-table');
    if (!table) return [];

    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    return rows.map(tr => {
      const cells = Array.from(tr.querySelectorAll('td'));
      const obj = {};

      cells.forEach((td, index) => {
        const header = headers[index];
        const text = td.innerText.trim();

        if (header === "Category") {
          obj.category = text;
          return;
        }
        if (header === "Emotes") {
          const centers = Array.from(td.querySelectorAll("center"));

          obj.emotes = centers.map(center => {
            const img = center.querySelector("img");
            const label = center.innerText.replace(/\s+/g, " ").trim();

            return {
              src: img ? img.src : null,
              label
            };
          });

          return;
        }
      });

      return obj;
    });
  });

  console.log(`Nombre de poses récupérées : ${tableData.length}`);

  // === Télécharger les images et remplacer image par le nom de fichier ===
  for (const emote of tableData) {
    if (!emote.emotes || emote.emotes.length === 0) continue;

    for (const e of emote.emotes) {
      if (!e.src) continue;

      const filename = path.basename(e.src);
      const outputPath = path.join(OUTPUT_DIR, filename);

      try {
        await downloadImage(e.src, outputPath);
        e.image = filename;
        delete e.src;
      } catch (err) {
        console.error(`Erreur téléchargement ${e.src}`, err);
      }
    }

    // Nettoyage
    emote.emotes = emote.emotes.filter(e => e.image);
  }

  // Générer emote.js au format React / Expo
  let fileContent = "module.exports = [\n";

  tableData.forEach(emote => {
    fileContent += "  {\n";
    fileContent += `    category: '${emote.category}',\n`;
    fileContent += "    emotes: [\n";

    emote.emotes.forEach(e => {
      fileContent += "      {\n";
      fileContent += `        image: require('${REACT_PATH}/${e.image}'),\n`;
      fileContent += `        label: '${e.label.replace(/'/g, "\\'")}',\n`;
      fileContent += "      },\n";
    });

    fileContent += "    ],\n";
    fileContent += "  },\n";
  });

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");
  console.log(`Fichier emote.js généré au format React/Expo avec ${tableData.length} emotes.`);

    await browser.close();
  }

main().catch(console.error);
