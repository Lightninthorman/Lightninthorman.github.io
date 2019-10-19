//===================
//    Global Variables
//===================

let searchInput = "";
let searchBtn = "";
let breweryId = "";



//===================
//    On-Load
//===================
$(() => {
    //=====
    //AJAX
    //=====
    const beerDb = () => {
        if(searchInput === ""){
            return
        }
        $.ajax({
            url: "https://sandbox-api.brewerydb.com/v2/" + searchBtn +"/?key=810aa77f346d134a1c964135c4564018&withBreweries=y&withLocations=y&withIngredients=y&name=" + searchInput + "*"

        }).then(
            (data) =>{
                console.log(data.data);
                if(searchBtn === 'beers'){
                    beerCheck(data);
                }else if(searchBtn === 'breweries'){
                    breweryCheck(data);
                }
        },
        (error) => {
            alert('error')
        })
    }
    const breweryBeersDb = () => {
        $.ajax({
            url: "https://sandbox-api.brewerydb.com/v2/brewery/" + breweryId + "/beers/?key=810aa77f346d134a1c964135c4564018"

        }).then(
            (data) =>{
                addBeerList(data)
        },
        (error) => {
            alert('error')
        })

    }
//===================
//    Functions
//===================
    //=====
    //fuction to run when searching for beer
    //=====
    const beerCheck = (data) => {
        let beer = data.data[0]
        //verify if label data provided
        if(beer.labels == undefined){
            // if no label provided post a cartoon picture of beer
            let $labelImg = $('<img>').attr('src','imgs/beerNoImage.png')
            $('#col1').append($labelImg)
        }else{
            // if label is provided then access it and append it to the column
            let $labelImg = $('<img>').attr('src',beer.labels.contentAwareMedium)
            $('#col1').append($labelImg)
        }
        let $beerName = $('<h3>').html(beer.name + '  |  abv. ' + beer.abv + '%')
        $('#col2').append($beerName)
        //create the list of data points to return
        let $resultsList = $('<ul>')
        let $style = $('<li>').html('Style: <br>' + beer.style.name)
        let $description = $('<li>').html('Description: <br>' + beer.description)
        let $ibu = $('<li>').html('IBU: ' + beer.ibu)

        //append list to column
        $('#col2').append($($resultsList).append($style).append($description).append($ibu))
        //verify if hop data provided
        if(beer.ingredients == undefined){
            //if no hop data provided add text explaining
            $('#col2').append($('<p>').html("Hops: No hop profile provided"))
        }else {
            //if hop data provided, loop through ingredients array and list the hops in the beer
            let hops = beer.ingredients.hops
            let hopProfile = "Hops: "
            for (i = 0; i < hops.length; i++){
                hopProfile += hops[i].name + '  |  '
            }
        $('#col2').append($('<p>').html(hopProfile))
        }
        //add brewery image
        let $breweryImg = $('<img>').attr('src', data.data[0].breweries[0].images.squareMedium)
        let $breweryName = $('<p>').html(data.data[0].breweries[0].name)
        let $website = $('<a>').attr('href',data.data[0].breweries[0].website).html(data.data[0].breweries[0].website)
        $('#col3').append($breweryImg).append($breweryName).append($website)
        //clear the ajax Variables
        searchBtn = ""
    }

    //=====
    //fuction to run when searching for brewery
    //=====
    const breweryCheck = (data) => {
        let brewery = data.data[0]
        //col1 elements
        let $breweryImg = $('<img>').attr('src',brewery.images.squareMedium).css('display','block');
        let $website = $('<a>').attr('href',brewery.website).html(brewery.website);
        //build the address from multiple keys in the API
        let $location = $('<p>').html(brewery.locations[0].streetAddress + '</br>' + brewery.locations[0].locality + ', ' + brewery.locations[0].region + ' ' + brewery.locations[0].postalCode);
        //add all col1 data to col1
        $('#col1').append($breweryImg).append($website).append($location)

        //col2 elements
        let $breweryName = $('<h3>').html(brewery.name)
        $('#col2').append($breweryName)
        //create the list of data points to return
        let $resultsList = $('<ul>')
        let $description = $('<li>').html(brewery.description)
        let $established = $('<li>').html('Established: ' + brewery.established)

        $('#col2').append($resultsList.append($description).append($established))
        //col3 elements.
        breweryId = brewery.id
        $('#col3').append('<h3>').html('Beers brewed by ' + brewery.nameShortDisplay)
        breweryBeersDb()
        // console.log(breweryBeers[0]);
        // $('#col3').html(breweryBeers[0].name)
        //clear the ajax Variables
        searchBtn = ""
    }

    const addBeerList = (data) => {
        let beers = data.data;
        console.log(beers.length);
        const $beerList = $('<ul>')
        $('#col3').append($beerList)
        for(let i = 0; i < beers.length; i++){
            $beerList.append($('<li>').html(beers[i].name).addClass('breweryBeers'))
        }
        $('#col3').append($beerList)
    }

    $('#beerBtn').on('click', () => {
        searchInput = $('input').val()
        searchBtn   = 'beers'
        $('input').val('')
        $('.col').empty()
        beerDb()
    })

    $('#breweryBtn').on('click', () => {
        searchInput = $('input').val();
        searchBtn = 'breweries'
        $('input').val('');
        $('.col').empty()
        beerDb()
    })

})
