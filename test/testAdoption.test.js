const Adoption = artifacts.require("/home/anas/Desktop/pet-shop-tutorial/contracts/Adoptions.sol"); // Import the Adoption contract using artifacts.require
const { expect } = require("chai"); // Import Chai's expect assertion

contract("Adoption", (accounts) => {
    let adoption;
    let expectedPetId;
    let expectedAdopter;

    before(async () => {
        adoption = await Adoption.deployed(); // Deploy the Adoption contract and get the instance
        expectedPetId = 8; // ID of the pet to be used for testing
        expectedAdopter = accounts[0]; // Expected adopter address (in this case, the first account in the network)
    });

    describe("adopting a pet and retrieving account addresses", async () => {
        it("can fetch the address of an owner by pet id", async () => {
            await adoption.adopt(expectedPetId, { from: expectedAdopter }); // Adopt the pet using the expected adopter address
            const adopter = await adoption.adopters(expectedPetId); // Get the adopter address for the given pet ID
            expect(adopter).to.equal(expectedAdopter, "The owner of the adopted pet should be the first account.");
        });

        it("can fetch the collection of all pet owners' addresses", async () => {
            const adopters = await adoption.getAdopters(); // Get the array of adopters
            expect(adopters[expectedPetId]).to.equal(expectedAdopter, "The owner of the adopted pet should be in the collection.");
        });
    });
});
