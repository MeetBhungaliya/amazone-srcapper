import { read, utils } from "xlsx";

async function readExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer) {
          const workbook = read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json(worksheet);
          resolve(jsonData);
        } else {
          reject(new Error("Failed to read the file content."));
        }
      } catch (error) {
        reject(
          new Error("Error while parsing the Excel file: " + error.message)
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading the file."));
    };

    reader.readAsArrayBuffer(file);
  });
}

export default readExcel;
