import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Conservation from '../component/Conservation';
import {GiConversation} from "react-icons/gi"
import MessageContainer from '../component/MessageContainer';
import useShowToast from '../hooks/useshowtoast.jsx';
import { useRecoilState, useRecoilValue } from 'recoil';
import {ConservationAtom, selectconservationAtom} from '../Atoms/ConservationAtom.js';
import userAtom from '../Atoms/userAtom.js';
import { useSocket } from '../../Context/SocketContext.jsx';

function Chatpage() {
  const [conservations, setConservations] = useRecoilState(ConservationAtom);
  const showToast = useShowToast();
  const [loadingConservation, setLoadingConservation] = useState(true);
  const [selectconservation, setselectconservation] = useRecoilState(selectconservationAtom);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [searching, setSearching] = useState("");
  const {socket,onlineUser} = useSocket();

  const currentuser = useRecoilValue(userAtom);

 useEffect(()=>{
    socket?.on("messageSeen",({conservationId})=>{
      setConservations((prev)=>{
        const updated = prev.map((conservation)=>{
          if(conservation._id === conservationId){
            return {
              ...conservation,
              lastMessage:{
                ...conservation.lastMessage,
                seen:true
              }
            }
          }
          return conservation
        })
        return updated
      })
    })
  },[socket,setConservations])

  useEffect(()=>{
    const getConservation = async()=>{
      try {
        const res = await fetch('/api/message/conservation');
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setConservations(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally{
        setLoadingConservation(false)
      }
    }
    
    getConservation();
  },[showToast,setConservations])

  const handleConservationSearch = async (e) => {
    e.preventDefault();
    if (!searching) return;
    setLoadingMessage(true);
    try {
      const res = await fetch(`/api/user/profile/${searching}`);
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      if (data._id === currentuser._id) {
        showToast("Error", "You can't send message to yourself", "error");
        return;
      }
      const existingConservation = conservations.find(c => c.participants[0]._id === data._id);
      if (existingConservation) {
        setselectconservation({
          _id: existingConservation._id,
          userId: data._id,
          name: data.username,
          pimage: data.pimage
        });
        return;
      }
      const MockConservation = {
        mock: true,
        lastMessage: {
          text: "",
          sender: ""
        },
        _id: 'mock-' + data._id, 
        participants: [{
          _id: data._id,
          username: data.username,
          pimage: data.pimage
        }]
      };
      setConservations((prevConservations) => [...prevConservations, MockConservation]);
    } catch (error) {
      showToast("Error", error.message, "error");  
    } finally {
      setLoadingMessage(false);
    }
  }
  

  return (
    <Box position={"absolute"} p={4} w={{ lg: "750px", base: "100%", md: "80%" }} left={"50%"} transform={"translateX(-50%)"}>
      <Flex gap={4} flexDirection={{ base: "column", md: "row" }} maxW={{ sm: "400px", md: "full" }} mx={"auto"}>
        <Flex flex={30} gap={2} flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
          <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>
            Your Conversation
          </Text>
          <form onSubmit={handleConservationSearch} >
            <Flex alignItems={"center"} gap={2}>
              <Input placeholder='search for a user' onChange={(e) => setSearching(e.target.value)} />
              <Button size={"sm"} onClick={handleConservationSearch} isLoading={loadingMessage}>
                <SearchIcon />
              </Button>
            </Flex>
          </form>
          {loadingConservation && (
            [0, 1, 2, 3, 4].map((_, i) => (
              <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
                <Box>
                  <SkeletonCircle size={10} />
                </Box>
                <Flex w={"full"} flexDirection={"column"} gap={3}>
                  <Skeleton h={"10px"} w={"80px"} />
                  <Skeleton h={"8px"} w={"90px"} />
                </Flex>
              </Flex>
            ))
          )}
          {!loadingConservation && (
            conservations.map((conservation) => (
              <Conservation key={conservation._id} isOnline={onlineUser.includes(conservation.participants[0]._id)} conservation={conservation} />
            ))
          )}
        </Flex>
        {!selectconservation._id &&(
          <Flex flex={70} p={2} flexDirection={"column"}  alignItems={"center"} justifyContent={"center"} height={"400px"}>
            <GiConversation size={100}   />
            <Text fontSize={20}> select any user to start a conversation</Text>
          </Flex>
        )}
        {selectconservation._id &&(
          <MessageContainer/>
        )}
      </Flex>
    </Box>
  );
}

export default Chatpage;
