'use client';

import { useState } from 'react';
import { Input } from '@heroui/react';
import { IoIosSearch } from 'react-icons/io';
import { Company } from '@/types/company';

interface SearchFormProps {
  companies: Company[];
  onSearch: (filteredCompanies: Company[]) => void;
}

export const SearchForm = ({ companies, onSearch }: SearchFormProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    const filtered = query
      ? companies.filter((company) =>
          company.name.toLowerCase().includes(query.toLowerCase())
        )
      : companies;

    onSearch(filtered);
  };

  return (
    <div className="mb-8">
      <Input
        placeholder="企業名を入力してください"
        value={searchQuery}
        onValueChange={handleSearch}
        isClearable={true}
        onClear={() => handleSearch('')}
        startContent={<IoIosSearch />}
        size="md"
        classNames={{
          base: 'max-w-md',
          inputWrapper: 'shadow-sm',
        }}
      />
    </div>
  );
};
