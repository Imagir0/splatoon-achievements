const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/tableturf.html";

const OUTPUT_DIR = path.join(__dirname, "tableturf");
const OUTPUT_FILE = path.join(__dirname, "tableturf.js");
const REACT_PATH = "@/assets/images/tableturf";

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

  console.log("Activation de l’onglet Card List");
  await page.click("#cardlist-tab");
  await page.waitForSelector("#cardlist", { visible: true });
  await sleep(500);

  console.log("Ouverture du menu Columns…");
  const columnsButton =
    "#cardlist .fixed-table-toolbar .keep-open button.dropdown-toggle";
  await page.click(columnsButton);
  await sleep(300);

  console.log("Cochage de toutes les colonnes…");
  await page.evaluate(() => {
    document
      .querySelectorAll(
        "#cardlist .dropdown-item-marker input[type='checkbox']"
      )
      .forEach(cb => {
        if (!cb.checked) cb.click();
      });
  });

  await sleep(500);

  console.log("Récupération des données…");

  const cardlistData = await page.evaluate(() => {
    const table = document.querySelector("#minigamecardinfo-table");
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
          case "Number":
            obj.id = Number(text);
            break;

          case "Image":
            obj.image = img?.src || null;
            break;

          case "Name":
            obj.name = text;
            break;

          case "Rarity":
            obj.rarity = text;
            break;

          case "Special Cost":
            obj.specialCost = text;
            break;

          case "Square Number":
            obj.squareNumber = text;
            break;

          case "Season":
            obj.season = text;
            break;
            
          case "Square":
            const squareDiv = td.querySelector(".cardgame-grid");
            obj.square = squareDiv ? squareDiv.outerHTML : null;
            break;

        }
      });

      return obj;
    });
  });

  console.log(`Nombre de cartes récupérés : ${cardlistData.length}`);

  console.log("Génération du fichier cardlist.js…");

  for (const cl of cardlistData) {
    cl.image = await downloadImage(cl.image);

    if (cl.brand) cl.brand.image = await downloadImage(cl.brand.image);
    if (cl.ability) cl.ability.image = await downloadImage(cl.ability.image);
  }

  let fileContent = "module.exports = [\n";

  for (const h of cardlistData) {

    fileContent += "  {\n";
    fileContent += `    number: ${h.id},\n`;
    fileContent += `    image: ${h.image ? `require('${REACT_PATH}/${h.image}')` : "null"},\n`;
    fileContent += `    name: '${h.name.replace(/'/g, "\\'")}',\n`;
    fileContent += `    rarity: '${h.rarity}',\n`;
    fileContent += `    specialCost: '${h.specialCost}',\n`;
    fileContent += `    squareNumber: '${h.squareNumber}',\n`;
    fileContent += `    season: '${h.season}',\n`;
    fileContent += `    square: '${h.square.replace(/'/g, "\\'")}',\n`;
    fileContent += "  },\n";
  }

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");

  console.log("✔ cardlist.js généré avec succès.");
  await browser.close();
}

main().catch(console.error);
