export const imdbTvShowKeyFormatter = (object: any) => {
  let modifiedObject: any = {};
  for (let key in object) {
    modifiedObject[key.toLowerCase()] = object[key];
  }
  return modifiedObject;
};
