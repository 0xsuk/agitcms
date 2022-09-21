import {
  autosaveOptions,
  frontmatterLanguageOptions,
} from "../utils/constants";

export interface IFrontmatterConfig {
  name: string;
  key: string;
  type: string;
  default: any;
  option?: any;
}

export interface pinnedDir {
  name: string;
  path: string;
  isDir: boolean;
}

export interface ISiteConfig {
  name: string;
  key: string;
  path: string;
  frontmatterLanguage: typeof frontmatterLanguageOptions[number];
  frontmatterDelimiter: string;
  media: {
    staticPath?: string;
    publicPath?: string;
  };
  pinnedDirs: pinnedDir[];
  frontmatter: IFrontmatterConfig[];
}

export interface IConfig {
  sites: ISiteConfig[];
  useTerminal: boolean;
  autosave: typeof autosaveOptions[number];
  version?: string;
}
