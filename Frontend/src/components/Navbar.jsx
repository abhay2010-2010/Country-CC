import { Button, Flex, Link as ChakraLink, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextProvider';

const Navbar = () => {
  const { authTokens,user, logout } = useContext(AuthContext);

  return (
    <Flex
      as="nav"
      bg="grey"
      p={4}
      justifyContent="center"
      alignItems="center"
      gap={20}
      boxShadow="md"
    >
      <ChakraLink as={Link} to="/" color="white" fontWeight="bold" _hover={{ textDecoration: 'none', color: 'blue.200' }}>
        Home
      </ChakraLink>
     
      <ChakraLink as={Link} to="/register" color="white" fontWeight="bold" _hover={{ textDecoration: 'none', color: 'blue.200' }}>
        Register
      </ChakraLink>
      
      <ChakraLink as={Link} to="/favorites" color="white" fontWeight="bold" _hover={{ textDecoration: 'none', color: 'blue.200' }}>
        Favorites
      </ChakraLink>
      {authTokens ? (
        <>
          <Text fontWeight={"medium "}color={"black"}>{`Hello ${user.name} `}</Text>
          <Button onClick={() => logout()} colorScheme="red">
            Logout
          </Button>
        </>
      ) : (
        <ChakraLink as={Link} to="/login" color="white" fontWeight="bold" _hover={{ textDecoration: 'none', color: 'blue.200' }}>
          Login
        </ChakraLink>
      )}
    </Flex>
  );
};

export { Navbar };
