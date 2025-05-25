// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract StockExchange {
    struct Stock {
        string symbol;
        string name;
        uint256 price;
        uint256 totalSupply;
        uint256 availableSupply;
        address owner;
        bool isActive;
    }

    struct Transaction {
        string stockSymbol;
        uint256 amount;
        uint256 price;
        address buyer;
        address seller;
        uint256 timestamp;
        bool isBuy;
    }

    // State variables
    mapping(string => Stock) public stocks;
    mapping(address => mapping(string => uint256)) public holdings; // address => symbol => amount
    mapping(address => uint256[]) public transactionIds; // address => array of transaction IDs
    mapping(uint256 => Transaction) public transactions;
    uint256 public transactionCount;
    address public owner;

    // Events
    event StockListed(string symbol, string name, uint256 price, uint256 totalSupply);
    event StockBought(string symbol, uint256 amount, uint256 price, address buyer, address seller);
    event StockSold(string symbol, uint256 amount, uint256 price, address seller, address buyer);
    event TransactionRecorded(uint256 transactionId, string symbol, uint256 amount, uint256 price, address buyer, address seller, bool isBuy);

    constructor() {
        owner = msg.sender;
        transactionCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // List a new stock
    function listStock(
        string memory _symbol,
        string memory _name,
        uint256 _price,
        uint256 _totalSupply
    ) public onlyOwner {
        require(stocks[_symbol].isActive == false, "Stock already exists");
        require(_price > 0, "Price must be greater than 0");
        require(_totalSupply > 0, "Total supply must be greater than 0");

        stocks[_symbol] = Stock({
            symbol: _symbol,
            name: _name,
            price: _price,
            totalSupply: _totalSupply,
            availableSupply: _totalSupply,
            owner: msg.sender,
            isActive: true
        });

        emit StockListed(_symbol, _name, _price, _totalSupply);
    }

    // Buy stocks
    function buyStock(string memory _symbol, uint256 _amount) public payable {
        require(stocks[_symbol].isActive, "Stock is not active");
        require(_amount > 0, "Amount must be greater than 0");
        require(stocks[_symbol].availableSupply >= _amount, "Not enough stocks available");
        require(msg.value >= stocks[_symbol].price * _amount, "Insufficient payment");

        // Update stock supply
        stocks[_symbol].availableSupply -= _amount;

        // Update buyer's holdings
        holdings[msg.sender][_symbol] += _amount;

        // Record transaction
        uint256 transactionId = transactionCount++;
        transactions[transactionId] = Transaction({
            stockSymbol: _symbol,
            amount: _amount,
            price: stocks[_symbol].price,
            buyer: msg.sender,
            seller: stocks[_symbol].owner,
            timestamp: block.timestamp,
            isBuy: true
        });

        // Add transaction to buyer's history
        transactionIds[msg.sender].push(transactionId);

        emit StockBought(_symbol, _amount, stocks[_symbol].price, msg.sender, stocks[_symbol].owner);
        emit TransactionRecorded(transactionId, _symbol, _amount, stocks[_symbol].price, msg.sender, stocks[_symbol].owner, true);
    }

    // Sell stocks
    function sellStock(string memory _symbol, uint256 _amount) public {
        require(stocks[_symbol].isActive, "Stock is not active");
        require(_amount > 0, "Amount must be greater than 0");
        require(holdings[msg.sender][_symbol] >= _amount, "Not enough stocks to sell");

        // Update stock supply
        stocks[_symbol].availableSupply += _amount;

        // Update seller's holdings
        holdings[msg.sender][_symbol] -= _amount;

        // Calculate payment
        uint256 payment = stocks[_symbol].price * _amount;

        // Record transaction
        uint256 transactionId = transactionCount++;
        transactions[transactionId] = Transaction({
            stockSymbol: _symbol,
            amount: _amount,
            price: stocks[_symbol].price,
            buyer: stocks[_symbol].owner,
            seller: msg.sender,
            timestamp: block.timestamp,
            isBuy: false
        });

        // Add transaction to seller's history
        transactionIds[msg.sender].push(transactionId);

        // Transfer payment to seller
        payable(msg.sender).transfer(payment);

        emit StockSold(_symbol, _amount, stocks[_symbol].price, msg.sender, stocks[_symbol].owner);
        emit TransactionRecorded(transactionId, _symbol, _amount, stocks[_symbol].price, stocks[_symbol].owner, msg.sender, false);
    }

    // Get holdings for a specific stock
    function getHoldings(string memory _symbol) public view returns (uint256) {
        return holdings[msg.sender][_symbol];
    }

    // Get transaction history
    function getTransactionHistory() public view returns (uint256[] memory) {
        return transactionIds[msg.sender];
    }

    // Get transaction details
    function getTransactionDetails(uint256 _transactionId) public view returns (
        string memory symbol,
        uint256 amount,
        uint256 price,
        address buyer,
        address seller,
        uint256 timestamp,
        bool isBuy
    ) {
        Transaction memory transaction = transactions[_transactionId];
        return (
            transaction.stockSymbol,
            transaction.amount,
            transaction.price,
            transaction.buyer,
            transaction.seller,
            transaction.timestamp,
            transaction.isBuy
        );
    }

    // Update stock price (only owner)
    function updateStockPrice(string memory _symbol, uint256 _newPrice) public onlyOwner {
        require(stocks[_symbol].isActive, "Stock is not active");
        require(_newPrice > 0, "Price must be greater than 0");
        stocks[_symbol].price = _newPrice;
    }

    // Get stock details
    function getStockDetails(string memory _symbol) public view returns (
        string memory name,
        uint256 price,
        uint256 totalSupply,
        uint256 availableSupply,
        bool isActive
    ) {
        Stock memory stock = stocks[_symbol];
        return (
            stock.name,
            stock.price,
            stock.totalSupply,
            stock.availableSupply,
            stock.isActive
        );
    }
} 