

$(() => {
    const beerDb = $.ajax({
        url: "https://sandbox-api.brewerydb.com/v2/styles/?key=810aa77f346d134a1c964135c4564018"
    }).then(
        (data)=>{
            console.log(data[12]);

        },
        (error)=>{
            alert('error')
        })
})
