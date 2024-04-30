import React from "react";
import { Select } from "@chakra-ui/react";

const EventFilter = ({ categories, selectedCategory, setSelectedCategory }) => {
   return (
      <Select
         placeholder="Filter by category"
         value={selectedCategory}
         onChange={(e) => setSelectedCategory(e.target.value)}
         ml="4"
         w="50"
      >
         {categories.map((category) => (
            <option key={category.id} value={category.id}>
               {category.name}
            </option>
         ))}
      </Select>
   );
};

export default EventFilter;
