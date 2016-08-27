$(document).on("ready", function(){
  database.ref("elements").once("value").then(function(data){
    console.log("playbtn", data.val());
    var playbtn = data.val();
    var allelms = [];
    $(".tab1 td").each(function(i,o){
    if (!$(this).hasClass("td-extend") &&
        !$(this).hasClass("td-header") &&
        !$(this).hasClass("td-none") &&
        !$(this).hasClass("td-about") &&
        !$(this).hasClass("td-logo")) {

        var nr = $(this).find(".atomic_number").text();
        var name = $(this).find(".atomic_text").text();
        $(this).attr("data-number", nr);
        $(this).attr("data-name", name);
        $(this).attr("data-iselm", "true");
        allelms.push(name);
      }
    });
    for (var key in playbtn) {
      if (!playbtn.hasOwnProperty(key)) continue;
      var obj = playbtn[key];
      $('td[data-name="'+obj.element+'"]').find(".atomic_number").after('<img class="yt" src="/img/play.svg">');
    }
  });
});
