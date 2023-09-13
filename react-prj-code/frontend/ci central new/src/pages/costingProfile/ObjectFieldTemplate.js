import React from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import _ from "lodash";
import { Tooltip } from "reactstrap";
import { useState } from "react";
import CreatableSelect from "react-select/creatable";

const ObjectFieldTemplate = (props) => {
  const [fieldTooltip, setFieldTooltip] = useState({});

  const codeLabels = useSelector(({ codeLabels }) => codeLabels);
  // const currentCountrySpec = useSelector(({ currentCountrySpec }) => currentCountrySpec)
  // const waveSpecs = useSelector(({ waveSpecs }) => waveSpecs)
  const onOptionLabelChange = (value, key, schema, onChangeHandler) => {
    if (value && Array.isArray(value))
      onChangeHandler(value.map((val) => val.value));
    else if (value) onChangeHandler(value.value);
  };

  const getSelectedOption = (options, optionalLabel) => {
    if (codeLabels && optionalLabel && codeLabels[optionalLabel] && options) {
      if (Array.isArray(options)) {
        let resultArray = []
        options.map(opt => {
          let final = _.head(codeLabels[optionalLabel].filter(cl => cl.Code == opt))
          if (final) {
            resultArray.push({
              value: final.Code, label: final.Label
            })
          } else {
            resultArray.push({
              value: opt, label: opt
            })
          }
        })
        return resultArray
      } else {
        let selectedVal = _.head(
          codeLabels[optionalLabel].filter((cl) => cl.Code == options)
        );
        if (selectedVal)
          return { value: selectedVal.Code, label: selectedVal.Label };
        else
          return { value: options, label: options };
      }
    } else if (!optionalLabel && options) {
      if (Array.isArray(options)) {
        return options.map((opt) => {
          return { value: opt, label: opt };
        });
      } else {
        return { value: options, label: options };
      }
    } else {
      return "";
    }
  };
  return (
    <>
      {props.properties.map((element, index) => {
        let currentProp = { ...element.content.props, idSchema: { $id: `${element.content.props.idPrefix}_${element.content.props.name}` } };
        let currentElement = { ...element.content, props: currentProp }
        let classname = currentProp.schema["classNames"]
          ? currentProp.schema["classNames"]
          : "col-lg-6 col-md-6 col-sm-12 col-xs-12 mb-0";

        if (
          props.schema.invalidProps &&
          props.schema.invalidProps.indexOf(currentProp.name) != -1
        ) {
          classname = `${classname} is-invalid`;
        }
        return (
          <>
            {classname.indexOf("break-before") != -1 ? <br></br> : null}

            {currentProp.schema.isNewSection ? <hr></hr> : null}

            {currentProp.schema.sectionTitle ? (
              <h5 className="mb-1">{currentProp.schema.sectionTitle}</h5>
            ) : null}
            {/* {(currentProp.schema.widgetType) ?
                            console.log(currentProp.schema.widgetType, currentProp.schema.title) : null}
                        {console.log(element.content)} */}
            {(currentProp.schema.widgetType == "multiselectdropdown" && currentProp.schema.isCreatable) ? (
              <div className={classname}>
                <label className="form-label" id={currentProp.idSchema.$id}>
                  {currentProp.schema.title}
                  {/* <span>*</span> */}
                </label>
                <CreatableSelect
                  className={`custom-select-box`}
                  isMulti={currentProp.schema.isMulti}
                  // id={currentProp.idSchema.$id}
                  options={
                    currentProp.schema.optionsLabel
                      ? codeLabels[currentProp.schema.optionsLabel]?.map(
                        (opt) => {
                          return {
                            value: opt.Code,
                            label: opt.Label,
                          };
                        }
                      )
                      : currentProp.schema.items
                        ? currentProp.schema.items.enum.map((e) => {
                          return {
                            value: e,
                            label: e,
                          };
                        })
                        : currentProp.schema.enum?.map((e) => {
                          return {
                            value: e,
                            label: e,
                          };
                        })
                  }
                  value={
                    currentProp.formData
                      ? getSelectedOption(currentProp.formData, currentProp.schema.optionsLabel)
                      : []
                  }
                  onChange={(select) =>
                    onOptionLabelChange(
                      select,
                      currentProp.name,
                      props.schema,
                      currentProp.onChange
                    )
                  }
                />
              </div>
            ) : currentProp.schema.widgetType == "multiselectdropdown" ? (
              <div className={classname}>
                <label className="form-label" id={currentProp.idSchema.$id}>
                  {currentProp.schema.title}
                  {/* <span>*</span> */}
                </label>
                <Select
                  className={`custom-select-box`}
                  isMulti={currentProp.schema.isMulti}
                  // id={currentProp.idSchema.$id}
                  options={
                    currentProp.schema.optionsLabel
                      ? codeLabels[currentProp.schema.optionsLabel]?.map(
                        (opt) => {
                          return {
                            value: opt.Code,
                            label: opt.Label,
                          };
                        }
                      )
                      : currentProp.schema.items
                        ? currentProp.schema.items.enum.map((e) => {
                          return {
                            value: e,
                            label: e,
                          };
                        })
                        : currentProp.schema.enum?.map((e) => {
                          return {
                            value: e,
                            label: e,
                          };
                        })
                  }
                  defaultValue={
                    // _.head(currentCountrySpec.MethodologySpecs.filter(
                    //     (item) =>
                    //         item.RFQSchema.title == props.schema.title
                    // ))?.RFQData
                    //     ? getSelectedOption(
                    //         _.head(currentCountrySpec.MethodologySpecs.filter(
                    //             (item) =>
                    //                 item.RFQSchema.title == props.schema.title
                    //         )).RFQData[currentProp.name],
                    //         currentProp.schema.optionsLabel
                    //     )
                    //     :
                    currentProp.formData
                      ? getSelectedOption(currentProp.formData, currentProp.schema.optionsLabel)
                      : []
                  }
                  onChange={(select) =>
                    onOptionLabelChange(
                      select,
                      currentProp.name,
                      props.schema,
                      currentProp.onChange
                    )
                  }
                />
              </div>
            ) : (
                  <div className={classname} key={index}>
                    {/* <input id={currentProp.name} onChange={currentProp.onChange} type={currentProp.schema.widgetType} className="form-control" /> */}
                    {currentElement}
                    {props.schema.invalidProps &&
                      props.schema.invalidProps.indexOf(currentProp.name) != -1 ? (
                        <p className="error small d-block">is a required field.</p>
                      ) : null}

                  </div>
                )}
            <Tooltip
              placement="top"
              isOpen={fieldTooltip[currentProp.idSchema.$id] && currentElement.props.schema.description}
              target={currentProp.idSchema.$id}
              toggle={() => setFieldTooltip({ ...fieldTooltip, [currentProp.idSchema.$id]: !fieldTooltip[currentProp.idSchema.$id] })}>
              {currentElement.props.schema.description}
            </Tooltip>
          </>
        );
      })}
    </>
  );
};

export default ObjectFieldTemplate;
