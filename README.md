# RealTime Device Tracking App

A real-time device tracking application built with **Node.js**, **Express**, **Socket.IO**, and **Leaflet**. This application enables users to track their devices' location on a map in real-time using geolocation.

## Features

- **Real-time location tracking**: Updates device locations on the map in real time using WebSocket.
- **Interactive map**: Displays device locations using the Leaflet library.
- **Responsive design**: Optimized for various screen sizes, ensuring a smooth user experience.

## Technologies Used

- **Node.js**
- **Express**
- **Socket.IO**
- **Leaflet**
- **HTML/CSS**

## Getting Started

### Prerequisites

Ensure the following tools are installed on your machine:

- [Node.js](https://nodejs.org/)  
- npm (Node Package Manager, included with Node.js)

### Installation

1. **Clone this repository**:  
   ```bash
   git clone <repository-url>
   cd realtime-device-tracking
   ```
   
2. **Install dependencies**:  
Run the following command to install the required packages:

    ```bash
    npm install
    ```

3. **Start the server**: 
To start the application, use the following command:

    ```bash
   node app.js
    ```

    Alternatively, you can use nodemon for automatic reloading during development:

    ```bash
    npm install -g nodemon
    npx nodemon app.js
    ```


## Usage

>Open your browser and navigate to:  
```plaintext 
http://localhost:<PORT>
```

>Replace `<PORT>` with the port number specified in app.js (default is 3000).

>Allow geolocation permissions when prompted by the browser.

>Observe your real-time location and other devices updating dynamically on the map.