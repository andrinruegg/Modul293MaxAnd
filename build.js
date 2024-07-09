const { exec } = require("child_process");
const rimraf = require("rimraf");
const fs = require("fs");
const path = require("path");

// Pfade
const paths = {
  html: "./",
  css: "scss",
  dist: "dist",
};

// Verzeichnisse löschen und neu erstellen
rimraf.sync(paths.dist);
fs.mkdirSync(paths.dist);
fs.mkdirSync(paths.dist + "/" + paths.css);

// HTML-Dateien minimieren und kopieren
fs.readdir(paths.html, (err, files) => {
  if (err) {
    console.error(`Error reading source directory: ${err.message}`);
    return;
  }

  files
    .filter((file) => path.extname(file) === ".html")
    .forEach((file) => {
      const inputFilePath = path.join(paths.html, file);
      const outputFilePath = path.join(paths.dist, file);

      exec(
        `npx html-minifier-terser ${inputFilePath} -o ${outputFilePath} --collapse-whitespace --remove-comments --minify-css true --minify-js true`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`Error minifying HTML file ${file}: ${stderr}`);
            return;
          }
          console.log(`HTML file ${file} minified successfully.`);
        }
      );
    });
});

// CSS minimieren und kopieren
const inputCssFilePath = path.join(paths.css, "style.css");
const outputCssFilePath = path.join(paths.dist, "scss/style.css");

exec(
  `npx clean-css-cli -o ${outputCssFilePath} ${inputCssFilePath}`,
  (err, stdout, stderr) => {
    if (err) {
      console.error(`Error minifying CSS: ${stderr}`);
      return;
    }
    console.log("CSS minified successfully.");
  }
);

// Ressourcen kopieren (Schriftarten, Bilder, etc.)
exec(
  `npx copyfiles -up 1 "${paths.html}*.{ttf,jpg,png,svg}" ${paths.dist}`,
  (err, stdout, stderr) => {
    if (err) {
      console.error(`Error copying resources: ${stderr}`);
      return;
    }
    console.log("Resources copied successfully.");
  }
);
