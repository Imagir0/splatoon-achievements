const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/misc.html";
const OUTPUT_FILE = path.join(__dirname, "colors.js");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {

  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  console.log("Chargement de la page...");
  await page.goto(URL, { waitUntil: "networkidle0" });

  // === Onglet Colors ===
  console.log("Activation de l'onglet Colors...");
  await page.click("#colors-tab");
  await sleep(500);

  // === Récupération du tableau ===
  console.log("Récupération des données du tableau...");
  let tableData = await page.evaluate(() => {
    const table = document.querySelector('#color-table');
    if (!table) return [];

    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
    const rows = Array.from(table.querySelectorAll('tbody tr'));

    return rows.map(tr => {
      const cells = Array.from(tr.querySelectorAll('td'));
      const obj = {};

      cells.forEach((td, index) => {
        const header = headers[index];
        const text = td.innerText.trim();
        
        if (header === "Name") {
          obj.name = text;
          return;
        }

        if (header === "Alpha") {
          obj.alpha = text.match(/#[0-9a-fA-F]{8}/)?.[0] || null;
          return;
        }

        if (header === "Bravo") {
          obj.bravo = text.match(/#[0-9a-fA-F]{8}/)?.[0] || null;
          return;
        }

        if (header === "Charlie") {
          obj.charlie = text.match(/#[0-9a-fA-F]{8}/)?.[0] || null;
          return;
        }

        if (header === "Neutral") {
          obj.neutral = text.match(/#[0-9a-fA-F]{8}/)?.[0] || null;
          return;
        }
      });

      return obj;
    });
  });

  console.log(`Nombre de couleurs récupérées : ${tableData.length}`);

  // Générer colors.js au format React / Expo
  let fileContent = "module.exports = [\n";

  tableData.forEach(color => {
    fileContent += "  {\n";
    fileContent += `    name: '${color.name}',\n`;
    fileContent += `    alpha: '${color.alpha}',\n`;
    fileContent += `    bravo: '${color.bravo}',\n`;
    fileContent += `    charlie: '${color.charlie}',\n`;
    fileContent += `    neutral: '${color.neutral}',\n`;
    fileContent += "  },\n";
  });

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");
  console.log(`Fichier color.js généré au format React/Expo avec ${tableData.length} colors.`);

  await browser.close();
}

main().catch(console.error);
