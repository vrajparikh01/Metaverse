// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

// Contract address: 0xe1f67d7dE3616fE729621075fA0d279C84febb7a

import "@openzeppelin/contracts@4.4.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.4.2/access/Ownable.sol";
import "@openzeppelin/contracts@4.4.2/utils/Counters.sol";

contract Metaverse is ERC721, Ownable{
    constructor() ERC721 ("Metaverse", "META"){}

    // it will count the number of nfts
    using Counters for Counters.Counter;

    Counters.Counter private supply;

    uint public maxSupply = 100;

    uint public cost = 10 wei;

    struct Object{
        string name;
        uint h;
        uint w;
        uint d;
        uint x;
        uint y;
        uint z;
    }
    mapping(address=>Object[]) NFTOwners;

    // to track which and how many nfts are created
    Object[] public objects;

    function getObjects() public view returns(Object[] memory){
        return objects;
    }

    function getOwnerObjects() public view returns(Object[] memory){
        return NFTOwners[msg.sender];
    }

    function totalSupply() public view returns(uint){
        return supply.current();
    }

    function mint(string memory _name, uint _h, uint _w, uint _d, uint _x, uint _y, uint _z) public payable{
        require(supply.current()<=maxSupply, "Supply exceeds the max supply.");
        require(msg.value>=cost, "Not enough money to buy the NFT");
        supply.increment();
        _safeMint(msg.sender, supply.current());
        Object memory newObject = Object(_name, _h, _w, _d, _x, _y, _z);
        objects.push(newObject);
        NFTOwners[msg.sender].push(newObject);
    }

    // if I buy 5 NFTs then 5 ether will go the contract baalnce
    // After that the owner who has deployed the contract will withdraw this amount
    function withdraw() external payable onlyOwner{
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }
} 