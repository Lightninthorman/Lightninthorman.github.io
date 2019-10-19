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
                        console.log(data);
                        for(let i = 0; i < data.data.length;i++)
                        console.log(data.data[i].name);

            },
            (error) => {
                alert('error')
        })
    }

    $('#beerBtn').on('click', () => {
        searchBtn='beers'
        searchInput = $('input').val()
        $(this).val('')
        runDb()
    })

})
