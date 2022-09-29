export const isURL = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const mediaExtensions = ["jpg", "jpeg", "png"];

export const socketSizeLimit = 1000000; //1MB
