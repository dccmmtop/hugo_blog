var fuse; // holds our search engine
var fuseIndex;
var searchVisible = false; 
var firstRun = true; // allow us to delay loading json data unless search activated
var resultsAvailable = false; // Did we get any search results?

$(function(){
  loadSearch()
  $("#search").keypress(function (e) {
    if (e.which == 13) {
      executeSearch($("#inputSearch").val());
    }
  });
})


// ==========================================
// fetch some json without jquery
//
function fetchJSONFile(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function() {
    if (httpRequest.readyState === 4) {
      if (httpRequest.status === 200) {
        var data = JSON.parse(httpRequest.responseText);
        if (callback) callback(data);
      }
    }
  };
  httpRequest.open('GET', path);
  httpRequest.send(); 
}


// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function loadSearch() { 
  console.log('loadSearch()')
  fetchJSONFile('/index.json', function(data){

    var options = { // fuse.js options; check fuse.js website for details
      shouldSort: true,
      location: 0,
      distance: 100,
      threshold: 0.4,
      minMatchCharLength: 2,
      keys: [
        'permalink',
        'title',
        'tags',
        'contents'
      ]
    };
    // Create the Fuse index
    fuseIndex = Fuse.createIndex(options.keys, data)
    fuse = new Fuse(data, options, fuseIndex); // build the index from the json file
  });
}


// ==========================================
// using the index we loaded on CMD-/, run 
// a search query (for "term") every time a letter is typed
// in the search box
//
function executeSearch(term) {
  let results = fuse.search(term); // the actual query being run using fuse.js
  let searchitems = ''; // our results bucket

  if (results.length === 0) { // no results based on what was typed into the input box
    resultsAvailable = false;
    searchitems = '空空如也';
  } else { // build our html
    console.log(results)
    permalinks = [];
    numLimit = 50000;
    for (let item in results) { // only show first 5 results
      if (item > numLimit) {
        break;
      }
      if (permalinks.includes(results[item].item.permalink)) {
        continue;
      }
      //   console.log('item: %d, title: %s', item, results[item].item.title)
      // searchitems = searchitems + '<li><a href="' + results[item].item.permalink + '" tabindex="0">' + '<span class="title">' + results[item].item.title + '</span></a></li>';
      searchitems = searchitems + '<a href="' + results[item].item.permalink + '" tabindex="0">' + '<span class="title">' + results[item].item.title + '</span></a><br>';
      permalinks.push(results[item].item.permalink);
    }
    resultsAvailable = true;
    console.log("show")
  }

  // document.getElementByClass("searchResults").innerHTML = searchitems;
  $(".searchResults").html(searchitems);
  $('#exampleModal').modal('show')
}
