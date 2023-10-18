pragma solidity ^0.5.0;

import "truffle/Assert.sol";  // Import Truffle's Assertion library
import "truffle/DeployedAddresses.sol";  // Import DeployedAddresses to get the deployed contract address
import "/home/anas/Desktop/pet-shop-tutorial/contracts/Adoptions.sol";  // Import the smart contract you want to test

contract TestAdoption {
    Adoption adoption = Adoption(DeployedAddresses.Adoption());  // Create an instance of the Adoption contract
    uint expectedPetId = 8;  // ID of the pet to be used for testing
    address expectedAdopter = address(this);  // Expected adopter address (in this case, the test contract's address)

    // Test the adoption functionality
    function testUserCanAdoptPet() public {
        uint returnedId = adoption.adopt(expectedPetId);  // Call the adopt function
        Assert.equal(returnedId, expectedPetId, "Adoption of the expected pet should match what is returned.");
    }

    // Test retrieving adopter address by pet ID
    function testGetAdopterAddressByPetId() public {
        address adopter = adoption.adopters(expectedPetId);  // Get the adopter address for the given pet ID
        Assert.equal(adopter, expectedAdopter, "Owner of the expected pet should be this contract");
    }

    // Test retrieving adopter address by pet ID from the array
    function testGetAdopterAddressByPetIdInArray() public {
        address[16] memory adopters = adoption.getAdopters();  // Get the adopters array
        Assert.equal(adopters[expectedPetId], expectedAdopter, "Owner of the expected pet should be this contract");
    }
}
