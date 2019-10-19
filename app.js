let searchInput = "";
let searchBtn = "";
let breweryId = "";

$(() => {
// const db = $('<iframe />', { id: 'myFrame', src: 'https://sandbox-api.brewerydb.com/v2/beers/?key=810aa77f346d134a1c964135c4564018' }).appendTo('body');
// console.log(db);
    const beerDb = () => {
            $.ajax({
                url: "https://sandbox-api.brewerydb.com/v2/beers/?key=810aa77f346d134a1c964135c4564018&withIngredients=y&name=" + searchInput + "*"

            }).then(
                (data) =>{
                    console.log(data.data);
                    let $labelImg = $('<img>').attr('src',data.data[0].labels.contentAwareMedium)
                    $('#col1').append($labelImg)
                    let $resultsList = $('<ul>')
                    let $beerName = $('<li>').html(data.data[0].name + '  |  abv. ' + data.data[0].abv + '%')
                    let $style = $('<li>').html('Style: <br>' + data.data[0].style.name)
                    let $description = $('<li>').html('Description: <br>' + data.data[0].description)
                    let $ibu = $('<li>').html('IBU: ' + data.data[0].ibu)


                    $('#col2').append($($resultsList).append($beerName).append($style).append($description).append($ibu))
                    if(data.data[0].ingredients == undefined){
                        $('#col2').append($('<p>').html("Hops: No hop profile provided"))
                    }else {
                        let hops = data.data[0].ingredients.hops
                        let hopProfile = "Hops: "
                        for (i = 0; i < hops.length; i++){
                            hopProfile += hops[i].name + '  |  '
                        }
                    $('#col2').append($('<p>').html(hopProfile))
                    }


            },
            (error) => {
                alert('error')
        })
    }

    $('#beerBtn').on('click', () => {
        searchInput = $('input').val()
        $('input').val('')
        $('.col').empty()
        beerDb()
    })

})
