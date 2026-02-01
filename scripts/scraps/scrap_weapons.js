const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/database.html";

const OUTPUT_DIR = path.join(__dirname, "weapons");
const OUTPUT_FILE = path.join(__dirname, "weapons.js");
const REACT_PATH = "@/assets/images/weapons";

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

  console.log("Activation de l’onglet Weapons…");
  await page.click("#weapons");
  await page.waitForSelector("#weapon-table", { visible: true });
  await sleep(500);

  console.log("Ouverture du menu Columns…");
  const columnsButton =
    "#weapons .fixed-table-toolbar .keep-open button.dropdown-toggle";
  await page.click(columnsButton);
  await sleep(300);

  console.log("Cochage de toutes les colonnes…");
  await page.evaluate(() => {
    document
      .querySelectorAll(
        "#weapons .dropdown-item-marker input[type='checkbox']"
      )
      .forEach(cb => {
        if (!cb.checked) cb.click();
      });
  });

  await sleep(500);

  console.log("Récupération des données…");

  const weaponsData = await page.evaluate(() => {
    const table = document.querySelector("#weapon-table");
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

          case "Internal Name":
            obj.internalName = text;
            break;

          case "Name":
            obj.name = text;
            break;

          case "Sub":
            obj.sub = text
              ? { name: text, image: img?.src || null }
              : null;
            break;

          case "Special":
            obj.special = text
              ? { name: text, image: img?.src || null }
              : null;
            break;

          case "Reward Lvl 2":
            obj.rewardLvl2 = img?.src || null;
            break;

          case "Reward Lvl 3":
            obj.rewardLvl3 = img?.src || null;
            break;

          case "Matchmaking Range":
            obj.matchmakingRange = text;
            break;

          case "Season":
            obj.season = text;
            break;

          case "Unlock Level":
            obj.unlockLevel = text;
            break;

          case "Special Points":
            obj.specialPoints = text;
            break;

          case "Parameters":
            obj.parameters = text;
            break;
        }
      });

      return obj;
    });
  });

  console.log(`Nombre d’armes récupérées : ${weaponsData.length}`);

  console.log("Téléchargement des images…");

  for (const w of weaponsData) {
    w.image = await downloadImage(w.image);

    if (w.sub) w.sub.image = await downloadImage(w.sub.image);
    if (w.special) w.special.image = await downloadImage(w.special.image);

    w.rewardLvl2 = await downloadImage(w.rewardLvl2);
    w.rewardLvl3 = await downloadImage(w.rewardLvl3);
  }

  console.log("Génération du fichier weapons.js…");

  let fileContent = "module.exports = [\n";

  for (const w of weaponsData) {

  const safeParameters = w.parameters
  ? w.parameters
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";

    fileContent += "  {\n";
    fileContent += `    id: ${w.id},\n`;
    fileContent += `    image: ${w.image ? `require('${REACT_PATH}/${w.image}')` : "null"},\n`;
    fileContent += `    internalName: '${w.internalName}',\n`;
    fileContent += `    name: '${w.name.replace(/'/g, "\\'")}',\n`;

    fileContent += "    sub: ";
    if (w.sub) {
      fileContent += `{\n      name: '${w.sub.name.replace(/'/g, "\\'")}',\n`;
      fileContent += `      image: ${w.sub.image ? `require('${REACT_PATH}/${w.sub.image}')` : "null"},\n    },\n`;
    } else {
      fileContent += "null,\n";
    }

    fileContent += "    special: ";
    if (w.special) {
      fileContent += `{\n      name: '${w.special.name.replace(/'/g, "\\'")}',\n`;
      fileContent += `      image: ${w.special.image ? `require('${REACT_PATH}/${w.special.image}')` : "null"},\n    },\n`;
    } else {
      fileContent += "null,\n";
    }

    fileContent += `    rewardLvl2: ${w.rewardLvl2 ? `require('${REACT_PATH}/${w.rewardLvl2}')` : "null"},\n`;
    fileContent += `    rewardLvl3: ${w.rewardLvl3 ? `require('${REACT_PATH}/${w.rewardLvl3}')` : "null"},\n`;
    fileContent += `    matchmakingRange: '${w.matchmakingRange}',\n`;
    fileContent += `    season: '${w.season}',\n`;
    fileContent += `    unlockLevel: '${w.unlockLevel}',\n`;
    fileContent += `    specialPoints: '${w.specialPoints}',\n`;
    fileContent += `    parameters: '${safeParameters}',\n`;
    fileContent += "  },\n";
  }

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");

  console.log("✔ weapons.js généré avec succès.");
  await browser.close();
}

main().catch(console.error);
