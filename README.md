# Molar Check
System for the identification of Molar Incisor Hypomineralization.

This project embraces the client implementation for the MIH application.

## Directory Structure (Old)

* `install` - installation instructions of the PostgreSQL in docker plus the SQLModel and FastAPI libraries;
* `model` - schemas and diagrams of the data model;
* `src` - server source code in Python.

## Running the Main Server Application

### 0 - Clone the repository
~~~
git clone https://github.com/seu-usuario/app-mih.git
cd app-mih
~~~

### 1 - Install requirements
~~~
npm install
~~~

### 2 - Start the application
* Copy **.env-model**, rename it **.env** and change the needed environment variables.
~~~
npm run dev
~~~