const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/collectibles.html";
const OUTPUT_DIR = path.join(__dirname, "emote");
const OUTPUT_FILE = path.join(__dirname, "emote.js");
const REACT_PATH = "@/assets/images/emote";

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

  await page.waitForSelector('#emote .fixed-table-toolbar', { visible: true });
  console.log("Toolbar détectée.");
  await sleep(500);

  // === Ouvrir menu Columns ===
  const columnsButton = '#emote .fixed-table-toolbar .keep-open button.dropdown-toggle';
  await page.waitForSelector(columnsButton, { visible: true });
  await page.click(columnsButton);
  await sleep(400);

  // === Cocher toutes les colonnes ===
  console.log("Cochage de toutes les colonnes...");
  await page.evaluate(() => {
    const checkboxes = document.querySelectorAll('#emote .dropdown-item-marker input[type="checkbox"]');
    checkboxes.forEach(cb => {
      if (!cb.checked) cb.click();
    });
  });
  console.log("Toutes les colonnes cochées.");
  await sleep(300);

  // === Récupération du tableau ===
  console.log("Récupération des données du tableau...");
  let tableData = await page.evaluate(() => {
    const table = document.querySelector('#emote-table');
    if (!table) return [];

    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    return rows.map(tr => {
      const cells = Array.from(tr.querySelectorAll('td'));
      const obj = {};

      cells.forEach((td, index) => {
        const header = headers[index];

        if (header === "Image") {
          const img = td.querySelector("img");
          obj.image = img ? img.src : "";
          return;
        }
        if (header === "Internal ID") {
          obj.id = td.innerText.trim();
          return;
        }
        if (header === "Name") {
          obj.name = td.innerText.trim();
          return;
        }
        if (header === "How To Get") {
          obj.howToGet = td.innerText.trim();
          return;
        }
        if (header === "Season") {
          obj.season = td.innerText.trim();
          return;
        }
      });

      return obj;
    });
  });

  console.log(`Nombre de poses récupérées : ${tableData.length}`);

  // === Télécharger les images et remplacer image par le nom de fichier ===
  for (const emote of tableData) {
    const url = emote.image;
    if (!url) continue;

    const filename = path.basename(url);
    const outputPath = path.join(OUTPUT_DIR, filename);

    try {
      await downloadImage(url, outputPath);
      emote.image = filename;
    } catch (err) {
      console.error(`Erreur pour ${emote.id}:`, err);
    }
  }

  // Générer emote.js au format React / Expo
  let fileContent = "module.exports = [\n";

  tableData.forEach(emote => {
    fileContent += "  {\n";
    fileContent += `    id: ${emote.id},\n`;
    fileContent += `    image: require('${REACT_PATH}/${emote.image}'),\n`;
    fileContent += `    name: '${emote.name.replace(/'/g, "\\'")}',\n`;
    fileContent += `    howToGet: '${emote.howToGet.replace(/'/g, "\\'")}',\n`;
    fileContent += `    season: ${emote.season},\n`;
    fileContent += "  },\n";
  });

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");
  console.log(`Fichier emote.js généré au format React/Expo avec ${tableData.length} emotes.`);

    await browser.close();
  }

main().catch(console.error);
