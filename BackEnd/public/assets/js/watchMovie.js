$(document).ready(function(){ 
        $("button").click(function(){
          // var item = this.parentNode;
          // var item = task.innerText;
          var task = $(this.parentNode).text();
          var item = task.replace('Xemphim','');
          console.log(item);
            $.ajax({
                type: 'GET',
                url: '/products/phim/'+ item,
                // data: item,
                success: function(data){
                  // console.log(data);
                  //do something with the data via front-end framework
                  location.replace('/products/phim/'+ item,);
                }
              });  
        });
});