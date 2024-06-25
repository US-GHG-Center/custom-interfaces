const producers = [
    'Avicii',
    'Martin Garrix',
    'Don Diablo',
    'Tiesto',
    'Calvin Harris',
    'Hardwell',
    'Steve Aoki',
    'David Guetta',
    'Zedd',
    'Afrojack',
    'Dimitri Vegas & Like Mike',
    'The chainsmokers',
    'KSMHR',
    'Oliver Heldens',
    'R3hab',
    'Lost Frequencies'
  ]

function handleSearch (keyword) {
let producers_copy = producers.slice()
producers_copy.sort((a, b) => {
    return getSimilarity(b, keyword) - getSimilarity(a, keyword)
})
producers_copy = producers_copy.filter(producer => {
    return getSimilarity(producer, keyword) > 0
  })
return producers_copy
}


function getSimilarity (data, keyword) {
data = data.toLowerCase()
keyword = keyword.toLowerCase()
return data.length - data.replace(new RegExp(keyword, 'g'), '').length
}

function drawProducerList (_producers) {
    $('.autocomplete-search-box .search-result').html('')
    for (let i = 0; i < _producers.length; i++) {
      $('.autocomplete-search-box .search-result').append(`<li class="plume_ids">${_producers[i]}</li>`)
    }
  }




  document.addEventListener("click", function (e) {
    if (e.target && e.target.nodeName === "LI" && e.target.classList.contains('plume_ids')) {
        let text = e.target.textContent || e.target.innerText
        $('.search-box').val(text);
        drawProducerList([])
    }

});
window.addEventListener('load', (_) => {

    let typingTimeout = null;
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
    $('.search-box').keyup((e) => {
        console.log($(e.target).val());
        const copy_procedures = handleSearch($(e.target).val())
        drawProducerList(copy_procedures);
      })
    },500);
      /*execute a function when someone clicks in the document:*/


});