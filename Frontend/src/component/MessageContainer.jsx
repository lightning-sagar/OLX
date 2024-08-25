import { Avatar, Divider, Flex, useColorModeValue, Text, Image, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useshowtoast";
import { ConservationAtom, selectconservationAtom } from "../Atoms/ConservationAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../Atoms/userAtom";
import { useSocket } from "../../Context/SocketContext";
import messageSound from "../assets/sound/message.mp3"

function MessageContainer() {
  const showToast = useShowToast();
  const [loadingMessage, setLoadingMessage] = useState(true);
  const [selectconservation, setselectconservation] = useRecoilState(selectconservationAtom);
  const [message, setMessage] = useState([]);
  const currentuser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const [Conservations, setConservations] = useRecoilState(ConservationAtom);
  const messEndRef = useRef(null);

  useEffect(() => {
    socket.on("newMessage", (data) => {
      if (selectconservation._id === data.conservationId) {
        setMessage((prev) => [...prev, data]);
      }
      if(!document.hasFocus()){
        const sound =new Audio(messageSound);
        sound.play()
      }
      setConservations((prev) => {
        const updated = prev.map((conservation) => {
          if (conservation._id === data.conservationId) {
            return {
              ...conservation,
              lastMessage: {
                text: data.text,
                sender: data.sender,
              }
            };
          }
          return conservation;
        });
        return updated;
      });
    });
    return () => {
      socket.off("newMessage");
    };
  }, [socket, selectconservation, setConservations]);
  useEffect(() => {
    const lastMessageIsFromOtherUser = message.length > 0 && message[message.length - 1].sender._id !== currentuser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessageAsSeen", {
        conservationId: selectconservation._id,
        userId: currentuser._id
      });
    }
    socket.on("messageSeen", ({ conservationId }) => {
      if (conservationId === selectconservation._id) {
        setMessage((prev) => {
          const updated = prev.map((message) => {
            if (!message.seen) {
              return {
                ...message,
                seen: true
              };
            }
            return message;
          });
          return updated;
        });
      }
    });
  }, [socket, currentuser._id, message, selectconservation]);

  useEffect(() => {
    messEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  useEffect(() => {
    const getMessage = async () => {
      setMessage([]);
      try {
        if (selectconservation.mock) return;
        const res = await fetch(`/api/message/${selectconservation.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
        }
        setMessage(data);
      } catch (error) {
        showToast("Error", error, "error");
      } finally {
        setLoadingMessage(false);
      }
    };
    getMessage();
  }, [showToast, selectconservation.userId, selectconservation.mock]);

  return (
    <Flex flex={70} bg={useColorModeValue("gray.200", "gray.dark")} p={1} flexDirection={"column"} borderRadius={"md"}>
      <Flex w={"full"} gap={2} h={12} alignItems={"center"}>
        <Avatar src={selectconservation.pimage} size={"sm"} />
        <Text display={'flex'} alignItems={"center"}>
          {selectconservation.username} 
        </Text>
      </Flex>
      <Divider />
      <Flex flexDirection={"column"} p={2} gap={4} my={4} height={"400px"} overflowY={"auto"}>
        {loadingMessage && (
          [...Array(5)].map((_, i) => (
            <Flex key={i} gap={2} alignItems={"center"} alignSelf={i % 2 === 0 ? "flex-end" : "flex-start"} p={"1"} borderRadius={"md"}>
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir={"column"} gap={2}>
                <Skeleton h={"8"} w={"250px"} />
                <Skeleton h={"8"} w={"250px"} />
                <Skeleton h={"8"} w={"250px"} />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))
        )}
        {!loadingMessage && message.length > 0 && (
          message.map((msg, index) => (
            <Flex key={msg._id} direction={"column"} ref={index === message.length - 1 ? messEndRef : null}>
              <Message key={msg._id} message={msg} ownMessage={msg.sender === currentuser._id} />
            </Flex>
          ))
        )}
      </Flex>
      <MessageInput setMessage={setMessage} />
    </Flex>
  );
}

export default MessageContainer;