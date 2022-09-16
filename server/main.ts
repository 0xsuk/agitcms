console.log("Hello world");
import { IConfig } from "@shared/types/config";

exports.a = (config: IConfig) => {
  console.log(config);
};
