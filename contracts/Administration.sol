//SPDX-License-Identifier: MIT

pragma solidity ^0.8.16;

import "./HGSBoxOffice.sol";
import "./DateConverter.sol";
import "./ToString.sol";

error Administration__NotOwner();
error Administration__CallFailed();
error Administration__NotRecordedBoxOffice();
error Administration__AlreadyRecordedVehicle();
error Administration__NotRecordedVehicle();

contract Administration {
  using DateConverter for uint64;

  enum vehicleType {
    car,
    minibus,
    bus
  }

  struct vehicleStruct {
    uint64 HGSNumber;
    string name;
    string surname;
    vehicleType vehicleClass;
    uint64[] crossingHistories;
  }

  struct VehicleCrossingTime {
    DateConverter._DateTime date;
    address vehicle;
  }

  mapping(address => vehicleStruct) private registeredVehicles;
  address[] private registeredVehiclesAddress;
  mapping(address => bool) private vehicleExists;
  uint256 public numberOfVehicle = 0;

  address private immutable i_owner;
  address private immutable i_priceFeedAddress;
  address[] public hgsBoxOfficesAddress;
  mapping(address => HGSBoxOffice) hgsBoxOffices;
  mapping(address => bool) hgsBoxOfficesExists;
  uint256 public numberOfOffices = 0;

  mapping(string => VehicleCrossingTime[]) private dailyPass;

  constructor(address _priceFeedAddress) {
    i_owner = msg.sender;
    i_priceFeedAddress = _priceFeedAddress;
  }

  modifier onlyOwner() {
    if (msg.sender != i_owner) revert Administration__NotOwner();
    _;
  }

  modifier notRecordedBoxOffice() {
    if (!hgsBoxOfficesExists[msg.sender])
      revert Administration__NotRecordedBoxOffice();
    _;
  }

  modifier notRecordedBoxOffice2(address _hgsBoxOfficeAddress) {
    if (!hgsBoxOfficesExists[_hgsBoxOfficeAddress])
      revert Administration__NotRecordedBoxOffice();
    _;
  }

  modifier alreadyRecordedVehicle(address _owner) {
    if (vehicleExists[_owner]) revert Administration__AlreadyRecordedVehicle();
    _;
  }

  modifier notRecordedVehicle(address _sender) {
    if (!vehicleExists[_sender]) revert Administration__NotRecordedVehicle();
    _;
  }

  function crossing(address sender)
    public
    notRecordedBoxOffice
    notRecordedVehicle(sender)
  {
    VehicleCrossingTime memory vehicleCrossingTime;
    vehicleCrossingTime.date = uint64(block.timestamp).parseTimestamp();
    vehicleCrossingTime.vehicle = sender;
    string memory day = string.concat(
      Strings.toString(vehicleCrossingTime.date.year),
      ".",
      Strings.toString(vehicleCrossingTime.date.month),
      ".",
      Strings.toString(vehicleCrossingTime.date.day)
    );
    dailyPass[day].push(vehicleCrossingTime);
    registeredVehicles[sender].crossingHistories.push(uint64(block.timestamp));
  }

  function addVehicle(
    address _owner,
    uint64 _HGSNumber,
    string memory _name,
    string memory _surname,
    vehicleType _vehicleClass
  ) public onlyOwner alreadyRecordedVehicle(_owner) {
    registeredVehicles[_owner] = vehicleStruct(
      _HGSNumber,
      _name,
      _surname,
      _vehicleClass,
      new uint64[](0)
    );
    registeredVehiclesAddress.push(_owner);
    vehicleExists[_owner] = true;
    numberOfVehicle++;
  }

  function deleteVehicle(address _owner) public onlyOwner {
    delete registeredVehicles[_owner];
    numberOfVehicle--;
    vehicleExists[_owner] = false;
  }

  function createOffice(
    uint256 _CAR_FEE_USD,
    uint256 _MINIBUS_FEE_USD,
    uint256 _BUS_FEE_USD
  ) public onlyOwner {
    HGSBoxOffice _hgsBoxOffices = new HGSBoxOffice(
      this,
      i_priceFeedAddress,
      _CAR_FEE_USD,
      _MINIBUS_FEE_USD,
      _BUS_FEE_USD
    );
    address officeAddress = address(_hgsBoxOffices);
    hgsBoxOfficesAddress.push(officeAddress);
    hgsBoxOffices[officeAddress] = _hgsBoxOffices;
    hgsBoxOfficesExists[officeAddress] = true;
    numberOfOffices++;
  }

  function getOfficeAddress(uint256 ind) public view returns (address) {
    return hgsBoxOfficesAddress[ind];
  }

  function setFees(
    address _hgsBoxOfficeAddress,
    uint256 _CAR_FEE_USD,
    uint256 _MINIBUS_FEE_USD,
    uint256 _BUS_FEE_USD
  ) public onlyOwner notRecordedBoxOffice2(_hgsBoxOfficeAddress) {
    hgsBoxOffices[_hgsBoxOfficeAddress].setFees(
      _CAR_FEE_USD,
      _MINIBUS_FEE_USD,
      _BUS_FEE_USD
    );
  }

  function deleteOffice(address _hgsBoxOfficeAddress)
    public
    onlyOwner
    notRecordedBoxOffice2(_hgsBoxOfficeAddress)
  {
    hgsBoxOffices[_hgsBoxOfficeAddress].withdraw();
    delete hgsBoxOffices[_hgsBoxOfficeAddress];
    hgsBoxOfficesExists[_hgsBoxOfficeAddress] = false;
    numberOfOffices--;
  }

  function withdraw() public payable onlyOwner {
    address[] memory _hgsBoxOfficesAddress = hgsBoxOfficesAddress;
    for (uint256 i = 0; i < _hgsBoxOfficesAddress.length; i++) {
      if (hgsBoxOfficesExists[_hgsBoxOfficesAddress[i]])
        hgsBoxOffices[_hgsBoxOfficesAddress[i]].withdraw();
    }
    (bool successCall, ) = payable(msg.sender).call{
      value: address(this).balance
    }("");
    if (!successCall) revert Administration__CallFailed();
  }

  function totalBalanceOfOffices()
    public
    view
    onlyOwner
    returns (uint256 totalBalance)
  {
    address[] memory _hgsBoxOfficesAddress = hgsBoxOfficesAddress;
    uint256 total = 0;
    for (uint256 i = 0; i < _hgsBoxOfficesAddress.length; i++) {
      total += _hgsBoxOfficesAddress[i].balance;
    }
    return total;
  }

  function getVehicle(address _owner)
    public
    view
    returns (vehicleStruct memory)
  {
    return registeredVehicles[_owner];
  }

  function getVehicle() public view returns (vehicleStruct memory) {
    return registeredVehicles[msg.sender];
  }

  receive() external payable {}

  fallback() external payable {}
}
