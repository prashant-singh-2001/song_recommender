# Song Recommender

This project is a song recommender application that allows users to search for songs and receive recommendations based on their selections.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Screenshots](#screenshots)

## Technologies Used

- **Frontend:** React.js ([https://reactjs.org/](https://reactjs.org/))
- **Backend:** Python (using FastAPI for REST API and Uvicorn as the ASGI server) ([https://fastapi.tiangolo.com/tutorial/first-steps/](https://fastapi.tiangolo.com/tutorial/first-steps/), [https://www.uvicorn.org/](https://www.uvicorn.org/))
- **Deployment:** Docker ([https://docs.docker.com/engine/reference/builder/](https://docs.docker.com/engine/reference/builder/))

## Installation

**Prerequisites:**

- Docker installed: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

**Instructions:**

1. Clone this repository:

   ```bash
   git clone https://github.com/prashant-singh-2001/song_recommender.git
   ```

2. Navigate to the project directory:

   ```bash
   cd song_recommender
   ```

3. Start the application:

   ```bash
   docker-compose up
   ```

4. Access the application:

   The application is likely accessible in your web browser at `http://localhost:<port>`, where `<port>` depends on how the ports are mapped in `docker-compose.yaml`. Typically, the front-end service might be exposed on port 3000, so you could try `http://localhost:3000`.

## Usage

- The application allows you to search for songs by name.
- Based on your search, the application will recommend similar songs.
- It also allows you to browse random songs.

## Screenshots for Reference

 <img src="User_Guide/ScreenSHots/1.png" alt="drawing" width="800"/> </br> 

### Landing Page

- By Clicking on 'Find Your Jam' button you can go to Search Page and search for your favorite songs.
- By clicking on 'Discover New Hits' button you can go to browse page and browse randomly selected songs.
<hr/>
<br/>
<br/>
<img src="User_Guide/ScreenSHots/2.png" alt="drawing" width="800"/> </br>

### Search Page

Type in any keyword and hit the search icon, it will search for songs that have keyword(s) in their lyrics.

<hr/>
<br/>
<br/>

<img src="User_Guide/ScreenSHots/2_1.png" alt="drawing" width="800"/> </br>

### Search Page with Results

- On clicking on any of the search results, you can go to its page and see the similarly recommended songs.
<hr/>
<br/>
<br/>
<img src="User_Guide/ScreenSHots/3.png" alt="drawing" width="800"/> </br>

### Browse Page

Browse through a list of randomly selected songs from our database.

<hr/>
<br/>
<br/>

<img src="User_Guide/ScreenShots/4.png" alt="drawing" width="800"/> </br>

### Song Page

Here you can get the recommendations for similar songs to the selected one.

## Project Structure

This project uses a separation of concerns by dividing the codebase into a backend and frontend:

- **[python_backend/](python_backend/)** (Backend code)
  - **[ml_recommend/](python_backend/ml_recommend/)** (Machine Learning Recommendation logic)
    - **[recommender.ipynb](python_backend/ml_recommend/recommender.ipynb):** Jupyter Notebook file likely containing the core recommendation logic using machine learning models.
    - **[spotify_millsongdata.csv](python_backend/ml_recommend/spotify_millsongdata.csv):** CSV file containing song data (potentially from Spotify or a similar source).
  - **[env/](python_backend/env/)** (Virtual environment directory) - This directory is likely ignored by Git and should not be committed.
  - **[**pycache**/](python_backend/**pycache**/)** (Cache directory) - This directory is automatically generated by Python and should not be committed.
  - **[Dockerfile](python_backend/Dockerfile):** Defines instructions for building a Docker image for the backend.
  - **[tempTestFile.py](python_backend/tempTestFile.py):** (Optional) A temporary test script (consider removing if not actively used).
  - **[requirements.txt](python_backend/requirements.txt):** Text file containing dependency requirements for the backend project.
  - **[main.py](python_backend/main.py):** Likely the main entry point for the backend application.
  - **[data.pkl](python_backend/data.pkl):** (Optional) A pickled data file used by the backend (consider mentioning its contents if relevant).
  - **[Song.py](python_backend/Song.py):** Python class definition for representing song data.
  - **[similarity_dict.pkl](python_backend/similarity_dict.pkl):** (Optional) A pickled dictionary used for storing song similarities (consider mentioning its purpose if relevant).
- **[frontend/](frontend/)** (Frontend code)
  - **[node_modules/](frontend/node_modules/)** (Dependency directory) - This directory is typically ignored by Git and should not be committed. It's automatically generated by npm/yarn and contains downloaded project dependencies.
  - **[src/](frontend/src/)** (Source code directory)
    - **[index.js](frontend/src/index.js):** Main JavaScript entry point for the frontend application.
    - **[index.css](frontend/src/index.css):** Main CSS stylesheet for the frontend application.
    - **[components/](frontend/src/components/)** (Reusable UI components) - This directory likely contains reusable UI components for building the frontend interface.
    - **[App.js](frontend/src/App.js):** Main React component for the application (assuming React is used).
    - **[App.css](frontend/src/App.css):** CSS styles specific to the App component.
  - **[public/](frontend/public/)** (Public assets directory)
    - **[robots.txt](frontend/public/robots.txt):** File instructing search engines how to crawl the website.
    - **[manifest.json](frontend/public/manifest.json):** (Optional) Manifest file for web applications or Progressive Web Apps (PWAs).
    - **[logo512.png](frontend/public/logo512.png)** & **[logo192.png](frontend/public/logo192.png):** App icons in different sizes.
    - **[index.html](frontend/public/index.html):** Main HTML file for the frontend application.
    - **[favicon.ico](frontend/public/favicon.ico):** Favicon for the website.
  - **[tailwind.config.js](frontend/tailwind.config.js):** Configuration file for Tailwind CSS, a utility-first CSS framework (if used in the project).
  - **[package-lock.json](frontend/package-lock.json):** Lock file generated by npm/yarn to ensure consistent dependency versions.
  - **[package.json](frontend/package.json):** File containing project metadata, dependencies, and scripts for the frontend.
  - **[Dockerfile](frontend/Dockerfile):** Defines instructions for building a Docker image for the frontend.
