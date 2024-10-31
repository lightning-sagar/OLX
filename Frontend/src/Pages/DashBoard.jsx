import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import userAtom from '../Atoms/userAtom';
import updateAtom from '../Atoms/updateAtom';
import { Flex, Box, Text, Image, Divider, Grid } from '@chakra-ui/react';
import Card from '../component/Card.jsx';

function DashBoard() {
    const user = useRecoilValue(userAtom);
    const update = useRecoilValue(updateAtom);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [isOwner, setIsOwner] = useState(false);

    useEffect(() => {
        const fetchProductsAndCart = async () => {
            try {
                // Fetch products
                const productsRes = await fetch(`/api/p/own/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const productsData = await productsRes.json();

                if (productsRes.ok && productsData) {
                    setProducts(productsData.products || []);
                    setIsOwner(productsData.isOwner || false);

                    if (productsData.isOwner) {
                        // Fetch cart if user is an owner
                        const cartRes = await fetch(`/api/cart/${user._id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            credentials: 'include',
                        });
                        const cartData = await cartRes.json();
                        if (cartRes.ok && cartData) {
                            setCart(cartData || []);
                        } else {
                            console.error('Failed to fetch cart:', cartData.message);
                        }
                    }
                } else {
                    console.error('Failed to fetch products:', productsData.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchProductsAndCart();
    }, [user._id, update]);

    return (
        <Flex direction="column" p={4}>
            <Box mb={8}>
                <Flex align="center" mb={4}>
                    {user.pimage && (
                        <Image
                            borderRadius="full"
                            boxSize="100px"
                            src={user.pimage}
                            alt={user.fname}
                            mr={4}
                        />
                    )}
                    <Box>
                        <Text fontSize="xl" fontWeight="bold">
                            {user.username}
                        </Text>
                        <Text>{user.city}, {user.country}</Text>
                        <Text>{user.email}</Text>
                    </Box>
                </Flex>
            </Box>

            <Divider />

            <Box mt={8}>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>
                    Your Products
                </Text>
                <Grid
                    templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                    gap={6}
                >
                    {products.length > 0 ? (
                        products.map((product) => (
                            <Card key={product._id} product={product} />
                        ))
                    ) : (
                        <Text>No products found.</Text>
                    )}
                </Grid>
            </Box>

            {isOwner && (
                <Box mt={8}>
                    <Text fontSize="2xl" fontWeight="bold" mb={4}>
                        Your Cart
                    </Text>
                    {cart.length > 0 ? (
                        <Grid
                            templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                            gap={6}
                        >
                            {cart.map((item) => (
                                <Card key={item._id} product={item} />
                            ))}
                        </Grid>
                    ) : (
                        <Text>Your cart is currently empty.</Text>
                    )}
                </Box>
            )}
        </Flex>
    );
}

export default DashBoard;
