const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/coop.html";

const OUTPUT_DIR = path.join(__dirname, "salmonSkins");
const OUTPUT_FILE = path.join(__dirname, "salmonSkins.js");
const REACT_PATH = "@/assets/images/salmonSkins";

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

  console.log("Activation de l’onglet Skins");
  await page.click("#coop-skins-tab");
  await page.waitForSelector("#coop-skins", { visible: true });
  await sleep(500);

  console.log("Ouverture du menu Columns…");
  const columnsButton =
    "#coop-skins .fixed-table-toolbar .keep-open button.dropdown-toggle";
  await page.click(columnsButton);
  await sleep(300);

  console.log("Cochage de toutes les colonnes…");
  await page.evaluate(() => {
    document
      .querySelectorAll(
        "#coop-skins .dropdown-item-marker input[type='checkbox']"
      )
      .forEach(cb => {
        if (!cb.checked) cb.click();
      });
  });

  await sleep(500);

  console.log("Récupération des données…");

  const salmonSkinsData = await page.evaluate(() => {
    const table = document.querySelector("#coop-skins-table");
    if (!table) return [];

    const headers = Array.from(table.querySelectorAll("thead th")).map(th =>
      th.innerText.trim()
    );

    return Array.from(table.querySelectorAll("tbody tr")).map(tr => {
      const cells = Array.from(tr.querySelectorAll("td"));
      const obj = {};

      cells.forEach((td, i) => {
        const header = headers[i];
        const img = td.querySelector("img");
        const text = td.innerText.trim();

        switch (header) {
          case "ID":
            obj.id = Number(text);
            break;

          case "Image":
            obj.image = img?.src || null;
            break;

          case "Name":
            obj.name = text;
            break;

          case "Season":
            obj.season = text;
            break;

          case "Fish Scale Price":
            obj.fishScalePrice = text;
            break;

          case "Fish Scale Unlock Level":
            obj.unlockLevel = text;
            break;
        }
      });

      return obj;
    });
  });

  console.log(`Nombre de skins récupérés : ${salmonSkinsData.length}`);

  console.log("Téléchargement des images…");

  for (const ss of salmonSkinsData) {
    ss.image = await downloadImage(ss.image);

    if (ss.brand) ss.brand.image = await downloadImage(ss.brand.image);
    if (ss.ability) ss.ability.image = await downloadImage(ss.ability.image);

  }

  console.log("Génération du fichier salmonSkins.js…");

  let fileContent = "module.exports = [\n";

  for (const ss of salmonSkinsData) {

  const safeUroko = ss.fishScalePrice
  ? ss.fishScalePrice
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";

    fileContent += "  {\n";
    fileContent += `    id: ${ss.id},\n`;
    fileContent += `    image: ${ss.image ? `require('${REACT_PATH}/${ss.image}')` : "null"},\n`;
    fileContent += `    name: '${ss.name.replace(/'/g, "\\'")}',\n`;
    fileContent += `    season: '${ss.season}',\n`;
    fileContent += `    fishScalePrice: '${safeUroko}',\n`;
    fileContent += `    unlockLevel : '${ss.unlockLevel}',\n`;
    fileContent += "  },\n";
  }

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");

  console.log("✔ salmonSkins.js généré avec succès.");
  await browser.close();
}

main().catch(console.error);
