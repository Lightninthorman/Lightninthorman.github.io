let searchInput = "";
let searchBtn = "";

let breweryId = "";

$(() => {
// const db = $('<iframe />', { id: 'myFrame', src: 'https://sandbox-api.brewerydb.com/v2/beers/?key=810aa77f346d134a1c964135c4564018' }).appendTo('body');
// console.log(db);
    const runDb = () => {
            $.ajax({
                url: "https://sandbox-api.brewerydb.com/v2/" + searchBtn + "/" + "?key=810aa77f346d134a1c964135c4564018&name=" + searchInput

            }).then(
                (data) =>{
                    $('#col1').append($('<img>').attr('src',data.data[0].labels.contentAwareLarge))

            },
            (error) => {
                alert('error')
        })
    }

    $('#beerBtn').on('click', () => {
        searchBtn='beers'
        searchInput = $('input').val()
        $('input').val('')
        runDb()
    })

})
