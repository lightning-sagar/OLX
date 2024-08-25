import { AiFillCaretUp, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai"; 
import { ChatIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Image, Text, Input, IconButton, Spinner, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ChatPage from '../Pages/ChatPage';

function Cart() {
    const [showIcons, setShowIcons] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [cartData, setCartData] = useState(null);
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const getCartItem = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/p/cart');
                const data = await res.json();
                setCartData(data);
            } catch (error) {
                console.error("Failed to fetch cart items:", error);
            }
            setLoading(false);
        };
        getCartItem();
    }, []);

    useEffect(() => {
        const getProductDetails = async () => {
            if (cartData) {
                setLoading(true);
                try {
                    const details = await Promise.all(
                        cartData.items.map(async (item) => {
                            const res = await fetch(`/api/p/product/${item.product}`);
                            const productData = await res.json();
                            return { ...item, ...productData };
                        })
                    );
                    setProductDetails(details);
                } catch (error) {
                    console.log("Failed to fetch product details:", error);
                }
                setLoading(false);
            }
        };
        getProductDetails();
    }, [cartData]);

    const toggleIcons = () => setShowIcons(prev => !prev);

    const toggleCart = () => {
        setShowCart(prev => !prev);
        if (showChat) {
            setShowChat(false);
        }
    };

    const toggleChat = () => {
        setShowChat(prev => !prev);
        if (showCart) {
            setShowCart(false);
        }
    };

    const handleQuantityChange = (productId, quantity) => {
        const updatedDetails = productDetails.map((item) => {
            if (item.product === productId) {
                return { ...item, quantity: Number(quantity) };
            }
            return item;
        });
        setProductDetails(updatedDetails);
    };

    const handleDeleteProduct = (productId) => {
        const updatedDetails = productDetails.filter((item) => item.product !== productId);
        setProductDetails(updatedDetails);

        const deleteP = async () => {
            try {
                await fetch(`/api/p/${productId}`, { method: 'PUT' });
            } catch (error) {
                console.log(error);
            }
        };
        deleteP();
    };

    const calculateTotalPrice = () => productDetails.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <Flex direction="column" align="center" position="fixed" bottom="10" left="10" zIndex={1000}>
            {showIcons && (
                <Flex direction="column" mb={4}>
                    <Button 
                        size="lg" 
                        fontSize="2xl" 
                        mb={2}
                        borderRadius="full"
                        leftIcon={<AiOutlineShoppingCart />}
                        bg={useColorModeValue('gray.300', 'gray.600')}
                        onClick={toggleCart}
                        _hover={{ bg: useColorModeValue('gray.400', 'gray.500') }}
                    />
                    <Button 
                        size="lg" 
                        fontSize="2xl"
                        borderRadius="full"
                        leftIcon={<ChatIcon />}
                        bg={useColorModeValue('gray.300', 'gray.600')}
                        onClick={toggleChat}
                        _hover={{ bg: useColorModeValue('gray.400', 'gray.500') }}
                    />
                </Flex>
            )}
            <Button 
                size="lg" 
                fontSize="2xl"
                borderRadius="full"
                leftIcon={<AiFillCaretUp />}
                bg={useColorModeValue('gray.300', 'gray.600')}
                onClick={toggleIcons}
                _hover={{ bg: useColorModeValue('gray.400', 'gray.500') }}
            />

            {showCart && (
                <Box 
                    position="fixed" 
                    bottom={{ base: "16", md: "20" }} 
                    right={{ base: "4", md: "10" }} 
                    maxW={{ base: "90%", md: "300px" }} 
                    w="full" 
                    p={4} 
                    bg={useColorModeValue('white', 'gray.700')} 
                    boxShadow="lg" 
                    borderRadius="md"
                    overflowY="auto"
                    maxH="calc(100vh - 150px)"  
                >
                    <Flex justify="space-between" align="center" mb={4}>
                        <Text fontWeight="bold">Cart Details</Text>
                        <IconButton
                            icon={<AiOutlineClose />}
                            size="sm"
                            onClick={toggleCart}
                            aria-label="Close cart"
                            variant="ghost"
                        />
                    </Flex>
                    {loading ? (
                        <Spinner />
                    ) : productDetails.length > 0 ? (
                        productDetails.map((item, index) => (
                            <Box 
                                key={index} 
                                mb={4} 
                                p={3} 
                                border="1px" 
                                borderRadius="md" 
                                borderColor={useColorModeValue('gray.200', 'gray.600')}
                            >
                                <Flex justify="space-between" align="center">
                                    <Image src={item.pimage[0]} alt={item.pname} boxSize="50px" objectFit="cover" />
                                    <IconButton
                                        icon={<AiOutlineClose />}
                                        size="sm"
                                        onClick={() => handleDeleteProduct(item.product)}
                                        aria-label="Delete product"
                                        variant="ghost"
                                    />
                                </Flex>
                                <Text fontWeight="bold" mt={2}>{item.pname}</Text>
                                <Text>Price: ${item.pprice}</Text>
                                <Flex align="center" mt={2}>
                                    <Text>Quantity:</Text>
                                    <Input
                                        type="number"
                                        value={item.quantity}
                                        min="1"
                                        max={item.pstock}
                                        onChange={(e) => handleQuantityChange(item.product, e.target.value)}
                                        width="60px"
                                        ml={2}
                                    />
                                </Flex>
                                <Text mt={2}>Total: ${item.price * item.quantity}</Text>
                            </Box>
                        ))
                    ) : (
                        <Text>No items in cart</Text>
                    )}
                    <Box mt={4} borderTop="1px solid" borderColor={useColorModeValue('gray.200', 'gray.600')} pt={2}>
                        <Text fontWeight="bold">Total Price: ${calculateTotalPrice()}</Text>
                    </Box>
                </Box>
            )}

            {showChat && (
                <Box 
                    position="fixed" 
                    bottom={{ base: "16", md: "20" }} 
                    right={{ base: "4", md: "10" }} 
                    maxW={{ base: "90%", md: "400px" }} 
                    w="full" 
                    p={4} 
                    bg={useColorModeValue('white', 'gray.700')} 
                    boxShadow="lg" 
                    borderRadius="md"
                    overflowY="auto"
                    h="400px"  
                >
                    <Flex justify="space-between" align="center" mb={4}>
                        <Text fontWeight="bold">Chat</Text>
                        <IconButton
                            icon={<AiOutlineClose />}
                            size="sm"
                            onClick={toggleChat}
                            aria-label="Close chat"
                            variant="ghost"
                        />
                    </Flex>
                    <ChatPage />
                </Box>
            )}
        </Flex>
    );
}

export default Cart;
