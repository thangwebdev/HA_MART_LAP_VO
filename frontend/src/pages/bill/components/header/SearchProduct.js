import React, { useState, useRef, useEffect } from 'react';
import { useBillContext } from '../../Bill';
import TextInput from '~/components/input/TextInput';

function SearchProduct() {
  const { setSearch } = useBillContext();
  const [searchText, setSearchText] = useState('');
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setSearch(searchText);
    }, 500);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);
  return (
    <TextInput
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder="Tìm mã hoặc tên hàng"
      textFieldSx={{
        '& .MuiInputBase-root': {
          height: '38px',
          '& input': {
            height: '100%',
          },
        },
      }}
    />
  );
}

export default SearchProduct;
