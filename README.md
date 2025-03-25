![image](https://github.com/user-attachments/assets/cd86fb43-bc96-432e-a877-a40149244757)


# Medilink - NUS Health Hack 2025
Medilink is a centralized platform that seamlessly connects nursing homes and hospitals. It provides real-time updates on patient discharge readiness, simplifies the retrieval of essential documents for caregivers, and coordinates ambulance assignments. Additionally, its integrated vector search empowers nurses to quickly and effectively locate patient data, ensuring that all records are accurately maintained and shared among healthcare professionals.

## Technology Stack
- **Node.js**: A robust JavaScript runtime that enables scalable and efficient server-side applications.
- **REST API**: A lightweight architectural style that facilitates smooth communication between distributed systems.
- **Intersystem SQL with ObjectScript**: A powerful database solution that leverages ObjectScript for advanced data manipulation and management.
- **Cohere AI API**: An AI-driven service that enhances search accuracy and provides intelligent insights for data handling.
- **Intersystem Vector Search**: Powerful semantic search functionality that converts patient data into numerical vectors using Cohere AI embeddings, stores them in Intersystem SQL database, and enables rapid retrieval of contextually relevant medical information through sophisticated similarity matching.

## Get Started
```bash
git clone https://github.com/winniehhy/Medilink.git
cd Medilink
npm install
node server.js
```
** before running node server.js , make sure that docker is running **

## Connect from VSCode with Intersystem Database
1. Go to VS Code Extension - search for "ObjectScript"
2. Press Ctrl + Shift + P (Windows command prompt)
3. Choose: Add server to workspace
4. Click "+" on top to add new server
   1. Server name: Intersystem (or any name you prefer)
   2. Host: localhost
   3. Hostname/IP address: 
      1. **Run `docker ps -a` to get \<container ID\>**
      2. **Run `docker inspect <container_id> | grep "IPAddress"`**
   4. Port: 52773
   5. Namespace: USER
   6. Username: demo
   7. Password: demo
5. Once connected with the intersystem data management, copy the 3 classes ( backend/ intersytem-classess) in order to store and retrieve patient data

## Authors ( 42 Minions)
- Winnie Heng Han Yee
- Nelson Chok Vui Kian
- Tay Qi Ter
- Adya Zahila
- Natalie Ho Ni Xuan
