//Sự kiện click button:
$(document).ready(function () {
    var selDiv = "";
    selDiv = document.querySelector("#divimg");
    $("#btnOk").click(function () {
        alert('button clicked');
        console.log('leng of array = ' + arrImgs.length);
        console.log(arrImgObjs);

        arrImgs.forEach(function (i) {

            // Instead of echoing this, build a real array
            $('#console').html($('#console').html() + ' ' + i + ' ');
            var html = $('#console').html();


            selDiv.innerHTML += ' ' + i;
        });

        //alert(src0);
    });




});




//Sự kiện duyệt file:
var selDiv = "";

document.addEventListener("DOMContentLoaded", init, false);

function init() {
    document.querySelector('#files').addEventListener('change', handleFileSelect, false);
    selDiv = document.querySelector("#divimg");
}

function handleFileSelect(e) {

    if (!e.target.files || !window.FileReader) return;

    if (createDirectory()) {
        uploadfile();
    }    
    //load dữ liệu ảnh trong cơ sở dữ liệu:
    getData();

    //selDiv.innerHTML = "";

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    /*
    filesArr.forEach(function (f) {
        //var f = files[i];
        if (!f.type.match("image.*")) {
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            var html = "<img src=\"" + e.target.result + "\" " + " weight = 75px height = 70px" + ">";
            selDiv.innerHTML += html;
        }
        reader.readAsDataURL(f);
    });

    */
    
    // data.forEach(function (f) {
    //     var path = f.media + '/' + f.medialist.articlePreview;        
    //     var html = "<img src=\"" + path + "\" " + " weight = 75px height = 70px" + ">";
    //     selDiv.innerHTML += html;
      
    // });
}




var arrImgs = [];
var arrImgObjs = [];
var total_items = 0;

$(document).ready(function () {

    $(".item").draggable({
        revert: true
        //remove()
    });
    $("#cart_items").draggable({
        axis: "x"
    });

    $("#cart_items").droppable({
        accept: ".item",
        activeClass: "drop-active",
        hoverClass: "drop-hover",
        drop: function (event, ui) {
            var item = ui.draggable.html();
            var itemid = ui.draggable.attr("id");
            var html = '<div class="item icart">';
            html = html + '<div class="divrm">';
            html = html + '<a onclick="remove(this)" class="remove ' + itemid + '">&times;</a>';
            html = html + '<div/>' + item + '</div>';
            $("#cart_items").append(html);



            //console.log('src = '  + item.attr("src")); //ui.draggable.attr("id");
            console.log('currentSrc = ' + ui.draggable[0].firstElementChild.currentSrc);
            let strsrc = ui.draggable[0].firstElementChild.currentSrc.replace("http://localhost:3000", "");
            console.log('currentSrc = ' + strsrc);

            arrImgs.push(item);
            arrImgObjs.push({
                id: 0,
                path: strsrc
            });
            console.log('lenght arrImags = ' + arrImgs.length);
            console.log('lenght arrImgObjs = ' + arrImgObjs.length);



            // update total items
            total_items++;
            $("#citem").html(total_items);

            // expand cart items
            if (total_items > 4) {
                $("#cart_items").animate({ width: "+=120" }, 'slow');
            }
        }
    });


    $("#btn_next").click(function () {
        $("#cart_items").animate({ left: "-=100" }, 100);
        return false;
    });
    $("#btn_prev").click(function () {
        $("#cart_items").animate({ left: "+=100" }, 100);
        return false;
    });
    $("#btn_clear").click(function () {
        $("#cart_items").fadeOut("2000", function () {
            $(this).html("").fadeIn("fast").css({ left: 0 });
        });
        $("#citem").html("0");
        $("#cprice").html("$ 0");
        total_items = 0;
        total_price = 0;
        return false;
    });
});
function remove(el) {
    $(el).hide();
    $(el).parent().parent().effect("highlight", { color: "#ff0000" }, 10);
    $(el).parent().parent().fadeOut('1');
    setTimeout(function () {
        $(el).parent().parent().remove();
        // collapse cart items
        if (total_items > 3) {
            $("#cart_items").animate({ width: "-=120" }, 'normal');
        }
    }, 1100);

    // update total item
    total_items--;
    $("#citem").html(total_items);

    // update totl price


}


  
                                


    //Sự kiện click Image:

    $(document).on('click', 'img', function (evt) {
        alert("hey!" + this.id + "--" + this.src);
        document.getElementById('imgtab').style.display = "block";

    });

    $(document).on('click', '#btnPopup2', function(evt) { 
        alert("hey!");
        getData();

    });
                            


//hàm upload files:
function uploadfile() {
    //debugger;
    if (window.FormData !== undefined) {
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        //Tạo một đối tượng form data
        var filedata = new FormData();

        //alert(files.length);

        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            filedata.append('pictures', file, file.name);
        }
        $.ajax(
            {
                url: '/image/upload',
                type: 'POST',
                contentType: false,
                processData: false,
                data: filedata,
                success: function (result) {
                    //$("#Picture").val(result);

                    alert(result);
                    console.log(result);
                    //window.location.reload();

                }, error: function (err) {
                    alert(err.statusText);
                }
            }
        );

    }
    else {
        alert("FormData không hỗ trợ");
    }
}

var data0;
//hàm lấy tập hợp dữ liệu:
function getDataByIds() {
    //debugger;
   
        $.ajax(
            {
                url: '/image/data',
                type: 'GET',
                contentType: false,
                processData: false,
                data: null,
                success: function (result) {
                    //$("#Picture").val(result);

                    alert(result);
                    console.log(result);
                    data0 = result;
                    //window.location.reload();
                    console.log('length = ' + data.length);
                        data.forEach(function (f) {
                        var path = f.media + '/' + f.medialist.articlePreview;        
                        var html = "<img src=\"" + path + "\" " + " weight = 75px height = 70px" + ">";
                        selDiv.innerHTML += html;
                
                    });

                }, error: function (err) {
                    alert(err.statusText);
                }
            }
        );

    console.log('length = ' + data0.length);
}

//hàm lấy tập hợp dữ liệu:
function getData() {
    //debugger;
   
        $.ajax(
            {
                url: '/image/data',
                type: 'GET',
                contentType: false,
                processData: false,
                data: null,
                success: function (result) {
                    //$("#Picture").val(result);

                    alert(result);
                    console.log(result);
                    data = result;
                    //window.location.reload();
                    console.log('length = ' + data.length);
                        

                }, error: function (err) {
                    alert(err.statusText);
                }
            }
        );

    //console.log('length = ' + data.length);
}


//hàm tạo thư mục:
function createDirectory() {
    //debugger;
   
        $.ajax(
            {
                url: '/image/createDirectory',
                type: 'GET',
                contentType: false,
                processData: false,
                data: null,
                success: function (result) {
                    //$("#Picture").val(result);

                    alert(result);
                    console.log(result);
                    
                    //window.location.reload();

                }, error: function (err) {
                    alert(err.statusText);
                }
            }
        );

    return true;
}

