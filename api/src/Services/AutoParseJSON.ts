const autoParseJSON = (arr: Array<any>) => {
    let result: Array<any> = [];

    arr.forEach((obj: any) => {
        let parsedResult: any = {};
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value == "string" && value.indexOf('{') >= 0) {
            parsedResult[key] = JSON.parse(value);
          } else {
            parsedResult[key] = value;
          }
        }

        result.push(parsedResult);
    })

    return result;
}

export default autoParseJSON;