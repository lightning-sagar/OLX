import React, { useEffect, useState } from 'react';
import { AiFillCaretUp, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai"; 
import { ChatIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Image, Text, Input, IconButton, useColorModeValue } from '@chakra-ui/react';

function Cart() {
    const [showIcons, setShowIcons] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [cartData, setCartData] = useState(null);
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const toggleIcons = () => {
        setShowIcons(!showIcons);
    };

    const toggleCart = () => {
        setShowCart(!showCart);
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
        console.log(productId,"pId")
        const deleteP = async () => {
            try {
                const res = await fetch(`/api/p/${productId}`, {
                    method: 'PUT',
                });
                const data = await res.json();
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
        deleteP();
    };

    const calculateTotalPrice = () => {
        return productDetails.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    };

    return (
        <Flex direction="column" align="center" position="fixed" bottom="10" left="10">
            {showIcons && (
                <Flex direction="column" mb={4}>
                    <Button size="lg" fontSize="2xl" mb={2} 
                        borderRadius="full"
                        leftIcon={<AiOutlineShoppingCart />}
                        bg={useColorModeValue('gray.300', 'gray.dark')}
                        onClick={toggleCart}
                    />
                    <Button size="lg" fontSize="2xl"
                        borderRadius="full"
                        leftIcon={<ChatIcon />}
                        bg={useColorModeValue('gray.300', 'gray.dark')}
                        onClick={() => console.log("Chat icon clicked")}
                    />
                </Flex>
            )}
            <Button size="lg" fontSize="2xl"
                borderRadius="full"
                leftIcon={<AiFillCaretUp />}
                bg={useColorModeValue('gray.300', 'gray.dark')}
                onClick={toggleIcons}
            />

            {showCart && productDetails.length > 0 && (
                <Box position="fixed" bottom="20" right="10" w="300px" p={4} bg={useColorModeValue('white', 'gray.700')} boxShadow="lg" borderRadius="md">
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
                    {loading ? <Spinner /> : productDetails.map((item, index) => (
                        <Box key={index} mb={4} p={2} border="1px" borderRadius="md" borderColor={useColorModeValue('gray.200', 'gray.600')}>
                            <Flex justify="space-between" align="center">
                                <Image src={item.pimage[0]} alt={item.pname} boxSize="50px" mb={2} />
                                <IconButton
                                    icon={<AiOutlineClose />}
                                    size="sm"
                                    onClick={() => handleDeleteProduct(item.product)}
                                    aria-label="Delete product"
                                    variant="ghost"
                                />
                            </Flex>
                            <Text fontWeight="bold">{item.pname}</Text>
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
                            <Text>Total: ${item.price * item.quantity}</Text>
                        </Box>
                    ))}
                    <Box mt={4} borderTop="1px solid" borderColor={useColorModeValue('gray.200', 'gray.600')} pt={2}>
                        <Text fontWeight="bold">Total Price: ${calculateTotalPrice()}</Text>
                    </Box>
                </Box>
            )}
            {!loading && !showCart && !productDetails.length > 0 && (
                <Box position="fixed" bottom="20" right="10" w="300px" p={4} bg={useColorModeValue('white', 'gray.700')} boxShadow="lg" borderRadius="md">
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
                <Text>No items in cart</Text>
                </Box>
            )}
        </Flex>
    );
}

export default Cart;
