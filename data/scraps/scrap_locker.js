/*const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/collectibles.html";

const OUTPUT_DIR = path.join(__dirname, "figures");
const OUTPUT_FILE = path.join(__dirname, "figures.js");
const REACT_PATH = "@/assets/images/figures";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Télécharge une image depuis une URL absolue
 * et retourne uniquement le nom du fichier.
 *
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

  console.log("Activation de l’onglet Locker");
  await page.click("#zakka-tab");
  await page.waitForSelector("#zakka-figure-table", { visible: true }); // zakka-figure-table // zakka-mainpart-table // zakka-sticker-table // 
  await sleep(500);

  console.log("Ouverture du menu Columns…");
  const columnsButton =
    "#zakka .fixed-table-toolbar .keep-open button.dropdown-toggle";
  await page.click(columnsButton);
  await sleep(300);

  console.log("Cochage de toutes les colonnes…");
  await page.evaluate(() => {
    document
      .querySelectorAll(
        "#zakka .dropdown-item-marker input[type='checkbox']"
      )
      .forEach(cb => {
        if (!cb.checked) cb.click();
      });
  });

  await sleep(500);

  console.log("Récupération des données…");

  const objectsData = await page.evaluate(() => {
    const table = document.querySelector("#zakka-figure-table"); // zakka-figure-table // zakka-mainpart-table // zakka-sticker-table // 
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
            obj.name = text;
            break;

            case 3:
            obj.howToGet = text;
            break;

            case 4:
            obj.maxNumber = text;
            break;

            case 5:
            obj.price = Number(text);
            break;

            case 6:
            obj.rarity = text;
            break;

            case 7:
            obj.season = text;
            break;

            case 8:
            obj.fishScalePrice = text;
            break;

            case 9:
            obj.unlockLevel = text;
            break;
        }
        });

      return obj;
    });
  });

  console.log(`Nombre d'objets récupérés : ${objectsData.length}`);

  console.log("Téléchargement des images…");

  for (const np of objectsData) {
    np.image = await downloadImage(np.image);
  }

  console.log("Génération du fichier objects.js…");

  let fileContent = "module.exports = [\n";

  for (const o of objectsData) {

  const safeName = o.name
  ? o.name
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";

  const safeUroko = o.fishScalePrice
  ? o.fishScalePrice
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";

    fileContent += "  {\n";
    fileContent += `    id: ${o.id},\n`;
    fileContent += `    image: ${o.image ? `require('${REACT_PATH}/${o.image}')` : "null"},\n`;
    fileContent += `    name: '${safeName}',\n`;
    fileContent += `    howToGet: '${o.howToGet}',\n`;
    fileContent += `    maxNumber: '${o.maxNumber}',\n`;
    fileContent += `    price: '${o.price}',\n`;
    fileContent += `    rarity: '${o.rarity}',\n`;
    fileContent += `    season: '${o.season}',\n`;
    fileContent += `    fishScalePrice: '${safeUroko}',\n`;
    fileContent += `    unlockLevel: '${o.unlockLevel}',\n`;
    fileContent += "  },\n";
  }

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");

  console.log("✔ objects.js généré avec succès.");
  await browser.close();
}

main().catch(console.error);*/


/*const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/collectibles.html";

const OUTPUT_DIR = path.join(__dirname, "mainParts"); // figures // mainParts // Sticker
const OUTPUT_FILE = path.join(__dirname, "mainParts.js"); // figures // mainParts // Sticker
const REACT_PATH = "@/assets/images/mainParts"; // figures // mainParts // Sticker

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Télécharge une image depuis une URL absolue
 * et retourne uniquement le nom du fichier.
 *
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

  console.log("Activation de l’onglet Locker");
  await page.click("#zakka-tab");
  await page.waitForSelector("#zakka-mainpart-table", { visible: true }); // zakka-figure-table // zakka-mainpart-table // zakka-sticker-table // 
  await sleep(500);

  console.log("Ouverture du menu Columns…");
  const columnsButton =
    "#zakka .fixed-table-toolbar .keep-open button.dropdown-toggle";
  await page.click(columnsButton);
  await sleep(300);

  console.log("Cochage de toutes les colonnes…");
  await page.evaluate(() => {
    document
      .querySelectorAll(
        "#zakka .dropdown-item-marker input[type='checkbox']"
      )
      .forEach(cb => {
        if (!cb.checked) cb.click();
      });
  });

  await sleep(500);

  console.log("Récupération des données…");

  const objectsData = await page.evaluate(() => {
    const table = document.querySelector("#zakka-mainpart-table"); // zakka-figure-table // zakka-mainpart-table // zakka-sticker-table // 
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
            obj.name = text;
            break;

            case 3:
            obj.howToGet = text;
            break;

            case 4:
            obj.maxNumber = text;
            break;

            case 5:
            obj.price = Number(text);
            break;

            case 6:
            obj.rarity = text;
            break;

            case 7:
            obj.season = text;
            break;

            case 8:
            obj.fishScalePrice = text;
            break;

            case 9:
            obj.unlockLevel = text;
            break;
        }
        });

      return obj;
    });
  });

  console.log(`Nombre d'objets récupérés : ${objectsData.length}`);

  console.log("Téléchargement des images…");

  for (const np of objectsData) {
    np.image = await downloadImage(np.image);
  }

  console.log("Génération du fichier mainParts.js…");

  let fileContent = "module.exports = [\n";

  for (const o of objectsData) {

  const safeName = o.name
  ? o.name
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";

  const safeUroko = o.fishScalePrice
  ? o.fishScalePrice
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";

    fileContent += "  {\n";
    fileContent += `    id: ${o.id},\n`;
    fileContent += `    image: ${o.image ? `require('${REACT_PATH}/${o.image}')` : "null"},\n`;
    fileContent += `    name: '${safeName}',\n`;
    fileContent += `    howToGet: '${o.howToGet}',\n`;
    fileContent += `    maxNumber: '${o.maxNumber}',\n`;
    fileContent += `    price: '${o.price}',\n`;
    fileContent += `    rarity: '${o.rarity}',\n`;
    fileContent += `    season: '${o.season}',\n`;
    fileContent += `    fishScalePrice: '${safeUroko}',\n`;
    fileContent += `    unlockLevel: '${o.unlockLevel}',\n`;
    fileContent += "  },\n";
  }

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");

  console.log("✔ mainParts.js généré avec succès.");
  await browser.close();
}

main().catch(console.error);*/




const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const URL = "https://leanny.github.io/splat3/collectibles.html";

const OUTPUT_DIR = path.join(__dirname, "sticker"); // figures // mainParts // Sticker
const OUTPUT_FILE = path.join(__dirname, "sticker.js"); // figures // mainParts // Sticker
const REACT_PATH = "@/assets/images/sticker"; // figures // mainParts // Sticker

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

  console.log("Activation de l’onglet Locker");
  await page.click("#zakka-tab");
  await page.waitForSelector("#zakka-sticker-table", { visible: true }); // zakka-figure-table // zakka-mainpart-table // zakka-sticker-table // 
  await sleep(500);

  console.log("Ouverture du menu Columns…");
  const columnsButton =
    "#zakka .fixed-table-toolbar .keep-open button.dropdown-toggle";
  await page.click(columnsButton);
  await sleep(300);

  console.log("Cochage de toutes les colonnes…");
  await page.evaluate(() => {
    document
      .querySelectorAll(
        "#zakka .dropdown-item-marker input[type='checkbox']"
      )
      .forEach(cb => {
        if (!cb.checked) cb.click();
      });
  });

  await sleep(500);

  console.log("Récupération des données…");

  const objectsData = await page.evaluate(() => {
    const table = document.querySelector("#zakka-sticker-table"); // zakka-figure-table // zakka-mainpart-table // zakka-sticker-table // 
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
            obj.name = text;
            break;

            case 3:
            obj.howToGet = text;
            break;

            case 4:
            obj.maxNumber = text;
            break;

            case 5:
            obj.price = Number(text);
            break;

            case 6:
            obj.rarity = text;
            break;

            case 7:
            obj.season = text;
            break;

            case 8:
            obj.fishScalePrice = text;
            break;

            case 9:
            obj.unlockLevel = text;
            break;
        }
        });

      return obj;
    });
  });

  console.log(`Nombre d'objets récupérés : ${objectsData.length}`);

  console.log("Téléchargement des images…");

  for (const np of objectsData) {
    np.image = await downloadImage(np.image);
  }

  console.log("Génération du fichier mainParts.js…");

  let fileContent = "module.exports = [\n";

  for (const o of objectsData) {

  const safeName = o.name
  ? o.name
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";

  const safeUroko = o.fishScalePrice
  ? o.fishScalePrice
      .replace(/\\/g, "\\\\")   // backslashes
      .replace(/'/g, "\\'")     // apostrophes
      .replace(/\r?\n/g, "\\n") // retours à la ligne
  : "";

    fileContent += "  {\n";
    fileContent += `    id: ${o.id},\n`;
    fileContent += `    image: ${o.image ? `require('${REACT_PATH}/${o.image}')` : "null"},\n`;
    fileContent += `    name: '${safeName}',\n`;
    fileContent += `    howToGet: '${o.howToGet}',\n`;
    fileContent += `    maxNumber: '${o.maxNumber}',\n`;
    fileContent += `    price: '${o.price}',\n`;
    fileContent += `    rarity: '${o.rarity}',\n`;
    fileContent += `    season: '${o.season}',\n`;
    fileContent += `    fishScalePrice: '${safeUroko}',\n`;
    fileContent += `    unlockLevel: '${o.unlockLevel}',\n`;
    fileContent += "  },\n";
  }

  fileContent += "];\n";

  fs.writeFileSync(OUTPUT_FILE, fileContent, "utf8");

  console.log("✔ mainParts.js généré avec succès.");
  await browser.close();
}

main().catch(console.error);

