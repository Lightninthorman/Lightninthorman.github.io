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
// const db = $('<iframe />', { id: 'myFrame', src: 'https://sandbox-api.brewerydb.com/v2/beers/?key=810aa77f346d134a1c964135c4564018' }).appendTo('body');
// console.log(db);
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
//===================
//    Functions
//===================
    //=====
    //fuction to run when searching for beer
    //=====
    const beerCheck = (data) => {
        //verify if label data provided
        if(data.data[0].labels == undefined){
            // if no label provided post a cartoon picture of beer
            let $labelImg = $('<img>').attr('src','imgs/beerNoImage.png')
            $('#col1').append($labelImg)
        }else{
            // if label is provided then access it and append it to the column
            let $labelImg = $('<img>').attr('src',data.data[0].labels.contentAwareMedium)
            $('#col1').append($labelImg)
        }
        //create the list of data points to return
        let $resultsList = $('<ul>')
        let $beerName = $('<li>').html(data.data[0].name + '  |  abv. ' + data.data[0].abv + '%')
        let $style = $('<li>').html('Style: <br>' + data.data[0].style.name)
        let $description = $('<li>').html('Description: <br>' + data.data[0].description)
        let $ibu = $('<li>').html('IBU: ' + data.data[0].ibu)

        //append list to column
        $('#col2').append($($resultsList).append($beerName).append($style).append($description).append($ibu))
        //verify if hop data provided
        if(data.data[0].ingredients == undefined){
            //if no hop data provided add text explaining
            $('#col2').append($('<p>').html("Hops: No hop profile provided"))
        }else {
            //if hop data provided, loop through ingredients array and list the hops in the beer
            let hops = data.data[0].ingredients.hops
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
        console.log(data.data[0]);
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
