<div id="top"></div>

<!-- PROJECT TITLE -->
<br />
<div align="center">
  <!-- <a href="">
    <img src="" alt="Logo" width="80" height="80">
  </a> -->

  <h2 align="center">&lt;&lt; Kata Golla &gt;&gt;</h2>
  <h3 align="center">Bored? Check out my KG game(for kindergarten kids you say? probably!).</h3>
  <h3>You're "welcome"!</h3>
  <hr />
  <p align="center">
    <!-- <a href=""><strong>Explore the docs »</strong></a>
    <br /> -->
    <br />
    <a href="https://kata-golla-msa.herokuapp.com/">View Demo</a>
    ·
    <a href="https://github.com/m-s-abeer/kata-golla/issues">Report Bug</a>
    ·
    <a href="https://github.com/m-s-abeer/kata-golla/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<!-- <details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details> -->

<!-- ABOUT THE PROJECT -->

<!-- ## About The Project -->

## Built With

Did you know it's my first time using the first four things mentioned below? It was fun learning them!

- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Socket.io](https://socket.io/)
- [Mongoose](https://mongoosejs.com/)
- [React.js](https://reactjs.org/)
- [Material UI](https://mui.com/)

<!-- <p align="right">(<a href="#top">back to top</a>)</p> -->

<!-- GETTING STARTED -->

## Getting Started

I'll be explaining how you can start it up locally for now.

### Prerequisites

- `node` version `16.x`
- `mongodb` or `mongo atlas` version `^4.x`

### Docker Installation

> In case you want to use mongo atlas, skip the mongo section below and update MONGO_URL in project_root/server/.env instead.

```sh
git clone https://github.com/m-s-abeer/kata-golla.git
cd kata-golla

cp client/env.example client/.env
cp server/env.example client/.env

mongo
use kata-golla
exit

docker build -t kata-golla .
docker run -d --name="kata-golla-3001" -p 3001:3001 kata-golla
```

- Ready to go! Checkout `http://localhost:3001/` and start playing! (you may change port 3001 if required)
- The react client is served as a static build and it's routed from node server.
- To stop the docker container run `docker stop kata-golla-3001`

<p align="right">(<a href="#top">back to top</a>)</p>
### Local Installation

Here we'll use stand-alone React and Node server. Just for the !fun of it! ⚆ \_ ⚆

1. Clone the repo locally:-

   > HTTPS: `git clone https://github.com/m-s-abeer/kata-golla.git`

2. Create a local mongo database from mongo CLI
   ```sh
   mongo
   use kata-golla
   exit
   ```
   > You can use a mongo atlas cluster as well, in that case update MONGO_URL in project_root/server/.env later on
3. Get into project root `cd kata-golla`
4. Install client-side NPM packages and start front-end

   > relative to project root

   ```sh
   cd client
   npm install
   cp env.example ./.env
   npm start
   ```

5. Install server-side NPM packages and start back-end

   > relative to project root

   ```sh
   cd server
   npm install
   cp env.example ./.env
   npm start
   ```

- Ready to go! Checkout `http://localhost:3000/` and start playing!
<p align="right">(<a href="#top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

<!-- ## Usage

Usage details

<p align="right">(<a href="#top">back to top</a>)</p> -->

<!-- CONTRIBUTING -->

## Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->

<!-- ## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p> -->

<!-- CONTACT -->

## Contact

Mahmud Sajjad Abeer

- [linkedin: msabeer](https://www.linkedin.com/in/msabeer/)
- mahmudsajjad.abeer@gmail.com

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
<!--
## Acknowledgments

Use this space to list resources you find helpful and would like to give credit to. I've included a few of my favorites to kick things off!

- [Choose an Open Source License](https://choosealicense.com)
- [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
- [Malven's Flexbox Cheatsheet](https://flexbox.malven.co/)
- [Malven's Grid Cheatsheet](https://grid.malven.co/)
- [Img Shields](https://shields.io)
- [GitHub Pages](https://pages.github.com)
- [Font Awesome](https://fontawesome.com)
- [React Icons](https://react-icons.github.io/react-icons/search)

<p align="right">(<a href="#top">back to top</a>)</p> -->

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
