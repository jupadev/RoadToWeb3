// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract ChainBattles is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Warrior {
        uint256 level;
        uint256 speed;
        uint256 strength;
        uint256 life;
    }

    mapping(uint256 => Warrior) public tokenStats;

    constructor() ERC721("Chain Battles", "CBTLS") {}

    // generateCharacter: to generate and update the SVG image of our NFT
    function generateCharacter(uint256 tokenId)
        public
        view
        returns (string memory)
    {
        Warrior memory tokenIdStats = getTokenStats(tokenId);
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="10%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Warrior",
            "</text>",
            '<text x="50%" y="30%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Levels: ",
            tokenIdStats.level.toString(),
            "</text>",
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Speed: ",
            tokenIdStats.speed.toString(),
            "</text>",
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Strength: ",
            tokenIdStats.strength.toString(),
            "</text>",
            '<text x="50%" y="60%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Life: ",
            tokenIdStats.life.toString(),
            "</text>",
            "</svg>"
        );
        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(svg)
                )
            );
    }

    // getLevels: to get the current level of an NFT
    function getTokenStats(uint256 tokenId)
        public
        view
        returns (Warrior memory)
    {
        Warrior memory stats = tokenStats[tokenId];
        return stats;
    }

    // getTokenURI: to get the TokenURI of an NFT
    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Chain Battles #',
            tokenId.toString(),
            '",',
            '"description": "Battles on chain",',
            '"image": "',
            generateCharacter(tokenId),
            '"',
            "}"
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    // mint: to mint - of course
    function mint() public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        Warrior memory newStats = Warrior(0, 0, 0, 0);
        tokenStats[newItemId] = newStats;
        _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    // train: to train an NFT and raise its level
    function train(uint256 tokenId) public {
        require(_exists(tokenId), "Please provide an exists tokenId");
        require(ownerOf(tokenId) == msg.sender, "You are not the token Owner");
        Warrior memory currentStats = tokenStats[tokenId];
        currentStats.level += 1;
        currentStats.speed += 1;
        currentStats.strength += 1;
        currentStats.life += 1;
        tokenStats[tokenId] = currentStats;
        _setTokenURI(tokenId, getTokenURI(tokenId));
    }
}
