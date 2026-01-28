import fs from "fs";
import { google } from "googleapis";
import dotenv from "dotenv";
import { filePath } from "./server.js";
import XLSX from "xlsx";
import Permiso from "./models/permisosModel.js";

dotenv.config();

const SCOPES = ["https://www.googleapis.com/auth/drive"];
let time = new Date();
console.log(time);
time = time.toString().split(" ");
// console.log(time)
time = `${time[2]} ${time[1]} ${time[3]} ${time[4]}`;
const name = `DOM Permisos - ${time}.xlsx`;
const auth = new google.auth.GoogleAuth({
  // keyFile: KEYFILEPATH,
  credentials: JSON.parse(process.env.MY_GOOGLE_JSON_KEY),
  scopes: SCOPES,
});

// Esta funcion crea el archivo en el drive con la informacion del archivo creado en la API
const createAndUploadFile = async (auth) => {
  const driveService = google.drive({ version: "v3", auth });

  let fileMetaData = {
    name: name,
    parents: [process.env.FOLDER_KEY],
  };

  let media = {
    mimType: "application/vnd.google-apps.spreadsheet",
    body: fs.createReadStream(filePath),
  };

  let response = await driveService.files.create({
    resource: fileMetaData,
    media: media,
    fields: "id",
  });

  switch (response.status) {
    case 200:
      console.log("File Created id: ", response.data.id);
      break;
    default:
      console.error("Error creating file, " + response.error);
      break;
  }
};

// Esta funcion crea un archivo excel que contiene toda la informacion, relacionada a los permisos, almacenada en la base de datos
const createFile = async () => {
  const wb = XLSX.utils.book_new();
  Permiso.find((err, data) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(filePath)
      let temp = JSON.stringify(data);
      temp = JSON.parse(temp);
      const ws = XLSX.utils.json_to_sheet(temp);
      const down = filePath;
      XLSX.utils.book_append_sheet(wb, ws, "sheet1");
      XLSX.writeFile(wb, down);
      createAndUploadFile(auth).catch(console.error);
    }
  });
};

createFile();
