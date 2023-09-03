import React, { useState, useRef } from 'react';
import FilterBox from './FilterBox';
import { IconButton, TextField } from '@mui/material';
import { MdClose } from 'react-icons/md';
import { useEffect } from 'react';

function FilterSearch({ title, onSearch = () => {} }) {
  const [searchText, setSearchText] = useState('');
  const [search, setSearch] = useState('');
  const [dot, setDot] = useState(false);

  const timerRef = useRef();

  // handle search
  const handleSearch = (e) => {
    onSearch(search.trim());
    if (!search) {
      setDot(false);
    } else {
      setDot(true);
    }
  };
  // handle clear
  const handleClear = () => {
    // onSearch('');
    setSearchText('');
    setDot(false);
  };

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setSearch(searchText);
    }, 500);
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [searchText]);
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <FilterBox title={title} dot={dot}>
      <TextField
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        fullWidth
        sx={{
          '& .MuiInputBase-root': {
            height: '42px',
            paddingRight: '5px',
            '& input': {
              height: '100%',
            },
          },
          '& .MuiInputBase-input': { padding: '0 10px', fontSize: '13px' },
        }}
        variant="outlined"
        InputProps={{
          endAdornment: (
            <>
              {searchText && (
                <IconButton onClick={handleClear}>
                  <MdClose fontSize="14px" />
                </IconButton>
              )}
            </>
          ),
        }}
      />
    </FilterBox>
  );
}

export default FilterSearch;
