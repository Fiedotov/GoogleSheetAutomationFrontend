import React from 'react';
import Select from 'react-select';

const FilterComboBox = ({ options, onChange, isMulti }) => {
  return (
    <Select
      options={options}
      onChange={onChange}
      isMulti={isMulti}
      className="dark-theme-select"
    />
  );
};

export default FilterComboBox;
