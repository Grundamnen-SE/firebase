db.ref("elements").once("value").then(function(data){
  var playbtn = data.val();
  for (var key in playbtn) {
    if (!playbtn.hasOwnProperty(key)) continue;
    var obj = playbtn[key];
    if (obj.playbtn) $('td[data-name="'+obj.element+'"]').find(".atomic_number").after('<img class="yt" src="/img/play.svg">');
  }
});
