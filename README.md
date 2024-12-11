# TinyType

![TinyType Logo](./resources/logo-with-bg.png)

## Access the Project
[https://startup.cs260fullstack.click](https://startup.cs260fullstack.click)

## Course Notes
See notes [here](./notes.md).

## Specification Deliverable

### Elevator Pitch

So you're a computer scientist are you? You think you're good at typing? Well, I'll share a secret with you; you aren't. But you can try your hand at TinyType! TinyType is a word-per-minute-measuring typing challenge that comes in two varieties: easy and hard. It sources its typing samples from Wikipedia! Type them as fast as you can without making mistakes. Compete against global users and see if you are really as good at typing as you think.

### Design

![Home](./resources/TinyType_home.png)

![Game](./resources/TinyType_game.png)

![Scores](./resources/TinyType_scores.png)


### Key Features

* Users can and are required to create an account.
* Users can play easy or hard typing word-per-minute-measuring typing challenges, with typing samples sourced from Wikipedia.
* WPM is updated live in-browser as typing is done. Text is grayed out in the source text as it is typed.
* "Encouraging" messages are shown as other users submit high scores.
* User and global high-scores are visible on their own page.

### Technology Usage

Required technologies will be used in the following ways:

* HTML - HTML will provide the structure for the webpage, including the nav bar, tables, inputs, etc.
* CSS - CSS will provide a clean look and feel and enable proper layout.
* JavaScript - JavaScript will provide the client-side functionality including the live WPM counter, challenge text graying-out, and showing the motivational messages.
* React - Once rewritten in React, it will provide the required JavaScript interactivity and reuse, including the typing component (displays WPM, manages challenge formatting and text box state, etc.), the motivational message component, and the high score table component. It will also provide routing.
* Service - A backend service with endpoints for the following functionalities:
  * login/logout - Logs in/out the users.
  * newGame - Starts a new game and returns the typing challenge. **NOTE** This will call the Wikipedia API to satisfy the external API requirement.
  * completeGame - Completes a game and reports the high score.
  * scores - Gets both user high scores and global high scores.
* DB/Login - Stores registered users and high scores for users.
* WebSocket - Pushes "motivational messages" to users currently playing as other users submit high scores.

## HTML Deliverable
- [x] **HTML pages** - 5 pages created including: login (main page), account creation, main game, high scores, about.
- [x] **HTML elements** - HTML elements are used appropriately.
- [x] **Links** - The nav menu links between pages. Some external links are included (footer, about pages).
- [x] **Text** - The about page contains two paragraphs text. Text is also scattered throughout the app.
- [x] **Service calls** - The placeholder for a service call is shown on the main game page (gets prompt text from Wikipedia).
- [x] **Images** - A logo is included as a favicon and is shown on the about page.
- [x] **Login** - A login and account creation page are included. A placeholder for the username is included.
- [x] **Database** - A placeholder and template for database content is included on the high scores page.
- [x] **WebSocket** - A placeholder and template for a websocket-driven notification is included on the main page.

## CSS Deliverable
CSS has been added and application now has a consistent look-and-feel.

- [x] **Header, footer, and main content body** - All present and using flexbox.
- [x] **Navigation elements** - Implemented bootstrap navbar.
- [x] **Responsive to window resizing** - This site isn't really meant for mobile (it is a typing game), but the app reflows to a mobile-friendly layout when the screen size goes below 550px;
- [x] **Application elements** - Application elements are styled with a clean look and good padding.
- [x] **Application text content** - Text in the game is faded out once it has been typed.
- [x] **Application images** - The image is floated to the left on the about page so the text can wrap around it.

## React Deliverable
React functionality has been added and application now functions (client-only).

- [x] **Bundled and transpiled** - Done!
- [x] **Components** - Two components (aside from pages) were created: `Loader` and `Notification`.
  - [x] **Login/Register** - State stored in local storage.
  - [x] **Game** - Game is fully functional client side. It uses a mock prompt for now (eventually to be fetched from Wikipedia when the backend is implemented). Notifications are shown from a mock WebSocket that toggles visibility every 5 seconds.
  - [x] **Scores** - Static scores data is mocked out.
- [x] **Router** - Pages are all routed using `react-router`.
- [x] **Hooks** - Most pages use hooks, see `./src/game.jsx` for many of them. One example would be using `useState()` in `./src/app.jsx` to store login state.


## Service Deliverable
ExpressJS service has been implemented.

- [x] **NodeJS express server** - Done!
- [x] **Static files** - Served by ExpressJS!
- [x] **Third-party endpoint** - Calls to [Wikipedia](https://wikipedia.org) proxied through service.
- [x] **Backend service endpoints** - All endpoints implemented including login and score submission.
- [x] **Frontend calls service endpoints** - All endpoints are called by the React code and function properly.


## Login Deliverable
Full login functionality and database functionality has been implemented.

- [x] **MongoDB Atlas database created** - Done!
- [x] **Data stored in database** - All data is stored and persistent.
- [x] **User registration** - Implemented.
- [x] **User login** - Implemented.
- [x] **Credential storage** - Implemented.
- [x] **Restricts functionality** - All non-auth endpoints are protected by login middleware.

## Login Deliverable \(Regrade Requested - 12/11/24\)
A bug in the scores service \(introduced after initial submission\), intended to keep the database small and free from high scores that would not be displayed, prevented a user's high score from being saved if it was not a global high score. The high score would be saved in the mongo database, then immediately deleted \(by accident\). The erronious code has since been lost to a force push. The new code in [scoresService.js](https://github.com/ach222/startup/blob/b44eecbbf19ea02d39ebaa74eec221e28a4dc3fc/service/scoresService.js#L47) has fixed this issue, and now properly keeps the database small and free from high scores that would not be displayed.

- [x] **Data stored in database** - All data is stored and persistent. High scores now save properly.

## WebSocket Deliverable
Full websocket functionality has been implemented. Application is fully functional.

- [x] **Backend listens for websocket connections** - Done!
- [x] **Frontend makes websocket connection** - Done!
- [x] **Data sent over the websocket connection** - Done! Messages are sent when another user starts or completes a game.
- [x] **Data sent over websocket connection displayed** - Done! Notifications are shown when another user starts or completes a game.
- [x] **All visible elements are functional** - Done! Application is fully functional.
