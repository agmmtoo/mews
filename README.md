# Mews

Mews is a platform built with Express framework and MongoDB Atlas. Inspired by Hacker News' item structure, Mews allows users to post items that can be upvoted (or "boosted") by other users, increasing the item's rank.

## Features

- View items by rank, posting period, or posting date
- Basic CRUD operations for items, users, and all objects
- Nested comments structure
- User's own points increase when their items' points increase
- 'Boost' items to increase their points and rank
- Deployed on Digital Ocean using Github Actions

Mews delivers a unique and engaging experience for users to explore, upvote, and engage with content posted by the community. The deployment on Digital Ocean using Github Actions ensures a fast and reliable experience for all users

## About

Express backend for Mews - mm news aggregration site.

## Up and Run

* install Mongo DB and run on url defined in `.env`
* `yarn start`
* Check out [mews-client](https://github.com/agmyintmyatoo/mews-client) React app for standard(?) frontend.

## Notes regarding on `.env`

* `PORT` for server port
* `SALT` to hash users' passwords
* `SECRET` for JWT
* `MONGO_URL` for , ofc, Mongo DB url

## Todo

- write todos, ughh
