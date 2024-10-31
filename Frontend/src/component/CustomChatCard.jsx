import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Input, IconButton, Text, useColorModeValue } from '@chakra-ui/react';
import { AiOutlineClose } from "react-icons/ai";
import { SearchIcon } from '@chakra-ui/icons';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ConservationAtom, selectconservationAtom } from '../Atoms/ConservationAtom';
import userAtom from '../Atoms/userAtom';
import useShowToast from '../hooks/useshowtoast';
import Conservation from '../component/Conservation';
import MessageContainer from '../component/MessageContainer';
import { useSocket } from '../../Context/SocketContext';

function CustomChatCard({ onClose }) {
  const [conservations, setConservations] = useRecoilState(ConservationAtom);
  const [loadingConservation, setLoadingConservation] = useState(true);
  const [selectconservation, setselectconservation] = useRecoilState(selectconservationAtom);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [searching, setSearching] = useState("");
  const showToast = useShowToast();
  const { socket, onlineUser } = useSocket();
  const currentuser = useRecoilValue(userAtom);

  useEffect(() => {
    const getConservation = async () => {
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
      } finally {
        setLoadingConservation(false);
      }
    };
    getConservation();
  }, [showToast, setConservations]);

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
    <Box
      position="fixed"
      bottom="20"
      right="10"
      maxW="400px"
      w="full"
      p={4}
      bg={useColorModeValue('white', 'gray.700')}
      boxShadow="lg"  
      borderRadius="md"
      overflowY="auto"
      h="500px"
    >
      <Flex justify="space-between" top={"115px"} bg={useColorModeValue('#3dc0f9', 'gray.800')} w={"350px"} position="fixed" align="center" mb={4}>
        <Text fontWeight="bold">Chat</Text>
        <IconButton
          icon={<AiOutlineClose />}
          size="sm"
          onClick={onClose}
          aria-label="Close chat"
          variant="ghost"
          top="1"
          right="1"
        />
      </Flex>
      <Flex flexDirection={"column"} maxW={{ sm: "250px", md: "full" }} mx={"auto"}>
        <form onSubmit={handleConservationSearch} >
          <Flex alignItems={"center"} gap={2}>
            <Input placeholder='Search for a user' onChange={(e) => setSearching(e.target.value)} />
            <Button size={"sm"} onClick={handleConservationSearch} isLoading={loadingMessage}>
              <SearchIcon />
            </Button>
          </Flex>
        </form>
        {loadingConservation && <Text>Loading conversations...</Text>}
        {!loadingConservation && (
          conservations.map((conservation) => (
            <Conservation key={conservation._id} isOnline={onlineUser.includes(conservation.participants[0]._id)} conservation={conservation} />
          ))
        )}
      </Flex>
      {selectconservation._id && (
        <MessageContainer />
      )}
    </Box>
  );
}

export default CustomChatCard;
