const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/collectibles.html";

const OUTPUT_DIR = path.join(__dirname, "banners");
const OUTPUT_FILE = path.join(__dirname, "banners.js");
const REACT_PATH = "@/assets/images/banners";

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

  console.log("Activation de l’onglet Accesoires");
  await page.click("#nameplate-tab");
  await page.waitForSelector("#nameplates-table", { visible: true });
  await sleep(500);

  console.log("Ouverture du menu Columns…");
  const columnsButton =
    "#nameplate .fixed-table-toolbar .keep-open button.dropdown-toggle";
  await page.click(columnsButton);
  await sleep(300);

  console.log("Cochage de toutes les colonnes…");
  await page.evaluate(() => {
    document
      .querySelectorAll(
        "#nameplate .dropdown-item-marker input[type='checkbox']"
      )
      .forEach(cb => {
        if (!cb.checked) cb.click();
      });
  });

  await sleep(500);

  console.log("Récupération des données…");

  const nameplatesData = await page.evaluate(() => {
    const table = document.querySelector("#nameplates-table");
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
            obj.id = Number(text);
            break;

            case 1:
            obj.image = img?.src || null;
            break;

            case 2:
            obj.textColor = text;
            break;

            case 3:
            obj.howToGet = text;
            break;

            case 4:
            obj.season = text;
            break;

            case 5:
            obj.fishScalePrice = text;
            break;

            case 6:
            obj.unlockLevel = text;
            break;
        }
        });

      return obj;
    });
  });

  console.log(`Nombre de bannières récupérés : ${nameplatesData.length}`);

  console.log("Téléchargement des images…");

  for (const np of nameplatesData) {
    np.image = await downloadImage(np.image);

    if (np.brand) np.brand.image = await downloadImage(np.brand.image);
    if (np.ability) np.ability.image = await downloadImage(np.ability.image);

  }

  console.log("Génération du fichier nameplates.js…");

  let fileContent = "module.exports = [\n";

  for (const np of nameplatesData) {

  const safeTextColor = np.textColor
  ? np.textColor
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";
  const safeUroko = np.fishScalePrice
  ? np.fishScalePrice
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";

    fileContent += "  {\n";
    fileContent += `    id: ${np.id},\n`;
    fileContent += `    image: ${np.image ? `require('${REACT_PATH}/${np.image}')` : "null"},\n`;
    fileContent += `    textColor: '${safeTextColor}',\n`;
    fileContent += `    howToGet: '${np.howToGet.replace(/'/g, "\\'")}',\n`;
    fileContent += `    season: '${np.season}',\n`;
    fileContent += `    fishScalePrice: '${safeUroko}',\n`;
    fileContent += `    unlockLevel: '${np.unlockLevel}',\n`;
    fileContent += "  },\n";
  }

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");

  console.log("✔ nameplates.js généré avec succès.");
  await browser.close();
}

main().catch(console.error);
