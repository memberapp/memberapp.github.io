## Member

Member is a Bitcoin Cash blockchain browser. It reads and allows users to create actions in the Memo/Member protocol.
Notably it displays and creates posts, likes, tips, profiles, reputational ratings and geolocated posts.
It is designed to be a 'fat' javascript client app that runs against a relatively dumb server.
You can see it online here - https://member.cash

## Getting Started

Before making changes, it would be a good idea to check
out [the contribution guidelines](CONTRIBUTING.md)
and [open issues](https://github.com/memberapp/memberapp.github.io/issues)

To get started locally, simply open `index.html` in Firefox or Chrome, that's it.

Alternatively, the client can also be hosted directly from github pages,
by going to **Settings > Github Pages** from a forked version

A more roust way is to serve the directory as a web-page via node or python:

    npm install reload -g
    reload

or

    python3 -m http.server -p 8080

When using `localhost:*` Most modern browsers will enable the service worker
and dynamically loaded scripts.

## Theme Dev

Developed using `SCSS`, find out more information here https://github.com/memberapp/FeelsTheme

## Client

The client is an HTML5/JS BCH blockchain browser app with no outside js
dependencies.

It connects to a Member server to get content and broadcast transactions. It
can also get utxos from a Member server if that server has a BCHD utxo index.
Otherwise it gets utxos from Bitbox

Projects

->New CSS designs

->Security review

-->Review handling of private keys, assess for XSS vulnerabilities, make recommendations for improvements

->Bug tracker

-->List of issues on https://github.com/memberapp/memberapp.github.io/issues, many are client only.

## Server

The server currently consists of

Node.js program with option of MySQL or SQLite Database
Requires BCHD or Bitcoin Unlimited Node (other node software untested yet)

## Testing

->Regularly using Member from the perspective of a new user and reporting bugs and problems
->Using Member as a regular user and reporting bugs and problems
->Collecting bug reports from forums etc and entering them in the github bug tracking system.

## Desktop App

The app will package a BCH node (BCHD), Server and Client. It should allow one click install and setup.

Projects

->Create User Friendly installer for various platforms
->Update BCHD to support utxoindex with fastsync

## Mobile Apps

Mobile apps will rely on a remote server. This might be a server provided by Member, or the member's own server.

Projects

->Iphone app

->Android app

## Hosting

->A host with good capacity and DDOS protection would be helpful to the project.

## Financial

Member is a non profit project. It is free to use and there won't be ads or data mining. However it's always helpful to have more funds for development and hosting.

The direct donation address is **bitcoincash:qqlx98vrupdm9gmnenwpcgy2yv4hfzktwv6raa4n3g**

![member.cash donation address](/img/member-donation-qr.png)


Alternatively you can buy some MEMBER tokens at the lowest available market rate here
https://memo.cash/token/766f9f56ac0a3f0e4c64cb3453d0c45336a20685827801b2188d237c2a6ffc43?for-sale

For either method, you'll appear on the top supporters page, here
https://memo.cash/token/766f9f56ac0a3f0e4c64cb3453d0c45336a20685827801b2188d237c2a6ffc43?balances

(The only use of MEMBER tokens is to hold them to appear higher on the top supporters page)


