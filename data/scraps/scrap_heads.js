const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/database.html";

const OUTPUT_DIR = path.join(__dirname, "heads");
const OUTPUT_FILE = path.join(__dirname, "heads.js");
const REACT_PATH = "@/assets/images/heads";

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
  await page.click("#heads-tab");
  await page.waitForSelector("#heads-table", { visible: true });
  await sleep(500);

  console.log("Ouverture du menu Columns…");
  const columnsButton =
    "#heads .fixed-table-toolbar .keep-open button.dropdown-toggle";
  await page.click(columnsButton);
  await sleep(300);

  console.log("Cochage de toutes les colonnes…");
  await page.evaluate(() => {
    document
      .querySelectorAll(
        "#heads .dropdown-item-marker input[type='checkbox']"
      )
      .forEach(cb => {
        if (!cb.checked) cb.click();
      });
  });

  await sleep(500);

  console.log("Récupération des données…");

  const headsData = await page.evaluate(() => {
    const table = document.querySelector("#heads-table");
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
          case "Internal ID":
            obj.id = Number(text);
            break;

          case "Image":
            obj.image = img?.src || null;
            break;

          case "Name":
            obj.name = text;
            break;

          case "Brand":
            obj.brand = text
              ? { name: text, image: img?.src || null }
              : null;
            break;

          case "Main Ability":
            obj.ability = text
              ? { name: text, image: img?.src || null }
              : null;
            break;

          case "Price":
            obj.price = text;
            break;

          case "Rarity":
            obj.rarity = text;
            break;

          case "How To Get":
            obj.howToGet = text;
            break;

          case "Uroko Price":
            obj.uroko = text;
            break;

          case "Call Sign":
            obj.callSign = text;
            break;

          case "Call Sign Priority":
            obj.callSignPriority = text;
            break;

          case "Season":
            obj.season = text;
            break;
        }
      });

      return obj;
    });
  });

  console.log(`Nombre d’accessoires récupérés : ${headsData.length}`);

  console.log("Téléchargement des images…");

  for (const h of headsData) {
    h.image = await downloadImage(h.image);

    if (h.brand) h.brand.image = await downloadImage(h.brand.image);
    if (h.ability) h.ability.image = await downloadImage(h.ability.image);

  }

  console.log("Génération du fichier heads.js…");

  let fileContent = "module.exports = [\n";

  for (const h of headsData) {

  const safeUroko = h.uroko
  ? h.uroko
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";

    fileContent += "  {\n";
    fileContent += `    id: ${h.id},\n`;
    fileContent += `    image: ${h.image ? `require('${REACT_PATH}/${h.image}')` : "null"},\n`;
    fileContent += `    name: '${h.name.replace(/'/g, "\\'")}',\n`;

    fileContent += "    brand: ";
    if (h.brand) {
      fileContent += `{\n      name: '${h.brand.name.replace(/'/g, "\\'")}',\n`;
      fileContent += `      image: ${h.brand.image ? `require('${REACT_PATH}/${h.brand.image}')` : "null"},\n    },\n`;
    } else {
      fileContent += "null,\n";
    }

    fileContent += "    ability: ";
    if (h.ability) {
      fileContent += `{\n      name: '${h.ability.name.replace(/'/g, "\\'")}',\n`;
      fileContent += `      image: ${h.ability.image ? `require('${REACT_PATH}/${h.ability.image}')` : "null"},\n    },\n`;
    } else {
      fileContent += "null,\n";
    }
    fileContent += `    price: '${h.price}',\n`;
    fileContent += `    rarity: '${h.rarity}',\n`;
    fileContent += `    howToGet: '${h.howToGet.replace(/'/g, "\\'")}',\n`;
    fileContent += `    uroko: '${safeUroko}',\n`;
    fileContent += `    callSign: '${h.callSign.replace(/'/g, "\\'")}',\n`;
    fileContent += `    callSignPriority: '${h.callSignPriority}',\n`;
    fileContent += `    season: '${h.season}',\n`;
    fileContent += "  },\n";
  }

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");

  console.log("✔ heads.js généré avec succès.");
  await browser.close();
}

main().catch(console.error);
