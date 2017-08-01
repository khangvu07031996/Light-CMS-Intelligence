//Sự kiện click button trên Popup:
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


            selDiv.innerHTML += '  ' + i;
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

   
    createDirectory();   
    

    var files = e.target.files;
    var filesArr = Array.prototype.slice.call(files);
    
    
}



//Các biến lưu thông tin về ảnh:
var arrImgs = [];
var arrImgObjs = [];
var total_items = 0;

//Xử lý sự kiện kéo thả ảnh trên Popup:
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

  

}
                              


    //Sự kiện click :

    $(document).on('click', 'img', function (evt) {
        alert("hey!" + this.id + "--" + this.src);
        document.getElementById('imgtab').style.display = "block";
        getDataByID(this.id);

    });

    $(document).on('click', '#btnPopup2', function(evt) { 
        alert("hey!");
        getData();

    });
    //btnImgInfo
    $(document).on('click', '#btnImgInfo', function (evt) {
        alert("This is button of img tab");
        let data = getImageInfo();
        updateImageInfo(data);

        //View paths of images:
        console.log("paths of imgs: " + arrImgObjs);
        console.log(arrImgObjs);
    });         


//hàm upload files:
function uploadfile() {
    //debugger;
    if (window.FormData !== undefined) {
        var fileUpload = $("#files").get(0);
        var files = fileUpload.files;
        //Tạo một đối tượng form data
        var filedata = new FormData();

        alert('file.lenght = ' + files.length);

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
                    getDataByMoment(result);
                    //window.location.reload();

                }, error: function (err) {
                    alert('0 ' + err);
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
function getDataByMoment(moment) {
    //debugger;
        var data = {
            moment: moment
        }
        $.ajax(
            {
                url: '/image/dataByMoment',
                
                type: 'POST',  
                data: JSON.stringify(data),                
                contentType: "application/json",
                //contentType: "application/x-www-form-urlencoded",
                dataType:'json',
                success: function (result) {
                    //$("#Picture").val(result);

                    alert('getdata0 ' + result);
                    console.log('data0 = ' + result);
                    data0 = result;
                    //window.location.reload();
                    console.log('length = ' + data0.length);

                    //selDiv.innerHTML = "<br />";
                    data0.forEach(function (f) {
                    var path = f.media + '/' + f.medialist.articlePreview;        
                    var html = "<img src=\"" + path + "\" " + "id = \"" + f._id + "\"" + " style= \"" + "width : 75px; height : 70px \"" + ">  ";
                    selDiv.innerHTML += html;

                    arrImgObjs.push({
                        id: 0,
                        path: path
                    });
            
                    });

                }, error: function (err) {
                    alert(err);
                }
            }
        );

    
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

                    alert('getdata: ' + result);
                    console.log(result);
                    
                    //window.location.reload();
                  
                        

                }, error: function (err) {
                    alert('0 ' + err);
                }
            }
        );

    
}

//Lấy dữ liệu theo id;
function getDataByID(id) {
    //debugger;

        var data = {id: id};
        //alert('id = ' + id);
   
        $.ajax(
            {
                url: '/image/databyid',
                type: 'POST',               
               
                data: JSON.stringify(data),                
                contentType: "application/json",
                //contentType: "application/x-www-form-urlencoded",
                dataType:'json',
                success: function (result) {
                    //$("#Picture").val(result);

                    alert('get data by id: ' + result[0]._id);
                    console.log(result);
                   
                    //window.location.reload();
                    
                    initImageTabcontent(result[0]);
                        

                }, error: function (err) {
                    alert(err);
                }
            }
        );

   
}

//Hàm cập nhật thông tin của ảnh:
function updateImageInfo(imgdata) {
    //var data = {id: id};
        //alert('id = ' + id);
   
        $.ajax(
            {
                url: '/image/' + imgdata.id,
                type: 'PUT',               
               
                data: JSON.stringify(imgdata),                
                contentType: "application/json",
                //contentType: "application/x-www-form-urlencoded",
                dataType:'json',
                success: function (result) {
                   
                    console.log("update: " + result);
                    alert('Updated ' + result);
                    //window.location.reload();                   
                    

                }, error: function (err) {
                    alert(err);
                }
            }
        );


}

//hàm khởi tạo tab thể hiện thông tin của ảnh:
function initImageTabcontent(imgdata) {
    let src = imgdata.media + "/" + imgdata.medialist.articlePreview;
    $("#description").val(imgdata._id);
    $("#heading").val(imgdata.heading);
    $("#photographer").val(imgdata.photographer);
    $("#imgsrc").attr('src', src);
    $("#imgid").val(imgdata._id);

}

//Hàm lấy thông về ảnh, trên tab:
function getImageInfo() {
    let imgdata = {};
    imgdata.id = $("#imgid").val();
    imgdata.description = $("#description").val();
    imgdata.heading = $("#heading").val();
    imgdata.photographer =  $("#photographer").val();
    
    return imgdata;

}
 
//Hàm reset tab thông tin ảnh:
function resetImageTabcontent() {
    $("#description").val("");
    $("#heading").val("");
    $("#photographer").val("");
    $("#imgsrc").attr('src', "");
    $("#imgid").val("");
}

//hàm tạo thư mục:
function createDirectory() {
    //debugger;
    alert('creating directory');
   
        $.ajax(
            {
                url: '/image/createDirectory',
                type: 'GET',
                contentType: false,
                processData: false,
                data: null,
                success: function (result) {
                    //$("#Picture").val(result);

                    alert('create dir' + result);
                    console.log(result);
                    uploadfile();
                    //window.location.reload();

                }, error: function (err) {
                    alert(err);
                }
            }
        );
    
    // run function callback:    
    //cb();
}

