import React, { useState, useEffect, useContext } from 'react';
import { 
  Box,
  Heading,
  Input,
  Button,
  Flex,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContextProvider';
import { CountryCard } from '../components/CountryCard';
import { BASE_URL } from '../../config';

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 2000); 
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { user, authTokens } = useContext(AuthContext);
//  console.log(authTokens)
  useEffect(() => {
    if (user) {
      // Fetch search history from backend
      fetch(`${BASE_URL}/api/users/${user.id}/search-history`, {
        headers: {
          Authorization: `Bearer ${authTokens}`,
        },
      })
        .then((res) => res.json())
        .then((data) => setSearchHistory(data))
        .catch((err) => console.error('Error fetching search history:', err));
    }
  }, [authTokens, user]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true); 
      fetch(`${BASE_URL}/api/countries/${debouncedSearchTerm}`, {
        headers: {
          Authorization: `Bearer ${authTokens}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCountries(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching countries:', err);
          setIsLoading(false);
          toast({
            title: 'Error',
            description: 'Failed to retrieve countries. Please try again.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        });
    } else {
      setCountries([]);
    }
  }, [debouncedSearchTerm, authTokens]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);

    // Update search history in backend
    if (user) {
      fetch(`${BASE_URL}/api/users/${user.id}/search-history`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authTokens}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery: e.target.value }),
      }).catch((err) => console.error('Error updating search history:', err));
    }
  };

  const handleCountryClick = (countryId) => {
    navigate(`/countries/${countryId}`);
  };

  const handleFavoriteClick = async (countryId, isFavorite) => {
    try {
      await fetch(`${BASE_URL}/api/users/${user.id}/favorites`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authTokens}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ countryId }),
      });

      // Update favorites in frontend state (if needed)
    } catch (error) {
      console.error('Error updating favorites:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorites. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4} width={"50%"} margin={"auto"} >
      <Heading as="h1" size="xl" mb={4}>Countries of the World</Heading>
      <Flex mb={4}>
        <Input
          placeholder="Enter currency code"
          value={searchTerm}
          onChange={handleSearchChange}
          w="full"
          maxW="500px"
          mr={2}
        />
        <Button colorScheme="blue" onClick={() => navigate('/favorites')}>Favorites</Button> 
      </Flex>
      {isLoading ? (
        <Spinner size="xl" />
      ) : (
        <Flex flexWrap="wrap" gap={4} >
          {countries?.map((country) => (
            <CountryCard
              key={country._id}
              country={country}
              onClick={handleCountryClick}
              onFavoriteClick={handleFavoriteClick}
            />
          ))}
        </Flex>
      )}
      <Box mt={4}>
        <Text fontWeight="bold">Search History:</Text>
        <ul>
          {searchHistory?.map((historyItem, index) => (
            <li key={index}>{historyItem}</li>
          ))}
        </ul>
      </Box>
    </Box>
  );
}

export { HomePage };
