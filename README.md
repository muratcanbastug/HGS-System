# HGS-System

I built the HGS system in Turkey on Ethereum Blockchain. In summary, our project consists of two separate contracts, Administration.sol and HGSBocOffice.sol. Only the owner of the admin contract can create and delete an office. This path has been followed since each office may be on a different road and the admin may want to examine the vehicles passing through the offices separately. The created offices are stored in a list and can be deleted. A user with a car can register from any office. The information of registered users is kept in the admin contract in order to make it accessible to all offices. So all vehicles can pass through any office. Fees for all offices can be determined individually and updated later. In addition, each office lists vehicles passing day by day.

Administration contract address on rinkeby: 0xc97dfd772106ed0913E8cC658Be6b66f229f1617

This project has been prepared for Akbank WEB3 Practicum. For this reason, the project has to meet some of the practicum requirements and is not efficient enough to be used in real life. Also, test codes are not written broadly enough to cover all functions.
