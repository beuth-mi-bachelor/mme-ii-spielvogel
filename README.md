# Exercise 3

## Repository

[!(https://cgmgit.beuth-hochschule.de/mduve/mme-ii)](https://cgmgit.beuth-hochschule.de/mduve/mme-ii)

## how to start

### running exercise 1

```
cd folder/named/a1
node server.js (PORTNUMBER)
```

Server now available under http://localhost:PORTNUMBER/ - if no port specified, default is 1337

Server should always say "Hello World!"

### running exercise 2

```
cd folder/named/a2
node server.js (PORTNUMBER)
```

Server now available under http://localhost:PORTNUMBER/ - if no port specified, default is 1337

Now all files below public/ folder are accessible as root dir

### running exercise 3

```
cd folder/containing/Gruntfile.js
grunt
```

- first runs in ex3/a3/src
- starts the server
- test runs looking for "Hello World!" at localhost:8080
- if success: copies "public" folder and minifies server.js both in "built" folder
