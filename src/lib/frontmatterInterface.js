import TOML from "@iarna/toml";
import matter from "gray-matter";

export const FrontmatterTypes = {
  Text: "Text",
  ListOfText: "List of Text",
  MultilineText: "Multiline Text",
  Date: "Date",
  Bool: "Bool",
  Nest: "Nest",
};

export const updateFrontmatterConfig = (
  metainfoList,
  parentKeys,
  newChildMetainfo,
  level = 0
) => {
  if (!parentKeys) {
    if (!metainfoList) metainfoList = [];
    metainfoList.push(newChildMetainfo);
    return metainfoList;
  }
  if (level === parentKeys.length) {
    if (metainfoList) {
      const isFound = metainfoList.some((metainfo, i) => {
        if (metainfo.key === newChildMetainfo.key) {
          metainfoList[i] = newChildMetainfo;
          return true;
        }
        return false;
      });

      if (!isFound) {
        metainfoList.push(newChildMetainfo);
      }
    } else {
      metainfoList = [newChildMetainfo];
    }

    return metainfoList;
  }
  for (let i = 0; i < metainfoList.length; i++) {
    let metainfo = metainfoList[i];
    if (metainfo.key === parentKeys[level]) {
      const newChildMetainfoList = updateFrontmatterConfig(
        metainfo.default,
        parentKeys,
        newChildMetainfo,
        level + 1
      );
      metainfoList[i].default = newChildMetainfoList;
      return metainfoList;
    }
  }
};

export const removeFrontmatterConfig = (
  metainfoList,
  parentKeys,
  key,
  level = 0
) => {
  if (!parentKeys || level === parentKeys.length) {
    metainfoList.some((metainfo, i) => {
      if (metainfo.key === key) {
        metainfoList.splice(i, 1);
        return true;
      }
      return false;
    });

    return metainfoList;
  }
  for (let i = 0; i < metainfoList.length; i++) {
    let metainfo = metainfoList[i];
    if (metainfo.key === parentKeys[level]) {
      const newChildMetainfoList = removeFrontmatterConfig(
        metainfo.default,
        parentKeys,
        key,
        level + 1
      );
      metainfoList[i].default = newChildMetainfoList;
      return metainfoList;
    }
  }
};

export const reorderFrontmatterConfig = (
  metainfoList,
  result,
  parentKeys,
  level = 0
) => {
  if (!parentKeys || level === parentKeys.length) {
    const list = Array.from(metainfoList);
    const [removed] = list.splice(result.source.index, 1);
    list.splice(result.destination.index, 0, removed);

    metainfoList = list;
    return metainfoList;
  }
  for (let i = 0; i < metainfoList.length; i++) {
    let metainfo = metainfoList[i];
    if (metainfo.key === parentKeys[level]) {
      const newChildMetainfoList = reorderFrontmatterConfig(
        metainfo.default,
        result,
        parentKeys,
        level + 1
      );
      metainfoList[i].default = newChildMetainfoList;
      return metainfoList;
    }
  }
};

const detectType = (value) => {
  if (Array.isArray(value)) {
    //TODO assuming value is Array of "Text"
    return FrontmatterTypes.ListOfText;
  }
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return FrontmatterTypes.Date;
  }

  if (typeof value === "string") {
    if (value.includes("\n")) {
      return FrontmatterTypes.MultilineText;
    }
    return FrontmatterTypes.Text;
  }
  if (typeof value === "number") {
    return FrontmatterTypes.Text; //TODO
  }

  if (typeof value === "boolean") return FrontmatterTypes.Bool;

  if (Object.prototype.toString.call(value) === "[object Object]") {
    return FrontmatterTypes.Nest;
  }

  return FrontmatterTypes.Text;
};

export const generateFrontmatterTree = (siteConfig, frontmatter) => {
  let tree = {
    isRoot: true,
    children: [],
  };
  const crawl = (frontmatter, metainfoList, parentTree) => {
    const names = Object.keys(frontmatter);
    for (let i = 0; i < names.length; i++) {
      let node = {
        name: names[i],
        value: frontmatter[names[i]],
        key: undefined,
        type: undefined,
        children: undefined,
        isFound: false,
      };

      const searchByName = (metainfoList, name) => {
        for (let i = 0; i < metainfoList.length; i++) {
          const metainfo = metainfoList[i];
          if (metainfo.name === name) {
            node.isFound = true;
            node.key = metainfo.key;
            node.type = metainfo.type;
            node.parent = parentTree;
            if (node.type !== FrontmatterTypes.Nest) {
              parentTree.children.push(node);
              break;
            }

            //type is Nest
            //fill node.children
            node.children = [];
            const childMetainfoList = metainfo.children;
            const childFrontmatter = node.value;
            crawl(childFrontmatter, childMetainfoList, node);
            parentTree.children.push(node);
            break;
          }
        }
      };

      if (metainfoList !== undefined) {
        searchByName(metainfoList, names[i]);
      }

      if (node.isFound) {
        continue;
      }
      node.type = detectType(node.value);
      if (node.type !== FrontmatterTypes.Nest) {
        parentTree.children.push(node);
        continue;
      }
      node.children = [];
      const childMetainfoList = undefined;
      const childFrontmatter = node.value;
      crawl(childFrontmatter, childMetainfoList, node);

      parentTree.children.push(node);
    }
  };
  crawl(frontmatter, siteConfig.frontmatter, tree);

  return tree;
};

function toIsoString(date) {
  var tzo = -date.getTimezoneOffset(),
    dif = tzo >= 0 ? "+" : "-",
    pad = function (num) {
      return (num < 10 ? "0" : "") + num;
    };

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ":" +
    pad(Math.abs(tzo) % 60)
  );
}

export const fillFrontmatterJson = (metainfoList) => {
  const fill = (metainfoList) => {
    let frontmatter = {};
    for (let i = 0; i < metainfoList.length; i++) {
      let metainfo = metainfoList[i];
      if (metainfo.type !== FrontmatterTypes.Nest) {
        let value = metainfo.default;
        if (
          metainfo.type === FrontmatterTypes.Date &&
          metainfo.option?.useNow
        ) {
          value = toIsoString(new Date());
        }
        frontmatter[metainfo.name] = value;
        continue;
      }

      //Nest
      frontmatter[metainfo.name] = fill(metainfo.default);
    }
    return frontmatter;
  };

  const frontmatter = fill(metainfoList);

  return frontmatter;
};

export const updateFrontmatterJson = (
  frontmatter,
  value,
  name,
  parentNames,
  level = 0
) => {
  if (!parentNames || level === parentNames.length) {
    frontmatter[name] = value;
    return frontmatter;
  }
  const childFrontmatter = frontmatter[parentNames[level]];
  const newChildfrontmatter = updateFrontmatterJson(
    childFrontmatter,
    value,
    name,
    parentNames,
    level + 1
  );
  frontmatter[parentNames[level]] = newChildfrontmatter;
  return frontmatter;
};

const genMatterOption = (siteConfig) => {
  const option = {
    engines: {
      toml: {
        parse: TOML.parse,
        stringify: TOML.stringify,
      },
    },
    language: siteConfig.frontmatterLanguage,
    delimiters: siteConfig.frontmatterDelimiter,
  };
  return option;
};

export const genContent = (siteConfig, doc, frontmatter) => {
  let content = matter.stringify(doc, frontmatter, genMatterOption(siteConfig));
  if (doc[doc.length - 1] !== "\n")
    content = content.substring(0, content.length - 1);
  return content;
};

export const parseContent = (siteConfig, content) => {
  const { content: doc, data: frontmatter } = matter(
    content,
    genMatterOption(siteConfig)
  );

  return { doc, frontmatter };
};
