# rest-countries
Example of using the http://restcountries.eu/ API


# Important
* Install [Node.js LTS](https://nodejs.org/)
* Build and start: `npm run build`, `npm start`
* Run tests: `npm t`


# Notes for reviewer(s)
* I have tested in Chrome and not concerned myself with very small viewport sizes or other browsers.
* I assume that we have only American English speakers viewing this product.
* Optimizations are made for speed, network usage, and readability. Small amount of extra memory is used to keep things readable and understandable. You can search for "OPTIMIZATION:" in `App.js` to see where/how I chose to optimize.
* As of now, there is a single country with the most bordering countries (China). But I handle the case where that changes. See comment in `App.js` with "TEST" in it.
* I've written a few basic tests to show that I understand how Jest and Enzyme work, but I didn't put a huge effort into thoroughly testing every circumstance as I assume that the important thing is to show I understand the different techonology options and how to use them.
