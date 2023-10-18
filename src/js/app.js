App = {
  web3Provider: null,
  contracts: {},
  petsData: [],

  init: async function() {
    // Initialize web3
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error("User denied account access");
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    // Load the Adoption smart contract
    $.getJSON('Adoption.json', function(data) {
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      App.contracts.Adoption.setProvider(App.web3Provider);
      App.getPetsData();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  getPetsData: function() {
    $.getJSON('pets.json', function(data) {
      App.petsData = data;
      App.renderPets();
      App.markAdopted();
    });
  },

  renderPets: function() {
    var petsContainer = $('#petsRow');
    App.petsData.forEach(function(pet, index) {
      var petElement = $('#petTemplate').clone();
      petElement.find('.panel-title').text(pet.name);
      petElement.find('.pet-breed').text(pet.breed);
      petElement.find('.pet-age').text(pet.age);
      petElement.find('.pet-location').text(pet.location);
      petElement.find('.btn-adopt').attr('data-id', pet.id);
      petElement.find('.pet-image').attr('src', pet.picture); // Set the image source dynamically
      petElement.show();
      petsContainer.append(petElement);
    });
  },

  markAdopted: function() {
    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.getAdopters.call();
      }).then(function(adopters) {
        for (var i = 0; i < adopters.length; i++) {
          if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
            $('.panel-pet').eq(i).find('.btn-adopt').text('Success').attr('disabled', true);
          }
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        adoptionInstance = instance;
        return adoptionInstance.adopt(petId, { from: account });
      }).then(function(result) {
        return App.markAdopted();
      }).catch(function(err) {
        console.error(err.message);
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
