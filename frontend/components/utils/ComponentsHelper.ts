const objectsToArray = (object : object) =>  {
    let result = [];
  
    Object.values(object).forEach((value) => {
      if (typeof value === "string") {
        result = [...result, value] as never[];
      } else if (typeof value === "object" && !Array.isArray(value) && value !== null) {
        result = [...result, ...objectsToArray(value)];
      }
  
      return undefined;
    });
  
    return result;
  }


  const objectsToString = ( object : object) => {
    return objectsToArray(object).join(" ");
  }


export {objectsToString}
