



//===================
//    On-Load
//===================
$(() => {

    $('body').css('height', $(window).height() + 'px')

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
                        searchCheck(data, searchBtn)
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


        $('#col1').css('display','none')
        $('#col3').css('display','none')
        if(data.data == undefined){
            $('#col2').append($('<ul>').html('No results for ' + searchBtn +' found').css({'font-weight':'bold'}));
            return
        }else{
            const searching = data.data
            const $list = $('<ul>').html('Search results for ' + searchBtn +':').css({'font-weight':'bold'});
            // console.log(searching);

            $('#col2').append($list)
            for(i = 0; i < searching.length; i++){
                const $option = $('<li>').html(searching[i].name)
                $option.addClass('searchList')
                $option.attr('data-name', searching[i].name)
                $option.attr('data-button',searchBtn)
                $($list).append($option)
            }
        }
        if($(document).height() > $(window).height()){
            $('body').css('height', $(document).height() + 'px')
        }else{
            $('body').css('height', $(window).height() + 'px')
        }
        //wait until both the brewery and beer search results have loaded before seeing if there is only one result.
        if($('#col2').children().length > 1){
            oneResultFound()
        }
    }

    //=====
    //fuction for one result found during dynamic search
    //=====

    const oneResultFound = () => {

        //this code is so wet, but still, it checks if there is only one result and then loads that result.
        const result1 = $('#col2').children().eq(0).children()
        const result2 = $('#col2').children().eq(1).children()
        if(result1.length === 1 && result2.length === 0 ){
            $('#col1').css('display','flex')
            $('#col3').css('display','flex')
            const dynamicSearch = false
            const searchInput = $('input').val();
            const searchBtn = $result1.eq(0).attr('data-button')
            $('input').val('');
            $('.col').empty();
            beerDb(dynamicSearch, searchBtn, searchInput)
            return
        }else if(result2.length === 1 && result1.length === 0 ){
            $('#col1').css('display','flex')
            $('#col3').css('display','flex')
            const dynamicSearch = false
            const searchInput = $('input').val();
            const searchBtn = result2.eq(0).attr('data-button')
            $('input').val('');
            $('.col').empty();
            beerDb(dynamicSearch, searchBtn, searchInput)
            resize()
            return
        }
    }

    //=====
    //fuction to run when searching for beer
    //=====
    const beerCheck = (data) => {

        //verify if any search results were found
        if(data.data == undefined){
            $('#col2').html('<span>No beer results found</span>')
            return
        }
        $('#col1').css('display','flex')
        $('#col3').css('display','flex')
        console.log($(window).height() + " window");
        console.log($('body').height());
        let beer = data.data[0]
        searchHistory(beer.name, 'beers')
        //verify if label data provided
        if(beer.labels == undefined){
            // if no label provided post a cartoon picture of beer
            let $labelImg = $('<img>').attr('src','imgs/beerNoImage.png').css('box-shadow','none')
            $('#col1').append($labelImg)

        }else if(beer.labels.contentAwareMedium == undefined){
            let $labelImg = $('<img>').attr('src',beer.labels.medium)
            $('#col1').append($labelImg)
        }else{
            // if label is provided then access it and append it to the column
            let $labelImg = $('<img>').attr('src',beer.labels.contentAwareMedium)
            $('#col1').append($labelImg)
        }

        console.log($(window).height() + " window after");
        console.log($('body').height());
        let $beerName = $('<h3>').html(beer.name + '  |  abv. ' + beer.abv + '%')
        $('#col2').append($beerName)
        //create the list of data points to return
        let $resultsList = $('<ul>')
        let $style =  $('<li>').addClass('aboutBeer')
        if(beer.style === undefined){
             $style = $style.html('<span>Style:</span> No style provided')
        }else{
             $style = $style.html('<span>Style:</span><br>' + beer.style.name)
        }
        let $description = $('<li>').html('<span>Description:</span><br>' + beer.description).addClass('aboutBeer')
        let $ibu = $('<li>').html('<span>IBU:</span> ' + beer.ibu).addClass('aboutBeer')

        //append list to column
        $('#col2').append($($resultsList).append($style).append($description).append($ibu))
        //verify if hop data provided
        if(beer.ingredients == undefined){
            //if no hop data provided add text explaining
            $('#col2').append($('<p>').html("<span>Hops:</span> No hop profile provided"))
        }else {
            //if hop data provided, loop through ingredients array and list the hops in the beer
            const hops = beer.ingredients.hops
            const $hopProfile = $('<ul>').html('<span>Hops:</span> (Click on a hop to learn more about it)<br> ')
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
        //ensure the backgound covers the whole page with results
        resize()
        // add search item to previoius search list
        // localStorage.setItem('name', beer.name)
        // searchList()
    }

    //=====
    //fuction to run when searching for brewery
    //=====
    const breweryCheck = (data) => {

        //verify if any search results were found
        if(data.data == undefined){
            $('#col2').html('<span>No brewery results found</span>')
            return
        }
        $('#col1').css('display','flex')
        $('#col3').css('display','flex')

        let brewery = data.data[0]
        searchHistory(brewery.name, 'breweries')
        //col1 elements
        let $breweryImg = $('<a>').attr('href',brewery.website).append($('<img>').attr('src',brewery.images.squareMedium).css('display','block'));
        let $website = $('<a>').attr('href',brewery.website).html(brewery.website);
        //build the address from multiple keys in the API
        let $location = $('<a>').html(brewery.locations[0].streetAddress + '</br>' + brewery.locations[0].locality + ', ' + brewery.locations[0].region + ' ' + brewery.locations[0].postalCode).attr('href','https://www.google.com/maps/search/?api=1&query=' + brewery.locations[0].streetAddress + brewery.locations[0].locality + brewery.locations[0].region + brewery.locations[0].postalCode )
        //add all col1 data to col1
        $('#col1').append($breweryImg).append($website).append($location)

        //col2 elements
        let $breweryName = $('<h3>').html(brewery.name)
        $('#col2').append($breweryName)
        //create the list of data points to return
        let $resultsList = $('<ul>')
        let $description = $('<li>').html(brewery.description)
        let $established = $('<li>').html('<br><span>Established:</span> ' + brewery.established)

        $('#col2').append($resultsList.append($description).append($established))
        //col3 elements.
        let breweryId = brewery.id
        $('#col3').append('<h3>').html('<span>Beers brewed by</span> ' +'<span>' +  brewery.nameShortDisplay + '</span>')
        resize()
        breweryBeersDb(breweryId)
        resize()
        //ensure the backgound covers the whole page with results

        // add search item to previoius search list

        // searchList(brewery.name, 'beers')

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
        resize()
    }

    //=====
    //function to show hops modal
    //=====
    const hopModal = (data) => {
        $('.hopDisplay').empty();
        const hop = data.data
        //get grey background to cover the whole background
        $('.hopModal').css('height', $(window).height() + 'px')
        $('.hopModal').toggleClass('hopVisible')
        // $('.hopModal').css({'visibility':'visible','opacity':'1'})
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
        $('.hopDisplay').append($('<img>').attr('src','imgs/wheatAndHops(3).png'))
        $('.hopDisplay').append($('<h3>').html(hop.name))
        $('.hopDisplay').append($('<p>').html("<span>Country of Origin:</span> " + countryOrigin + "<br><br><span>Description:</span><br>" + description))
        $('.hopDisplay').append($('<button>').attr('id','closeModal').addClass('button').html('Close'))
        $('.hopModal').css('height', $(document).height());

    }


    //=====
    //function to resize background
    //=====
    const resize = () => {
        if(($('header').height() + $('main').height() + 60) < $(window).height()){
            $('body').css('height', $(window).height() + 'px')
        }else{
            $('body').css('height', ($('header').height() + $('main').height()) + 80 +'px')
        }
    }
    //=====
    //function to store searches in search history
    //=====
    const searchHistory = (searchInput,searchBtn) => {
        let history = [];
        $('.searchHistory').empty()
        if(localStorage.length > 0){
            history = JSON.parse(localStorage.getItem('search'))
        }
        if(history.length >= 5){
            history.pop()
        }

        history.unshift({
            name: searchInput,
            type: searchBtn
        })

        const $searchList = $('<ul>')
        for(let i = 0; i < history.length; i++){
            const $search = $('<li>').html(history[i].name).attr('data-button',history[i].type)
            $searchList.append($search)
        }
        $('.searchHistory').append($searchList)
        $('.searches').css('visibility','visible')
        localStorage.setItem('search',JSON.stringify(history))
        console.log(JSON.parse(localStorage.getItem('search')));
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
        //bring user to top of page
        window.scrollTo(0,0)
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
        $('.col').empty();
        //bring user to top of page
        window.scrollTo(0,0);
        beerDb(dynamicSearch, searchBtn, searchInput)
    })
    //click on a beer in the beer list on the brewery page and go to that beer page
    $('.col').on('click','.breweryBeers',(event) => {
        const dynamicSearch = false
        const searchInput = $(event.target).html()
        const searchBtn   = 'beers'
        $('.col').empty();
        //bring user to top of page
        window.scrollTo(0,0);
        beerDb(dynamicSearch, searchBtn, searchInput)
    })
    //click on item in search history to revisit
    $('.searchHistory').on('click',(event) => {
        const dynamicSearch = false
        const searchInput = $(event.target).html()
        const searchBtn   = $(event.target).attr('data-button')
        $('.col').empty();
        //bring user to top of page
        window.scrollTo(0,0);
        beerDb(dynamicSearch, searchBtn, searchInput)
    })

    //click on a hop and modal pops up with hop information
    $('#col2').on('click','.hopList',(event) => {

        const hopId = $(event.target).attr('data-hopId')
        console.log(hopId);
        hopsDb(hopId)
    })

    //this will close the hops modal window
    $('body').on('click','#closeModal', () => {
        $('.hopModal').toggleClass('hopVisible')
    })

    $('#clear').on('click',() => {
        $('.searchHistory').empty()
        $('.searches').css('visibility','hidden')
        window.scrollTo(0,0);
        localStorage.clear()

    })
    //resize background when elements are added or removed or when window is resized
    $(window).on('resize', resize)

    $(document).scroll(resize)
    // $('.hopModal').on('click', () => {
    //     $('.hopModal').toggle()
    // })
})
