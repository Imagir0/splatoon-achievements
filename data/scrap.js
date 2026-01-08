const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/collectibles.html";
const OUTPUT_DIR = path.join(__dirname, "badges");
const OUTPUT_FILE = path.join(__dirname, "badges.js");
const REACT_PATH = "@/assets/images/badges";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Créer le dossier badges si nécessaire
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

  // === Onglet Badge ===
  console.log("Activation de l'onglet Badge...");
  await page.click("#badge-tab");

  await page.waitForSelector('#badge .fixed-table-toolbar', { visible: true });
  console.log("Toolbar détectée.");
  await sleep(500);

  // === Ouvrir menu Columns ===
  const columnsButton = '#badge .fixed-table-toolbar .keep-open button.dropdown-toggle';
  await page.waitForSelector(columnsButton, { visible: true });
  await page.click(columnsButton);
  await sleep(400);

  // === Cocher toutes les colonnes ===
  console.log("Cochage de toutes les colonnes...");
  await page.evaluate(() => {
    const checkboxes = document.querySelectorAll('#badge .dropdown-item-marker input[type="checkbox"]');
    checkboxes.forEach(cb => {
      if (!cb.checked) cb.click();
    });
  });
  console.log("Toutes les colonnes cochées.");
  await sleep(300);

  // === Récupération du tableau ===
  console.log("Récupération des données du tableau...");
  let tableData = await page.evaluate(() => {
    const table = document.querySelector('#badge-table');
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
        if (header === "Category") {
          obj.category = td.innerText.trim();
          return;
        }
        if (header === "How To Unlock") {
          obj.description = td.innerText.trim();
          return;
        }
      });

      return obj;
    });
  });

  console.log(`Nombre de badges récupérés : ${tableData.length}`);

  // === Télécharger les images et remplacer image par le nom de fichier ===
  for (const badge of tableData) {
    const url = badge.image;
    if (!url) continue;

    const filename = path.basename(url);
    const outputPath = path.join(OUTPUT_DIR, filename);

    try {
      await downloadImage(url, outputPath);
      badge.image = filename;
    } catch (err) {
      console.error(`Erreur pour ${badge.id}:`, err);
    }
  }

  // Générer badges.js au format React / Expo
  let fileContent = "module.exports = [\n";

  tableData.forEach(badge => {
    fileContent += "  {\n";
    fileContent += `    id: ${badge.id},\n`;
    fileContent += `    image: require('${REACT_PATH}/${badge.image}'),\n`;
    fileContent += `    category: '${badge.category}',\n`;
    fileContent += `    description: '${badge.description.replace(/'/g, "\\'")}',\n`;
    fileContent += "  },\n";
  });

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");
  console.log(`Fichier badges.js généré au format React/Expo avec ${tableData.length} badges.`);

    await browser.close();
  }

main().catch(console.error);
