## Member

Member is a bridge between multiple decentralized social networks. It operates on the BitClout, Bitcoin Cash,
Hive blockchains and the relay based Nostr network. 
Members have a single login that can read, follow, like, tip, post and reply across multiple networks.
Notably it also has reputational ratings and geolocated posts.
It is a 'fat' javascript client app that runs against a relatively dumb server.
You can try it online here - nostraco.in

## Networks

| Network           | Read  | Write | Notes |
| ----------------  |:-----:| :----:|------:|
| 0 - Bitcoin Cash  | yes   | no    | Memo network|
| 1 - Bitclout      | yes   | yes   ||
| 2 - Hive          | soon  | no    | Importing . . available to read soon|
| 3 - Membercoin    | no    | no    | [Defunct - see here](https://www.reddit.com/r/dogecoindev/comments/y4apo0/new_project_on_the_doge_chain_decentralized/iteckgy/)|
| 4 - Doge          | no    | no    | [Defunct - see here](nostraco.in/p/d987d2e159) Old posts still indexed|
| 5 - Nostr         | yes   | yes   | [Guide](nostraco.in/p/b31b9ebb3f)|
| 6 - Farcaster     | soon  | ?     | Awaiting hubs release |
| 7 - Lens          | ?     | ?     | Legibility problems |
| 8 - Nostracoin    | yes   | yes   |  |


## Getting Started

Before making changes, it would be a good idea to check
out [the contribution guidelines](CONTRIBUTING.md)
and [open issues](https://github.com/memberapp/memberapp.github.io/issues)

To get started locally, simply open `index.html` in Firefox or Chrome, that's it.

Alternatively, the client can also be hosted directly from github pages,
by going to **Settings > Github Pages** from a forked version

## Theme Dev

Developed using `SCSS`, find out more information here https://github.com/memberapp/FeelsTheme

## Client

The client is an HTML5/JS browser app with no outside js dependencies.
It is written in pure JS does not use any JS framework.

It connects to a Member server to get content and broadcast transactions. 

Projects

->Bug tracker

-->List of issues on https://github.com/memberapp/memberapp.github.io/issues, many are client only.

## Server

The server currently consists of

[Node.js program with option of MySQL or SQLite Database] (https://github.com/memberapp/server)


## Financial

Member is free to use and there won't be ads or data mining. 
