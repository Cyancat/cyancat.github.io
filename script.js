'use strict';

$(function(){
  $("#convert").click(function() {
    var json = JSON.parse(
      $("#target").val()
        /* May be postman */
        .replace(/\\\\"/g, '"')
        .replace(/\\\\u[\da-z]{0,3}"/g, '"')
        /* 8200/_plugin/head/ */
        .replace(/\\"/g, '"')
        .replace(/\\u[\da-z]{0,3}"/g, '"')
    );

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
    $("#result").val(JSON.stringify(json));
  })
});

function flatten(json){
  for (var obj in json) {
    if (typeof json[obj] === 'object') {
      // console.log(obj);
      for (var obj_c in json[obj]) {

        // Filter valid property
        if (vali_var(obj_c)) {
          json[obj + '_' + obj_c] = json[obj][obj_c];
        }

        // Parse unixtime to readable format
        if (obj_c.indexOf('date') != -1) {
          json[obj + '_' + obj_c] = moment.unix(json[obj][obj_c]).format('Y-MM-DD') + '(' + json[obj][obj_c] + ')'
        }
        
      }
      delete json[obj];
    }
  }
  return json;
}

function vali_var(v) {
  var vali = [
    // quality
    'img_count',
    'attr_key_count',
    'source_count',
    'has_title_cn',
    'comments_count_jp',
    'product_click_count',
    'score_jp',
    'sales',
    'has_ean',
    // decay
    'is_released',
    'release_date',
    'create_date',
    // stock
    'has_mall_spot',
    'has_agent_new',
    'has_mall_presell',
    'has_amazon',
    'has_surugaya',
    // info
    'title_jp',
    'title_cn',
    'singleline_attrs',
    'multiline_attrs'
  ], result = false;
  vali.forEach(function(e){
    if ( e == v ){
      result = true;
    }
  });
  return result;
}
