import React, { useEffect, useState } from "react";
import {
   Heading,
   Flex,
   Image,
   Card,
   CardBody,
   Text,
   Box,
   Button,
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalCloseButton,
   ModalBody,
   Input,
   Tag,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import AddEventForm from "../components/AddEvent";
import { CiSearch } from "react-icons/ci";
import EventFilter from "../components/EventFilter";

export const EventsPage = () => {
   const [eventData, setEventData] = useState([]);
   const [categories, setCategories] = useState([]);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
   const [users, setUsers] = useState([]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const [usersResponse, eventsResponse, categoriesResponse] = await Promise.all([
               fetch("http://localhost:3000/users"),
               fetch("http://localhost:3000/events"),
               fetch("http://localhost:3000/categories"),
            ]);

            const [userData, eventData, categoryData] = await Promise.all([
               usersResponse.json(),
               eventsResponse.json(),
               categoriesResponse.json(),
            ]);

            setUsers(userData);
            setEventData(eventData);
            setCategories(categoryData);
         } catch (error) {
            console.error("Error fetching data:", error);
         }
      };

      fetchData();
   }, []);

   const openModal = () => {
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
   };

   const addEvent = async (newEvent) => {
      try {
         const response = await fetch("http://localhost:3000/events", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(newEvent),
         });

         if (response.ok) {
            const eventDataResponse = await response.json();
            setEventData([...eventData, eventDataResponse]);
         } else {
            console.error("Failed to add event");
         }
      } catch (error) {
         console.error("Error adding event:", error);
      }
   };

   const filteredEvents = eventData.filter(
      (event) =>
         event.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
         (selectedCategory === "" ||
            (event.categoryIds && event.categoryIds.includes(parseInt(selectedCategory))) ||
            (!event.categoryIds && parseInt(selectedCategory) === 1))
   );

   const getCategoryNames = (categoryIds) => {
      if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
         return [];
      }
      return categoryIds.map((categoryId) => {
         const category = categories.find((cat) => cat.id === categoryId);
         return category ? category.name : "";
      });
   };

   return (
      <>
         <Heading ml="2">List of events</Heading>
         <Flex flexDirection="row" alignItems="center" p="2">
            <CiSearch style={{ fontSize: "24px", color: "black" }} />
            <Input
               placeholder="Search events"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               my="4"
               maxW="400"
               ml="4"
            />
            <EventFilter
               categories={categories}
               selectedCategory={selectedCategory}
               setSelectedCategory={setSelectedCategory}
            />
         </Flex>

         <Button onClick={openModal} ml="2" my="4">
            Add Event
         </Button>
         <Flex direction="row" flexWrap="wrap">
            {filteredEvents.map((event, index) => (
               <Box key={index} m={4} height="auto">
                  <Link to={`/event/${event.id}`}>
                     <Card maxW="sm" height="100%">
                        <CardBody>
                           <Box>
                              <Image
                                 src={event?.image}
                                 alt="Event Image"
                                 borderRadius="lg"
                                 objectFit="cover"
                                 boxSize="100%"
                              />
                              <Box mt="6">
                                 <Heading size="md">{event.title}</Heading>
                                 <Text>{event.description}</Text>
                                 <Text color="blue.600" fontSize="lg">
                                    Start: {formatDateTime(event.startTime)}
                                 </Text>
                                 <Text color="blue.600" fontSize="lg">
                                    End: {formatDateTime(event.endTime)}
                                 </Text>
                                 {event.categoryIds && event.categoryIds.length > 0 && (
                                    <Box>
                                       {getCategoryNames(event.categoryIds).map((categoryName, index) => (
                                          <Tag key={index} size="lg" colorScheme="gray" margin="4px 8px 4px 0">
                                             {categoryName}
                                          </Tag>
                                       ))}
                                    </Box>
                                 )}
                              </Box>
                           </Box>
                        </CardBody>
                     </Card>
                  </Link>
               </Box>
            ))}
         </Flex>

         <Modal isOpen={isModalOpen} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
               <ModalHeader>Add Event</ModalHeader>
               <ModalCloseButton />
               <ModalBody>
                  <AddEventForm closeModal={closeModal} addEvent={addEvent} users={users} categories={categories} />
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
