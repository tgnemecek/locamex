import React from "react";
import Input from "/imports/components/Input/index";
import Icon from "/imports/components/Icon/index";

const FilterBar = ({ value, onChange }) => {
  onClear = () => {
    props.onChange({
      target: {
        value: "",
        name: props.name,
      },
    });
  };

  return (
    <div>
      <Input value={value} onChange={onChange} childrenSide="right">
        <button onClick={onClear}>
          <Icon icon="not" color="lightGrey" />
        </button>
      </Input>
    </div>
  );
};

export default FilterBar;
