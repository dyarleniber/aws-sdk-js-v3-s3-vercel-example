import fs from "fs";
import formidable from "formidable";
import { putObject } from "../../lib/s3";

const parseFormData = (req) => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm({
      multiples: true,
      keepExtensions: true,
    });
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
      }
      resolve({ fields, files });
    });
  });
};

async function handler(req, res) {
  if (req.method === "POST") {
    const { files } = await parseFormData(req);

    const image = files.image;

    const key = image.name;
    const body = fs.readFileSync(image.path);
    const contentType = image.type;

    const results = await putObject(key, body, contentType);
    return res.status(200).json(results);
  }

  return res.status(405).end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
