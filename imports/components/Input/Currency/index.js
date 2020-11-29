import React from "react";
import tools from "/imports/startup/tools/index";

const Currency = ({
  value,
  onChange,
  min,
  max,
  readOnly,
  placeholder,
  disabled,
  style,
}) => {
  const [displayValue, setDisplayValue] = React.useState(tools.round(value, 2));
  const [focusedValue, setFocusedValue] = React.useState(tools.round(value, 2));
  const [focused, setFocused] = React.useState(false);

  const handleChange = (e) => {
    const { value } = e.target;

    const result = prepareFocusedValue(value);
    setFocusedValue(result);

    onChange(Number(result.replace(",", ".")));
  };

  const prepareFocusedValue = (input) => {
    const withComma = input.toString().replace(/\./g, ",");
    const noSpecialChars = withComma.replace(/[^\,\d]/g, "");
    const comma = noSpecialChars.match(/,/);
    let result = noSpecialChars.replace(/,/g, "");

    if (comma) {
      const commaIndex = comma.index;
      result = [
        result.slice(0, commaIndex),
        ",",
        result.slice(commaIndex),
      ].join("");
    }
    if (result === ",") result = "0,";

    // Removes extra chars after 2 decimal
    result = result.replace(/(,\d{2})\d+/g, "$1");

    return result;
  };

  const onFocus = () => {
    setFocused(true);
    setFocusedValue(prepareFocusedValue(value));
  };

  const onBlur = () => {
    setFocused(false);
    format();
  };

  const format = () => {
    setDisplayValue(tools.format(value, "currency"));
  };

  React.useEffect(() => {
    format();
  }, [value]);

  return (
    <input
      value={focused ? focusedValue : displayValue}
      onChange={handleChange}
      min={min}
      max={max}
      onFocus={onFocus}
      onBlur={onBlur}
      readOnly={readOnly}
      placeholder={placeholder}
      disabled={disabled}
      style={style}
    />
  );
};

export default Currency;
