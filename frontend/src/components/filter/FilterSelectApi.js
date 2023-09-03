import React from 'react';
import FilterBox from './FilterBox';
import SelectApiInput from '../input/SelectApiInput';

function FilterSelectApi({
  title,
  apiCode,
  value,
  searchFileds,
  onSelect = () => {},
  getOptionLabel = (option) => option.ten_nvt,
  FormAdd,
}) {

  return (
    <FilterBox title={title} dot={!!value}>
      <SelectApiInput
        title={title}
        apiCode={apiCode}
        getOptionLabel={getOptionLabel}
        searchFileds={searchFileds}
        value={value}
        selectedValue={value}
        onSelect={onSelect}
        FormAdd={FormAdd}
      />
    </FilterBox>
  );
}

export default FilterSelectApi;
