

$(() => {
// const db = $('<iframe />', { id: 'myFrame', src: 'https://sandbox-api.brewerydb.com/v2/beers/?key=810aa77f346d134a1c964135c4564018' }).appendTo('body');
// console.log(db);
$.ajax({
        url: "https://swapi.co/api/starships/?name=Death Star"

    }).then(
        (data) =>{
            console.log(data);
    },
    (error) => {
        alert('error')
    })
})
