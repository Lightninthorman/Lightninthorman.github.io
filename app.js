



//===================
//    On-Load
//===================
$(() => {
    //=====
    //AJAX
    //=====
    const beerDb = (dynamicSearch,searchBtn, searchInput) => {
        if(searchInput === ""){
            return
        }
        $.ajax({
            url: "https://sandbox-api.brewerydb.com/v2/" + searchBtn +"/?key=810aa77f346d134a1c964135c4564018&withBreweries=y&withLocations=y&withIngredients=y&name=" + searchInput + "*"

        }).then(
            (data) =>{
                if(dynamicSearch === true){
                    // if(data.data === undefined){
                        searchCheck(data, searchBtn)
                //     }else{
                //             searchCheck(data,searchBtn)
                //             return
                //         // else{
                //         //     if(searchBtn === 'beers'){
                //         //         $('.col').empty()
                //         //         beerCheck(data)
                //         //         return
                //         //     }else{
                //         //         $('.col').empty()
                //         //         breweryCheck(data)
                //         //         return
                //         //     }
                //         // }
                //     }
                }

                if(dynamicSearch === false){
                    if(searchBtn === 'beers'){
                        beerCheck(data);
                        return
                    }else if(searchBtn === 'breweries'){
                        breweryCheck(data);
                        return
                    }
                }

            },
            (error) => {
                alert('error')
            })
    }
    //brewery beer list
    const breweryBeersDb = (breweryId) => {
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

    //specific hop details
    const hopsDb = (hopId) => {
        $.ajax({
            url: "https://sandbox-api.brewerydb.com/v2/hop/" + hopId + "/?key=810aa77f346d134a1c964135c4564018"

        }).then(
            (data) =>{
                hopModal(data)
        },
        (error) => {

        })

    }
//===================
//    Functions
//===================
    //=====
    //fuction for dynamic rendering of search
    //=====
    const searchCheck = (data,searchBtn) => {



        if(data.data == undefined){
            $('#col2').append($('<ul>').html('No results for ' + searchBtn +' found'));
            return
        }else{
            const searching = data.data
            const $list = $('<ul>').html('Search results for ' + searchBtn +':')
            // console.log(searching);

            $('#col2').append($list)
            for(i = 0; i < searching.length; i++){
                const $option = $('<li>').html(searching[i].name)
                $option.addClass('searchList')
                $option.attr('data-name', searching[i].name)
                $option.attr('data-button',searchBtn)
                $($list).append($option)
            }
            //this code is so wet, but still, it checks if there is only one result and then loads that result.
            const breweryResults = $('#col2').children().eq(0).children()
            const beerResults = $('#col2').children().eq(1).children()
            console.log(breweryResults.length);
            if(breweryResults.length === 1 && beerResults.length === 0 ){
                const dynamicSearch = false
                const searchInput = $('input').val();
                const searchBtn = 'breweries'
                $('input').val('');
                $('.col').empty();
                beerDb(dynamicSearch, searchBtn, searchInput)
                return
            }else if(beerResults.length === 1 && breweryResults.length === 0 ){
                const dynamicSearch = false
                const searchInput = $('input').val();
                const searchBtn = 'beers'
                $('input').val('');
                $('.col').empty();
                beerDb(dynamicSearch, searchBtn, searchInput)
                return
            }

        }

    }

    //=====
    //fuction to run when searching for beer
    //=====
    const beerCheck = (data) => {
        //verify if any search results were found
        if(data.data == undefined){
            $('#col2').html('No beer results found')
            return
        }
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
            const hops = beer.ingredients.hops
            const $hopProfile = $('<ul>').html('Hops: ')
            $('#col2').append($hopProfile)
            for (i = 0; i < hops.length; i++){
                $hopProfile.append($('<li>').text(hops[i].name + '  |').addClass('hopList').attr('data-hopId',hops[i].id))
            }
        }
        //add brewery image
        let $breweryImg = $('<img>').attr('src', beer.breweries[0].images.squareMedium).attr('data-brewery',beer.breweries[0].name).addClass('beerPageBreweryInfo')
        let $breweryName = $('<p>').html(beer.breweries[0].name).attr('data-brewery',beer.breweries[0].name).addClass('beerPageBreweryInfo')
        let $website = $('<a>').attr('href',beer.breweries[0].website).html(beer.breweries[0].website)
        $('#col3').append($breweryImg).append($breweryName).append($website)
    }

    //=====
    //fuction to run when searching for brewery
    //=====
    const breweryCheck = (data) => {
        //verify if any search results were found
        if(data.data == undefined){
            $('#col2').html('No brewery results found')
            return
        }

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
        let breweryId = brewery.id
        $('#col3').append('<h3>').html('Beers brewed by ' + brewery.nameShortDisplay)
        breweryBeersDb(breweryId)

    }
    //=====
    //function to add beer list on the brewery page
    //=====
    const addBeerList = (data) => {
        const beers = data.data;
        console.log(beers.length);
        const $beerList = $('<ul>')
        $('#col3').append($beerList)
        for(let i = 0; i < beers.length; i++){
            $beerList.append($('<li>').html(beers[i].name).addClass('breweryBeers'))
        }
        $('#col3').append($beerList)
    }

    //=====
    //function to show hops modal
    //=====
    const hopModal = (data) => {
        $('.hopDisplay').empty();
        const hop = data.data
        //get grey background to cover the whole background
        $('.hopModal').css('height', $(window).height() + 'px')

        $('.hopModal').css('display','block')
        let countryOrigin = ""
        let description = hop.description
        //code to deal with any incomplete data in the API
        if (hop.country == undefined) {
            countryOrigin = "No data provided"
        }else{
            countryOrigin = hop.country.displayName
        }
        if (description == undefined) {
            description = "No description provided"
        }
        //display data (or lack there of) in the modal
        $('.hopDisplay').append($('<h3>').html(hop.name))
        $('.hopDisplay').append($('<p>').html("Country of Origin: " + countryOrigin + "<br></br>" + description))
        $('.hopDisplay').append($('<button>').attr('id','closeModal').html('Close'))

    }



//===================
//    Events
//===================
    $('input').on('keyup', () => {
        $('.col').empty()
        const dynamicSearch = true
        const searchBtnOptions = ['beers','breweries']
        const searchInput = $('input').val();
        if(searchInput.length >= 3){
            for(let i = 0; i < searchBtnOptions.length; i++){
                const searchBtn = searchBtnOptions[i]
                beerDb(dynamicSearch, searchBtn, searchInput)
            }
        }else{
            return
        }
    })

    //click event for dynamic search Results
    $('body').on('click','.searchList',(event) => {
        const dynamicSearch = false
        const searchInput = $(event.target).attr('data-name')
        const searchBtn = $(event.target).attr('data-button')
        $('input').val('');
        $('.col').empty();
        beerDb(dynamicSearch, searchBtn, searchInput)
    })

    $('.beerBtn').on('click', () => {
        const dynamicSearch = false
        const searchInput = $('input').val();
        const searchBtn = 'beers'
        $('input').val('');
        $('.col').empty();
        beerDb(dynamicSearch, searchBtn, searchInput)
    })

    $('.breweryBtn').on('click', () => {
        const dynamicSearch = false
        const searchInput = $('input').val();
        const searchBtn = 'breweries'
        $('input').val('');
        $('.col').empty();
        beerDb(dynamicSearch, searchBtn, searchInput)
    })
    //click on image or brewery name on beer search page and go to brewery page
    $('#col3').on('click','.beerPageBreweryInfo', (event) => {
        const dynamicSearch = false
        const searchInput = $(event.target).attr('data-brewery')
        const searchBtn   = 'breweries'
        $('.col').empty();;
        beerDb(dynamicSearch, searchBtn, searchInput)
    })
    //click on a beer in the beer list on the brewery page and go to that beer page
    $('.col').on('click','.breweryBeers',(event) => {
        const dynamicSearch = false
        const searchInput = $(event.target).html()
        const searchBtn   = 'beers'
        $('.col').empty();
        beerDb(dynamicSearch, searchBtn, searchInput)
    })

    //click on a hop and modal pops up with hop information
    $('#col2').on('click','.hopList',(event) => {

        const hopId = $(event.target).attr('data-hopId')
        console.log(hopId);
        hopsDb(hopId)
    })

    //either of these two options will close the hops modal window
    $('body').on('click','#closeModal', () => {
        $('.hopModal').css('display','none')
    })

    // $('.hopModal').on('click', () => {
    //     $('.hopModal').toggle()
    // })
})
