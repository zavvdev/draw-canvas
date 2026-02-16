export const fileUtil = {
  download: (url, filename) => {
    Object.assign(document.createElement("a"), {
      href: url,
      download: filename,
    }).click();
  },
};
