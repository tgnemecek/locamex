import React from "react";
import Input from "/imports/components/Input/index";
import Icon from "/imports/components/Icon/index";
import useDebounce from "/imports/hooks/useDebounce";

const QuerySearch = ({ onChange }) => {
  const [value, setValue] = React.useState("");
  const debouncedTerm = useDebounce(value);

  React.useEffect(() => {
    if (typeof onChange === "function") onChange(debouncedTerm);
  }, [debouncedTerm]);

  return (
    <div>
      <Input
        value={value}
        onChange={({ target: { value } }) => setValue(value)}
        childrenSide="right"
      >
        <button onClick={() => setValue("")}>
          <Icon icon="not" color="lightGrey" />
        </button>
      </Input>
    </div>
  );
};

export default QuerySearch;
