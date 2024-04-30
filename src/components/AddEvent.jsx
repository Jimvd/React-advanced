import React, { useState } from "react";
import { Button, Box, Input, FormControl, FormLabel } from "@chakra-ui/react";

const AddEventForm = ({ closeModal, addEvent, users, categories }) => {
   const [newEvent, setNewEvent] = useState({
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      image: null,
      createdBy: "",
      categoryIds: [],
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      const newValue = name === "createdBy" ? parseInt(value) : value;
      setNewEvent({
         ...newEvent,
         [name]: newValue,
      });
   };

   const handleImageChange = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
         setNewEvent({
            ...newEvent,
            image: reader.result,
         });
      };

      if (file) {
         await reader.readAsDataURL(file);
      }
   };

   const handleCategoryChange = (e) => {
      const { value } = e.target;
      const newValue = parseInt(value);
      setNewEvent({
         ...newEvent,
         categoryIds: [newValue],
      });
   };

   const handleSubmit = async () => {
      try {
         await addEvent(newEvent);
         closeModal();
      } catch (error) {
         console.error("Error adding event:", error);
      }
   };

   return (
      <form>
         <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
               type="text"
               name="title"
               placeholder="Title"
               value={newEvent.title}
               onChange={handleInputChange}
               borderColor="blue.500"
            />
         </FormControl>
         <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
               type="text"
               name="description"
               placeholder="Description"
               value={newEvent.description}
               onChange={handleInputChange}
               borderColor="blue.500"
            />
         </FormControl>
         <FormControl>
            <FormLabel>Start Time</FormLabel>
            <Input
               type="datetime-local"
               placeholder="Start Time"
               value={newEvent.startTime}
               onChange={handleInputChange}
               name="startTime"
            />
         </FormControl>
         <FormControl>
            <FormLabel>End Time</FormLabel>
            <Input
               type="datetime-local"
               placeholder="End Time"
               value={newEvent.endTime}
               onChange={handleInputChange}
               name="endTime"
            />
         </FormControl>
         <FormControl>
            <FormLabel>Upload Image</FormLabel>
            <Input type="file" name="image" accept="image/*" onChange={handleImageChange} borderColor="blue.500" />
         </FormControl>
         <FormControl>
            <FormLabel>Select User</FormLabel>
            <select name="createdBy" value={newEvent.createdBy} onChange={handleInputChange}>
               <option value="">Select User</option>
               {users.map((user) => (
                  <option key={user.id} value={user.id}>
                     {user.name}
                  </option>
               ))}
            </select>
         </FormControl>
         <FormControl>
            <FormLabel>Select Category</FormLabel>
            <select name="categoryIds" value={newEvent.categoryIds[0]} onChange={handleCategoryChange}>
               <option value="">Select a category</option>
               {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                     {category.name}
                  </option>
               ))}
            </select>
         </FormControl>
         <Box my="4">
            <Button colorScheme="blue" mr="4" onClick={handleSubmit}>
               Save
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
         </Box>
      </form>
   );
};

export default AddEventForm;
