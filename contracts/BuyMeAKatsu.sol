// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

interface IJPYC {
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external;

    function transfer(address _to, uint256 _value) external;

    function balanceOf(address account) external view returns (uint256);

    function approve(address spender, uint256 amount) external;
}

contract BuyMeAKatsu {
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    Memo[] memos;

    address payable owner;

    address jpycAddress;
    // IJPYC jpyc = IJPYC(jpycAddress);
    IJPYC jpyc;

    constructor(address _jpycAddress) {
        owner = payable(msg.sender);
        jpycAddress = _jpycAddress;
        jpyc = IJPYC(jpycAddress);
        console.log("jpycAddress from contract", jpycAddress);
    }

    function getMemos() public view returns (Memo[] memory) {
        return memos;
    }

    function buyKatsu(
        string memory _name,
        string memory _message,
        uint256 _value
    ) public payable {
        jpyc.transferFrom(msg.sender, address(this), _value);

        memos.push(Memo(msg.sender, block.timestamp, _name, _message));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }

    function withdrawTips() public {
        require(owner == msg.sender, "You don't have a right to withdraw!");
        jpyc.transfer(owner, jpyc.balanceOf(address(this)));
    }
}
