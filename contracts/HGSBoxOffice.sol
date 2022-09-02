// SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import "./PriceConverter.sol";
import "./Administration.sol";

error HGSBoxOffice__LessFee();
error HGSBoxOffice__CallFailed();
error HGSBoxOffice__NotRecorded();
error HGSBoxOffice__NotOwner();

contract HGSBoxOffice {
  using PriceConverter for uint256;

  address private immutable i_owner;

  AggregatorV3Interface private immutable s_priceFeed;
  Administration private immutable admin;

  uint256 public CAR_FEE_USD;
  uint256 public MINIBUS_FEE_USD;
  uint256 public BUS_FEE_USD;

  constructor(
    Administration _admin,
    address priceFeedAddress,
    uint256 _CAR_FEE_USD,
    uint256 _MINIBUS_FEE_USD,
    uint256 _BUS_FEE_USD
  ) {
    i_owner = msg.sender;
    s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    admin = _admin;

    CAR_FEE_USD = _CAR_FEE_USD;
    MINIBUS_FEE_USD = _MINIBUS_FEE_USD;
    BUS_FEE_USD = _BUS_FEE_USD;
  }

  modifier notRecorded() {
    if (admin.getVehicle(msg.sender).HGSNumber == 0)
      revert HGSBoxOffice__NotRecorded();
    _;
  }

  modifier lessFee(Administration.vehicleType vehicleClass, uint256 fee) {
    if (
      (vehicleClass == Administration.vehicleType.car && fee < CAR_FEE_USD) ||
      (vehicleClass == Administration.vehicleType.minibus &&
        fee < MINIBUS_FEE_USD) ||
      (vehicleClass == Administration.vehicleType.bus && fee < BUS_FEE_USD)
    ) {
      revert HGSBoxOffice__LessFee();
    }
    _;
  }

  modifier notOwner() {
    if (msg.sender != i_owner) revert HGSBoxOffice__NotOwner();
    _;
  }

  function setFees(
    uint256 _CAR_FEE_USD,
    uint256 _MINIBUS_FEE_USD,
    uint256 _BUS_FEE_USD
  ) public notOwner {
    CAR_FEE_USD = _CAR_FEE_USD;
    MINIBUS_FEE_USD = _MINIBUS_FEE_USD;
    BUS_FEE_USD = _BUS_FEE_USD;
  }

  function crossing()
    public
    payable
    notRecorded
    lessFee(
      admin.getVehicle(msg.sender).vehicleClass,
      msg.value.getConversionRate(s_priceFeed)
    )
  {
    admin.crossing(msg.sender);
  }

  function withdraw() public payable notOwner {
    (bool successCall, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");
    if (!successCall) revert HGSBoxOffice__CallFailed();
  }

  receive() external payable {
    crossing();
  }

  fallback() external payable {
    crossing();
  }

  function getVehicle()
    public
    view
    returns (Administration.vehicleStruct memory)
  {
    return admin.getVehicle(msg.sender);
  }
}
