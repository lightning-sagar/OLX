import { Avatar, AvatarBadge, Box, Flex, Stack, Text, useColorModeValue, WrapItem } from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../Atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { selectconservationAtom } from "../Atoms/ConservationAtom";

function Conservation({ conservation, isOnline }) {
    const user = conservation.participants[0];
    const lastmess = conservation.lastMessage;
    const currentuser = useRecoilValue(userAtom);
    const [selectconservation, setselectconservation] = useRecoilState(selectconservationAtom);
    
    const bgColor = useColorModeValue("gray.100", "gray.800");
    const selectedBgColor = useColorModeValue("gray.200", "gray.800");
    
    return (
        <Flex 
            gap={4} 
            alignItems={"center"} 
            p={1}
            _hover={{
                cursor: "pointer", 
                bg: useColorModeValue("gray.200", "gray.800"),
                color: "white"
            }}
            borderRadius={"md"}
            onClick={() => setselectconservation({
                _id: conservation._id,
                userId: user._id,
                username: user.username,
                pimage: user.pimage,
                mock: conservation.mock
            })}
            bg={selectconservation?._id === conservation._id ? selectedBgColor : bgColor}
        >
            <WrapItem> 
                <Avatar 
                    size={{
                        base: "xs",
                        sm: "sm",
                        md: "md",
                    }} 
                    name="Dan" 
                    src={user.pimage}
                >
                    {isOnline ? <AvatarBadge boxSize="1em" bg="green.500" /> : null}
                </Avatar>
            </WrapItem>
            <Stack direction={"column"} fontSize={"sm"}>
                <Text fontWeight={"700"} display={"flex"} alignItems={"center"}>
                    {user.username} 
                </Text>
                <Text fontSize={"sm"} display={"flex"} alignItems={"center"} gap={1}>
                    {currentuser._id === lastmess.sender._id ? (
                        <Box color={lastmess.seen ? "blue.400" : ""}>
                            <BsCheck2All size={16}/> 
                        </Box>
                    ) : null}
                    {lastmess.text.length > 18 ? lastmess.text.slice(0, 18) + "..." : lastmess.text}
                </Text>
            </Stack>
        </Flex>
    );
}

export default Conservation;
