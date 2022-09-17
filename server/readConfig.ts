import { RequestHandler } from "express";

export const readConfig: RequestHandler = (_, res) => {
  console.log("reading config");
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.cpSync(path.join(__dirname, "assets", ".agitcms"), CONFIG_DIR, {
        recursive: true,
      });
    }

    const config = JSON.parse(
      fs.readFileSync(CONFIG_FILE).toString()
    ) as IConfig;
    res.json({ config });
  } catch (err) {
    throw new Error("Failed to load config\n" + err);
  }
};
