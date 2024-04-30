import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
   Heading,
   Text,
   Image,
   Box,
   Tag,
   Button,
   Modal,
   ModalOverlay,
   ModalContent,
   ModalBody,
   useToast,
} from "@chakra-ui/react";
import EditEventForm from "../components/EditEvent";

export const EventPage = () => {
   const { eventId } = useParams();
   const [eventData, setEventData] = useState([]);
   const [eventDetails, setEventDetails] = useState({});
   const [categories, setCategories] = useState([]);
   const [createdByUser, setCreatedByUser] = useState({});
   const [, setEditMode] = useState(false);
   const [isOpen, setIsOpen] = useState(false);
   const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false); // Added state for delete confirmation
   const toast = useToast();

   useEffect(() => {
      const fetchEventDetails = async () => {
         try {
            const response = await fetch(`http://localhost:3000/events/${eventId}`);
            if (!response.ok) {
               throw new Error("Failed to fetch event data");
            }
            const eventData = await response.json();
            setEventDetails(eventData);
         } catch (error) {
            console.error("Error fetching event data:", error);
         }
      };

      const fetchCategoriesAndUser = async () => {
         try {
            const [categoryResponse, userResponse] = await Promise.all([
               fetch("http://localhost:3000/categories"),
               fetch(`http://localhost:3000/users/${eventDetails.createdBy}`),
            ]);

            const [categoryData, userData] = await Promise.all([categoryResponse.json(), userResponse.json()]);

            setCategories(categoryData);
            setCreatedByUser(userData);
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };

      fetchEventDetails();
      fetchCategoriesAndUser();
   }, [eventId, eventDetails.createdBy]);

   const getCategoryNames = (categoryIds) => {
      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
         return [];
      }
      return categoryIds.map((categoryId) => {
         const category = categories.find((cat) => cat.id === categoryId);
         return category ? category.name : "";
      });
   };

   const handleEdit = () => {
      setEditMode(true);
      setIsOpen(true);
   };

   const handleDelete = () => {
      setIsDeleteConfirmationOpen(true);
   };

   const confirmDelete = async () => {
      try {
         const response = await fetch(`http://localhost:3000/events/${eventId}`, {
            method: "DELETE",
         });

         if (response.ok) {
            setEventData(eventData.filter((event) => event.id !== eventId));
            window.location.href = "/";
         } else {
            console.error("Failed to delete event");
         }
      } catch (error) {
         console.error("Error deleting event:", error);
      }
   };

   const handleSubmit = async (formData) => {
      try {
         const categoryIdsAsNumbers = formData.categoryIds.map((id) => parseInt(id));

         const formDataWithNumberCategoryIds = {
            ...formData,
            categoryIds: categoryIdsAsNumbers,
         };

         const response = await fetch(`http://localhost:3000/events/${eventId}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formDataWithNumberCategoryIds),
         });

         if (!response.ok) {
            throw new Error("Failed to update event data");
         }

         setEventDetails(formDataWithNumberCategoryIds);
         setEditMode(false);
         setIsOpen(false);
         toast({
            title: "Event updated",
            status: "success",
            duration: 5000,
            isClosable: true,
         });
      } catch (error) {
         console.error("Error updating event data:", error);
         toast({
            title: "Failed to update event",
            status: "error",
            duration: 5000,
            isClosable: true,
         });
      }
   };

   const handleCancelEdit = () => {
      setEditMode(false);
      setIsOpen(false);
   };

   return (
      <>
         {eventDetails && (
            <>
               <Box display="flex" maxW="1000px" mx="auto" flexDirection="column">
                  <Box flex="1">
                     {eventDetails.image && (
                        <Image
                           src={eventDetails.image}
                           alt={eventDetails.title}
                           height="auto"
                           width="100%"
                           objectFit="cover"
                        />
                     )}
                  </Box>
                  <Box mt={4} boxShadow="md" p={6}>
                     <Heading size="lg" mb={4}>
                        {eventDetails.title}
                     </Heading>{" "}
                     <Text mb={4}>{eventDetails.description}</Text>
                     <Text mb={2}>Start: {formatDateTime(eventDetails.startTime)}</Text>
                     <Text mb={4}>End: {formatDateTime(eventDetails.endTime)}</Text>
                     {eventDetails.categoryIds && eventDetails.categoryIds.length > 0 && (
                        <Box mb={4}>
                           {getCategoryNames(eventDetails.categoryIds).map((categoryName, index) => (
                              <Tag key={index} size="md" colorScheme="teal" mr={2} mb={2}>
                                 {categoryName}
                              </Tag>
                           ))}
                        </Box>
                     )}
                     <Box display="flex" justifyContent="space-between" alignItems="center">
                        {createdByUser && Object.keys(createdByUser).length > 0 && (
                           <Box alignItems="center" display="flex">
                              <Image
                                 src={createdByUser.image}
                                 alt={createdByUser.name}
                                 width={10}
                                 height={10}
                                 borderRadius="full"
                                 mr={2}
                              />
                              <Text>{createdByUser.name}</Text>
                           </Box>
                        )}
                        <Box display="flex">
                           <Button onClick={handleEdit} colorScheme="teal" mr={2}>
                              Edit
                           </Button>
                           <Button onClick={() => handleDelete(eventDetails.id)} colorScheme="red">
                              Delete
                           </Button>
                        </Box>
                     </Box>
                  </Box>
                  <Button onClick={() => (window.location.href = "/")} colorScheme="blue">
                     Back to all events
                  </Button>
               </Box>
            </>
         )}

         <Modal isOpen={isDeleteConfirmationOpen} onClose={() => setIsDeleteConfirmationOpen(false)}>
            <ModalOverlay />
            <ModalContent>
               <ModalBody>
                  <Text>Are you sure you want to delete this event?</Text>
                  <Button
                     my="4"
                     mr="4"
                     colorScheme="red"
                     onClick={() => {
                        confirmDelete();
                        setIsDeleteConfirmationOpen(false);
                     }}
                  >
                     Delete
                  </Button>
                  <Button onClick={() => setIsDeleteConfirmationOpen(false)}>Cancel</Button>
               </ModalBody>
            </ModalContent>
         </Modal>

         <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <ModalOverlay />
            <ModalContent>
               <ModalBody>
                  <EditEventForm
                     eventDetails={eventDetails}
                     categories={categories}
                     onSubmit={handleSubmit}
                     onCancel={handleCancelEdit}
                  />
               </ModalBody>
            </ModalContent>
         </Modal>
      </>
   );
};

function formatDateTime(dateTimeString) {
   const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZone: "Europe/Amsterdam",
   };

   const dateTime = new Date(dateTimeString);
   const formattedDateTime = dateTime.toLocaleString("en-US", options);
   return formattedDateTime;
}
