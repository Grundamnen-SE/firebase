db.ref("elements").once("value").then(function(data){
  var playbtn = [];
  for (var key in data.val()) {
    if (!data.val().hasOwnProperty(key)) continue;
    var obj = data.val()[key];
    if (obj.playbtn) {
      $('td[data-name="'+obj.element+'"]').find(".atomic_number").after('<img class="yt" src="/img/play.svg">');
      playbtn.push(obj.element);
    }
  }
  console.log("Playbtn: ", playbtn);
});
