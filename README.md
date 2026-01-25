
# Portals Garden

Portals Garden is a 3D web experience built with Vite and Three.js. The main entry point creates a central hub world, _Portals Garden_ where the user can walk around in a first-person view. This garden is populated by several "portals," which have interactive 3D models.

When a user clicks on a portal, a modal appears, showing a description of the "experience" and providing a link. Each link leads to a self-contained HTML file within the experiences directory, which launches a new, distinct Three.js scene. Some experiences can even lead to other, hidden experiences.

## Tech Stack

*   [Vite](https://vitejs.dev/)
*   [Three.js](https://threejs.org/)

## Project Structure

The project is organized into the following main directories:

*   `experiences/`: This directory contains all the individual, self-contained WebGL experiences. Each sub-directory represents a different "world" that the user can enter from the main garden.
*   `js/`: This directory contains the core of the "Portals Garden" hub.
    *   `main.js`: This is the main entry point of the application. It initializes the main Three.js scene, camera controls, and the `PortalManager`.
    *   `config/portals.js`: This file is the central configuration for the entire project's content. It contains an array of all the portals, their 3D models, descriptions, and the links to their respective experience pages.
    *   `managers/PortalManager.js`: This class manages the lifecycle of the portals in the main scene. It reads the configuration from `portals.js`, loads the 3D models, and handles user interaction to show the experience modal.
    *   `ui/Modal.js`: This module creates the modal that displays information about each portal and provides a link to the corresponding experience.
*   `public/`: This directory contains all the static assets for the project, such as 3D models, textures, and fonts.
*   `dist/`: This directory contains the production build of the project.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

*   npm

    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  Clone the repo

    ```sh
    git clone https://github.com/your_username_/your_project_name.git
    ```

2.  Install NPM packages

    ```sh
    npm install
    ```

3.  Run the development server

    ```sh
    npm run dev
    ```

## Available Scripts

In the project directory, you can run:

*   `npm run dev`: Runs the app in the development mode.
*   `npm run build`: Builds the app for production to the `dist` folder.
*   `npm run preview`: Serves the production build locally for preview.

## Experiences

*   **Clean Squared Place:** Ephemeral existences, molecular arrangements with wills that die and reveal essential elements for creation.
*   **Nitrogenous Bases:** In the depths of molecular existence, every experience whispers the primordial secrets of life.
*   **Game of Life:** In the perpetual dance of creation and destruction, each cell is a verse of the universal poem. Simple rules give rise to infinite complexities, reflecting the mystery of how life emerges from the void and returns to it.
*   **AnothEarth:** A distorted mirror of our own world, where reality intertwines with fantasy. What if Earth had a lost twin in the multiverse?
*   **Maxkodia:** Brought forth from the depths of the cosmos, where time bends upon itself and now trapped here, there exists a planet that holds the secrets of civilizations that never came to be.
*   **Space Words:** Can we capture the infinite within language?
*   **Gardhan Thinker:** A labyrinth of thoughts where consciousness meets the pure essence of contemplation. A space where time stands still and only the act of thinking remains.
*   **Human Thinker:** through the road of thinkers with can find ideas borning from a human thinker, what have it to say us?.
*   **Deep Space:** In the depths of the cosmos, where time is but a memory and space an illusion, we come face to face with what we truly are: travelers of darkness seeking light in the abyss, where only nonexistence awaits us.
