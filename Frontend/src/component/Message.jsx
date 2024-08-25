import { Avatar, Box, Flex, Text, Image, Skeleton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { selectconservationAtom } from '../Atoms/ConservationAtom';
import { useRecoilValue } from 'recoil';
import userAtom from '../Atoms/userAtom';
import { BsCheck2All } from 'react-icons/bs';

const Message = ({ ownMessage, message }) => {
    const selectedConservation = useRecoilValue(selectconservationAtom);
    const currentuser = useRecoilValue(userAtom);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    const handleImageLoad = () => setImgLoaded(true);
    const handleImageError = () => setImgError(true);

    return (
        <>
            {ownMessage ? (
                <Flex gap={2} alignSelf={"flex-end"}>
                    {message.text && (
                        <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
                            <Text color={"white"}>{message.text}</Text>
                            <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                                <BsCheck2All size={16} />
                            </Box> 
                        </Flex>
                    )}
                    {message.pimage && (
                        <Flex mt={5} w={"200px"}>
                            <Image 
                                src={message.pimage} 
                                alt="Message image"
                                borderRadius={4}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                hidden={!imgLoaded}
                            />
                            {!imgLoaded && !imgError && (
                                <Skeleton w={"200px"} h={"200px"} borderRadius={4} />
                            )}
                            {imgError && (
                                <Text color="red.500">Image failed to load</Text>
                            )}
                            <Box alignSelf={"flex-end"} ml={1} color={message.seen ? "blue.400" : ""} fontWeight={"bold"}>
                                <BsCheck2All size={16} />
                            </Box> 
                        </Flex>
                    )}
                    <Avatar src={currentuser.pimage} w={7} h={7} />
                </Flex>
            ) : (
                <Flex gap={2}>
                    <Avatar src={selectedConservation.pimage} w={7} h={7} />
                    {message.text && (
                        <Text maxW={"350px"} p={1} borderRadius={"md"} bg={"gray.400"} color={"black"}>
                            {message.text}
                        </Text>
                    )}
                    {message.pimage && (
                        <Flex mt={5} w={"200px"}>
                            <Image 
                                src={message.pimage} 
                                alt="Message image"
                                borderRadius={4}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                hidden={!imgLoaded}
                            />
                            {!imgLoaded && !imgError && (
                                <Skeleton w={"200px"} h={"200px"} borderRadius={4} />
                            )}
                            {imgError && (
                                <Text color="red.500">Image failed to load</Text>
                            )}
                        </Flex>
                    )}
                </Flex>
            )}
        </>
    );
};

export default Message;
