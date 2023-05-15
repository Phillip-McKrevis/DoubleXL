const { writeFile } = require("node:fs/promises");

const { v1: uuidv1 } = require("uuid");
const traverse = require("traverse");

const defaultMappingData = require("../src/data/dynamic_menu.json");

const mappings = traverse(defaultMappingData).map(function (x) {
  if (this.key === "id") {
    return uuidv1();
  }

  return x;
});

writeFile("./out.json", JSON.stringify(mappings, null, 2)).then(() =>
  console.log("DONE")
);
