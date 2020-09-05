$(document).ready(function(){ 
    $("button").click(function(){
      var task = $(this.parentNode).text();
      var item = task.replace('delete','');
      // console.log(item);  
        $.ajax({
            type: 'DELETE',
            url: '/admin/delete/'+ item,
            // data: item,
            success: function(data){
              // console.log(data);
              //do something with the data via front-end framework
              location.reload();
            }
          });  
    });
    $("button").click(function(){
      var task = $(this.parentNode).text();
      var item = task.replace('edit','');
      // console.log(item);  
        $.ajax({
            type: 'DELETE',
            url: '/admin/editProduct/'+ item,
            // data: item,
            success: function(data){
              // console.log(data);
              //do something with the data via front-end framework
              location.reload();
            }
          });  
    });
});