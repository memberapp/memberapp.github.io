Todo
------

- Don't cache dev origins
- Failover server requests to cache
- Update service worker on new version


Member
------

Member is a Bitcoin Cash blockchain browser. It reads and allows users to create actions in the Memo/Member protocol.
Notably it displays and creates posts, likes, tips, profiles, reputational ratings and geolocated posts.
It is designed to be a 'fat' javascript client app that runs against a relatively dumb server. 
You can see it online here - https://memberapp.github.io


Client
------
The client is an HTML5/JS BCH blockchain browser app with no outside js dependencies. It can be run from a website, or from a local file system. (Brave/Edge browsers do not allow local storage, so Firefox/Chrome recommended)

It connects to a Member server to get content and broadcast transactions. It can also get utxos from a Member server if that server has a BCHD utxo index. Otherwise it gets utxos from Bitbox

Projects

->New CSS designs

->Security review

-->Review handling of private keys, assess for XSS vulnerabilities, make recommendations for improvements

->Bug tracker

-->List of issues on https://github.com/memberapp/memberapp.github.io/issues, many are client only.

Server
------

The server currently consists of

Node.js program with option of MySQL or SQLite Database
Requires BCHD or Bitcoin Unlimited Node (other node software untested yet)

Testing
-------

->Regularly using Member from the perspective of a new user and reporting bugs and problems
->Using Member as a regular user and reporting bugs and problems
->Collecting bug reports from forums etc and entering them in the github bug tracking system.


Desktop App
-----------

The app will package a BCH node (BCHD), Server and Client. It should allow one click install and setup.

Projects

->Create User Friendly installer for various platforms
->Update BCHD to support utxoindex with fastsync 

Mobile Apps
-----------

Mobile apps will rely on a remote server. This might be a server provided by Member, or the member's own server.

Projects

->Iphone app

->Android app

Hosting
-------

->A host with good capacity and DDOS protection would be helpful to the project.

Financial
---------

Member is a non profit project. It is free to use and there won't be ads or data mining. However it's always helpful to have more funds for development and hosting. If you'd like to
help the project financially - buy some MEMBER tokens at the lowest available market rate here
https://memo.cash/token/766f9f56ac0a3f0e4c64cb3453d0c45336a20685827801b2188d237c2a6ffc43?for-sale

You'll appear on the top supporters page, here
https://memo.cash/token/766f9f56ac0a3f0e4c64cb3453d0c45336a20685827801b2188d237c2a6ffc43?balances

(The only use of MEMBER tokens is to hold them to appear higher on the top supporters page)
