import React, { useState } from "react";
import { Button, Box, Input, FormControl, FormLabel, Image, Select } from "@chakra-ui/react";

const EditEventForm = ({ eventDetails, categories, onSubmit, onCancel }) => {
   const [formData, setFormData] = useState({
      ...eventDetails,
      startTime: eventDetails.startTime || "",
      endTime: eventDetails.endTime || "",
      image: eventDetails.image || null,
      categoryIds: Array.isArray(eventDetails.categoryIds) ? eventDetails.categoryIds : [eventDetails.categoryIds],
   });

   const handleChange = (e) => {
      const { name, value } = e.target;
      const newValue = name === "categoryIds" ? [value] : value;
      setFormData((prevState) => ({
         ...prevState,
         [name]: newValue,
      }));
   };

   const handleImageChange = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
         setFormData({
            ...formData,
            image: reader.result,
         });
      };

      if (file) {
         await reader.readAsDataURL(file);
      }
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
   };

   return (
      <Box mt={4} maxW="lg">
         <form onSubmit={handleSubmit}>
            <FormControl>
               <FormLabel>Title</FormLabel>
               <Input type="text" name="title" value={formData.title} onChange={handleChange} />
            </FormControl>
            <FormControl>
               <FormLabel>Description</FormLabel>
               <Input type="text" name="description" value={formData.description} onChange={handleChange} />
            </FormControl>
            <FormControl>
               <FormLabel>Start Date & Time</FormLabel>
               <Input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} />
            </FormControl>
            <FormControl>
               <FormLabel>End Date & Time</FormLabel>
               <Input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} />
            </FormControl>
            <FormControl>
               <FormLabel>Category</FormLabel>
               <Select name="categoryIds" value={formData.categoryIds} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                     <option key={category.id} value={category.id}>
                        {category.name}
                     </option>
                  ))}
               </Select>
            </FormControl>
            <FormControl>
               <FormLabel>Image Upload</FormLabel>
               {formData.image && <Image src={formData.image} alt="Event Image" />}
               <Input type="file" name="image" accept="image/*" onChange={handleImageChange} />
            </FormControl>

            <Box my="4">
               <Button type="submit">Save</Button>
               <Button ml={2} onClick={onCancel}>
                  Cancel
               </Button>
            </Box>
         </form>
      </Box>
   );
};

export default EditEventForm;
