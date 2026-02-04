const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/misc.html";
const OUTPUT_DIR = path.join(__dirname, "bonus");
const OUTPUT_FILE = path.join(__dirname, "bonus.js");
const REACT_PATH = "@/assets/images/bonus";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Créer le dossier bonus si nécessaire
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

  // === Onglet Brands ===
  console.log("Activation de l'onglet brands...");
  await page.click("#brands-tab");
  await sleep(500);

  // === Récupération du tableau ===
  console.log("Récupération des données du tableau...");
  let tableData = await page.evaluate(() => {
    const table = document.querySelector('#brands-table');
    if (!table) return [];

    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    return rows.map(tr => {
      const cells = Array.from(tr.querySelectorAll('td'));
      const obj = {};

      cells.forEach((td, index) => {
        const header = headers[index];
        const img = td.querySelector("img");
        const text = td.innerText.trim();

        if (header === "Brand") {
          obj.brandImage = img?.src || null;
          obj.brand = text;
        } else if (header === "Likely") {
          obj.likelyImage = img?.src || null;
          obj.likely = text;
        } else if (header === "Unlikely") {
          obj.unlikelyImage = img?.src || null;
          obj.unlikely = text;
        }
      });

      return obj;
    });
  });

  console.log(`Nombre de bonus récupérés : ${tableData.length}`);

  // === Télécharger les images ===
  for (const bonus of tableData) {
    // Brand image
    if (bonus.brandImage) {
      const filename = path.basename(bonus.brandImage);
      const outputPath = path.join(OUTPUT_DIR, filename);
      try {
        await downloadImage(bonus.brandImage, outputPath);
        bonus.brandImage = filename;
      } catch (err) {
        console.error(`Erreur téléchargement ${bonus.brandImage}`, err);
        bonus.brandImage = null;
      }
    }

    // Likely image
    if (bonus.likelyImage) {
      const filename = path.basename(bonus.likelyImage);
      const outputPath = path.join(OUTPUT_DIR, filename);
      try {
        await downloadImage(bonus.likelyImage, outputPath);
        bonus.likelyImage = filename;
      } catch (err) {
        console.error(`Erreur téléchargement ${bonus.likelyImage}`, err);
        bonus.likelyImage = null;
      }
    }

    // Unlikely image
    if (bonus.unlikelyImage) {
      const filename = path.basename(bonus.unlikelyImage);
      const outputPath = path.join(OUTPUT_DIR, filename);
      try {
        await downloadImage(bonus.unlikelyImage, outputPath);
        bonus.unlikelyImage = filename;
      } catch (err) {
        console.error(`Erreur téléchargement ${bonus.unlikelyImage}`, err);
        bonus.unlikelyImage = null;
      }
    }
  }

  // === Générer bonus.js au format React / Expo ===
  let fileContent = "module.exports = [\n";

  tableData.forEach(bonus => {
    fileContent += "  {\n";
    fileContent += `    brandImage: ${bonus.brandImage ? `require('${REACT_PATH}/${bonus.brandImage}')` : "null"},\n`;
    fileContent += `    brand: '${bonus.brand.replace(/'/g, "\\'")}',\n`;
    fileContent += `    likelyImage: ${bonus.likelyImage ? `require('${REACT_PATH}/${bonus.likelyImage}')` : "null"},\n`;
    fileContent += `    likely: '${bonus.likely.replace(/'/g, "\\'")}',\n`;
    fileContent += `    unlikelyImage: ${bonus.unlikelyImage ? `require('${REACT_PATH}/${bonus.unlikelyImage}')` : "null"},\n`;
    fileContent += `    unlikely: '${bonus.unlikely.replace(/'/g, "\\'")}',\n`;
    fileContent += "  },\n";
  });

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");
  console.log(`Fichier bonus.js généré avec ${tableData.length} bonus.`);

  await browser.close();
}

main().catch(console.error);
