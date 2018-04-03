# ripcord
A JSON-RPC API implementing a traditional style of adventure game.

[![CircleCI](https://circleci.com/gh/kryptx/ripcord.svg?style=svg)](https://circleci.com/gh/kryptx/ripcord)

## What is this?
It's a side project. It's an experiment. It's also playtime and a little bit of dress rehearsal.

Since RPC has fallen so far out of favor (thanks to REST), I wanted to imagine what a user-friendly, clean developed RPC-over-HTTP API might realistically look like, from the ground up.

For that purpose, I've introduced an entity -- a player character -- to which the user can issue commands. Much like the classic game, Adventure.

The API meets the [JSON-RPC 2.0 Specification](http://www.jsonrpc.org/specification). It is not backwards compatible to any prior version in any way.

## How to run
There are a few ways. This one's pretty good and only requires docker.
1. Clone the repo.
10. Inside the folder, `docker build -t adventure .`
20. `docker run -d adventure -p 3000:3000`

If you're going to be mucking about in the source anyway, there are also launch configurations present for Visual Studio Code and, of course, you can always just `npm start`.

## How do I play?
1. Create a character using the `start` method.
```
Content-type: application/json
POST /json-rpc
{
  "jsonrpc": "2.0",
  "method": "start",
  "id": "anything-you-want"
}
```
2. Look at the response.
4. Be amazed. _This step is important. Take your time._
5. Wait for more to be implemented.
8. Look at this page later.

### Methods
#### `move`
Move to the next room, in the provided direction.

#### `ping`
Responds with `"pong"`. Unless, of course, you don't provide an id.

#### `reflect`
Returns your player data.

#### `start`
Create a character. Create a world. Place the character in the world. Not necessarily in that order. This is for first time users. Not a general character creation API.
