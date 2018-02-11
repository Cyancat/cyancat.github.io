'use strict';

$(function(){
  $("#convert").click(function() {
    var json = JSON.parse($("#target").val());

    // Specially deal with the ES's result
    // console.log(json.hits instanceof Array);
    if (json.hits.hits instanceof Array) {
      json = json.hits.hits;
    }

    // Flatten
    if (json instanceof Array) {
      json.forEach(function(e, i){
        json[i] = flatten(e);
      })
    } else {
      json = flatten(json);
    }

    // Return the result
    $("#result").html(JSON.stringify(json));
  })
});

function flatten(json){
  for (var obj in json) {
    if (typeof json[obj] === 'object') {
      // console.log(obj);
      for (var obj_c in json[obj]) {
        json[obj + '_' + obj_c] = json[obj][obj_c];
      }
      delete json[obj];
    }
  }
  return json;
}
