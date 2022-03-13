//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import { Base64 } from "./libraries/Base64.sol";


contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenId;
    address contractAddress;
   
    string public collectionName;
    string public collectionSymbol;

    uint256 private numberOfTokenOwned;

    struct nftItem {
        uint256 tokenId;
        address  owner;
        string tokenUri;
    }

    mapping(uint256 => nftItem) private idToNFT;

    string baseSvg = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>";

    string[] words = [
        'Fire ',
        'Air ',
        'Water ',
        'Earth ',
        'Light ',
        'Shadow ',
        'Thunder ',
        'Void ',
        'Time ',
        'Gravity ',
        'Plant ',
        'Electric '
    ];


    constructor(address marketplaceAddress) ERC721("NFT", "ENFT") {
        contractAddress = marketplaceAddress;
        collectionName = name();
        collectionSymbol = symbol();
    }

    function random(string memory _input) internal pure returns(uint256) {
        return uint256(keccak256(abi.encodePacked(_input)));
    }

    function nameNFT(uint256 tokenId) public view returns(string memory) {
        uint256 rand = random(string(abi.encodePacked("words", Strings.toString(tokenId))));
        rand = rand % words.length;
        return words[rand];
    }


    /// @notice Mints a new  NFT token
    /// @dev uses generates a final tokenURI by using the base64 encoded json data
    /// @return uint256 The tokenId of the minted NFT
    function createNFT() public returns(uint256) {
        uint256 newItemId = _tokenId.current();

        string memory name = string(abi.encodePacked(nameNFT(newItemId)));
        string memory finalSvg = string(abi.encodePacked(baseSvg, name, "</text></svg>"));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                    '{"name": "',
                        name,
                        '", "description": "Your NFT", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                    '"}'
                    )
                )
            )
        );

        string memory finalTokenURI = string(abi.encodePacked(
            "data:application/json;base64,", json
        ));

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenURI);
        setApprovalForAll(contractAddress, true);

        idToNFT[newItemId] = nftItem(newItemId, msg.sender, finalTokenURI);

        _tokenId.increment();

        return newItemId;
    }

    /// @notice Gets the tokenURI of the NFT owned by the caller
    /// @return nftItem[] The array containing the tokenId, owner and tokenURI of the NFT owned by the caller    
    function getMyNFT() public view returns(nftItem[] memory) {
        uint totalItemCount = _tokenId.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToNFT[i].owner == msg.sender) {
                itemCount += 1;
            }
        }

        nftItem[] memory items = new nftItem[](itemCount);

        for (uint i = 0; i < totalItemCount; i++) {
            if (idToNFT[i].owner == msg.sender) {
                uint currentId = i;
                nftItem storage currentItem = idToNFT[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }
}
