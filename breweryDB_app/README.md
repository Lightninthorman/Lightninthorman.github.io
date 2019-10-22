# Beer Detective App

## About
Using the BreweryDB API the Beer Detective app lets you search for that beer you just tried or learn more about that brewery you heard someone talking about. 

The html is very simple consisting of a header for the search fields, a main wrapper that contains the 3 columns for displaying information, and a modal that is hidden initally. The rest of the elements are poupulated using jQuery. The styling is mostly done with CSS as well as the button and modal animations.

There is a dynamic search function that makes clicking the search buttons almost obsolete. Though if the dynamic search lists multiple beers or breweries, clicking either the 'find my beer' or 'find my brewery' button will display the first result listed for that category. An example of where this has been helpful is when searching for Sierra Nevada brewery, but they also have a beer that starts with Sierra Nevada. Instead of typing out all of Sierra Nevada Brewing, just click on 'find my brewery' and it will select the brewery result.

## Important:
Due to a cross origin resource sharing issue the database can only be reached with a proxy or by installing an extension to chrome. There are backend resolutions to this problem, but the API developers specifically state in their documentation that they do not respond to requests for front-end solutions. At this time I do not have the backend knowledge to address this, but will make an update when I am able to. 
I used the proxy option, but found that the lag time was not optimal for creating a dynamic search. Instead I installed the chrome extension that can be found here:
https://chrome.google.com/webstore/detail/moesif-orign-cors-changer/digfbfaphojjndkpccljibejjbppifbc?hl=en-US



### The App:

## [Beer Detective](https://lightninthorman.github.io/breweryDB_app/)

### Beer Result
When reading about a beer click on the list of hops (if they have provided that information) and a modal will appear describing the hop to give you a better idea what that hop is adding to the beer.

Click on the brewery image or name to switch to the brewery database and learn more about the brewery.

Click on the website to visit the brewery homepage.

### Brewery Result
When reading about a brewery click on the brewery image or the website link to be taken to the brewery homepage.

Click on the brewery address to open the location in google maps.

The list of beers in the right hand column can be clicked on and will take you to the beer information about that beer.

## Pros
I'm pretty excited that the functionality is all there. If you remove some of the touchiness of it (probably due to the super soaking wet code) it does what I want it to do. I mean that's pretty awesome in and of itself, it's only been three weeks of learning.

## Cons

I know several ways how I would DRY up my code. Creating a function with three if/else's to put in for my button click events would allow me to use one click event for clicking either button, or selecting an item from the dynamic search list.

If a beer has '&' in the title it screws up my search. I came across at least one like that. Did not have time to fix that issue. I think I would search the string for any offending character like & and would then add the corresponding % value. if anyone is interested in 30th Anniversary - Charlie, Fred & Ken's Bock just type up to the &, dynamic search should do the rest.

if you type too fast the dynamic search gets bogged down and repeats results and doesn't quite work right. I think it's just that I have the computer doing a lot of computing with every keystroke and it gets all wonky. 

If there's time I'm going to look into local storage, but an issue with populating the pages with jQuery is that there is no back button. If you click on something you didn't mean to it's not the easiest to get back to where you were.
