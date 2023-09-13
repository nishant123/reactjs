import React from "react";
import store from "../redux/store/index";

// Returns {code: label} obj array for multi-select if array is provided. If code is provided, only matching object is returned.
const getMultiOptions = (arr, code) => {
  try {
    if (code) {
      arr = arr.filter((obj) => {
        return obj.Code === code;
      });
    }
    return arr.map((obj) => {
      return { value: obj.Code, label: obj.Label };
    });
  } catch (err) {
    console.log("getMultiOptions Failed", arr, code);
  }
};

const getMultiOptionsWithDependency = (methodOptions, selectedMethods) => {
  try {
    let subMethods = [];
    let newMethodOptions = [];

    for (let i = 0; i < selectedMethods.length; i++) {
      newMethodOptions = newMethodOptions.concat(
        methodOptions.filter((obj) => {
          return obj.Code === selectedMethods[i].value;
        })
      );
    }

    subMethods = newMethodOptions.reduce((total, obj) => {
      total = total.concat([...obj.SubMethodologies]);
      return total;
    }, []);

    return subMethods.map((obj) => {
      return { value: obj.Code, label: obj.Label };
    });
  } catch (err) {
    console.log(
      "getMultiOptionsWithDependency Failed",
      methodOptions,
      selectedMethods
    );
  }
};

const getSubMethodologyAttribute = (
  methodOptions,
  selectedMethods,
  selectedSubMethods,
  field
) => {
  try {
    if (selectedSubMethods) {
      let subMethods = [];
      let newMethodOptions = [];
      let results = [];

      for (let i = 0; i < selectedMethods.length; i++) {
        newMethodOptions = newMethodOptions.concat(
          methodOptions.filter((obj) => {
            return obj.Code === selectedMethods[i].value;
          })
        );
      }

      subMethods = newMethodOptions.reduce((total, obj) => {
        total = total.concat([...obj.SubMethodologies]);
        return total;
      }, []);

      for (let i = 0; i < selectedSubMethods.length; i++) {
        results = results.concat(
          subMethods.filter((obj) => {
            return obj.Code === selectedSubMethods[i].value;
          })
        );
      }

      results = results
        .map((obj) => {
          return obj[field];
        })
        .reduce((total, str) => {
          if (!total.includes(str)) {
            total = total.concat(str);
          }
          return total;
        }, []);

      return results.join(",");
    }
  } catch (err) {
    console.log(
      "getSubMethodologyAttribute Failed",
      methodOptions,
      selectedMethods,
      selectedSubMethods,
      field
    );
  }
};

const getSingleOptions = (arr) => {
  try {
    return arr.map((obj) => {
      return (
        <option key={obj.Code} value={obj.Code}>
          {obj.Label}
        </option>
      );
    });
  } catch (err) {
    console.log("getSingleOptions Failed", arr);
  }
};

const getLabel = (group, code) => {
  try {
    if (!group || !code) {
      // console.log("getLabel null or undefined", group, code);
      return null;
    }

    return store.getState().codeLabels[group].filter((obj) => {
      return obj.Code === code ? obj : null;
    })[0].Label;

    // if (group !== "CountryScopeOptions") {
    //   return store.getState().codeLabels[group][code];
    // } else {
    //   if (group === "CountryScopeOptions") {
    //     return store.getState().codeLabels[group][code]["countryName"];
    //   }
    // }
  } catch (err) {
    // return "UNKNOWNCODE";
    console.log("getLabel Failed", group, code);
  }
};

const multiToString = (arr) => {
  try {
    return arr
      .reduce((total, obj) => {
        return total.concat(obj.value);
      }, [])
      .join(",");
  } catch (err) {
    console.log("multiToString Failed", arr);
  }
};

const stringToMulti = (group, str) => {
  try {
    let result = [];
    str.split(",").forEach((option) => {
      result.push({ value: option, label: getLabel(group, option) });
    });
    return result;
  } catch (err) {
    console.log("stringToMulti Failed", group, str);
  }
};

// const getCodeLabel = (code, codeLabels) => {};

export {
  getMultiOptions,
  getMultiOptionsWithDependency,
  getSubMethodologyAttribute,
  getSingleOptions,
  getLabel,
  multiToString,
  stringToMulti,
};
