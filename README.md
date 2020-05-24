# shu-dian-vue

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Prereqisites](#prereqisites)
- [Perfomance Test](#performance)

## About <a name = "about"></a>

What is Shu Dian? Google translate yourself 😛. It's just a code name I create, because I am too lazy to put the real name of this project. Actually this project is a assignment test that I got.

## Getting Started <a name = "getting_started"></a>

To run this project is quite easy, just clone or download :

- This repository

- Backend API (https://github.com/dvlwj/project-shu-dian-node)

Implying you can install and run it by following the specific documentation,  you can start to install and run this reposotiory by run:

```
npm install
```

```
npm run dev
```

(Feel free to add new npm command inside `package.json` to suit your own interest.)

## Prerequisites <a name = "prerequisites"></a>

Too busy to put min. specification, but my development environment when write this project is :

* Node v14.2.0 with 2 session, each for VueJS client and ExpressJS API
* Docker v19.03.8 | for shu-dian-node (ExpressJS API)
* MySQL v8.0.20 (Dockernized) | for shu-dian-node (ExpressJS API)

## Performance Test <a name = "performance"></a>

Tried to running test with PWA enabled for this application. One for mobile view and one for desktop view. Each of them running locally using ```serve -s dist``` targeting /build directory.

Got score 80ish avg. and got highest score for 81 and 85. Trying to improve it to 90, but failed on the way.

Screenshots of testing result is available in /docs folder.