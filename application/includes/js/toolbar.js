
mwd.body.className = mwd.body.className + " mw-live-edit";


mw.require("wysiwyg.js");






mw.require("tools.js");
mw.require("style_editors.js");






$(window).load(function(){




$(".mw_dropdown_type_navigation a").each(function(){
  var el = $(this);
  var li = el.parent();
  el.attr("href", "javascript:;");
  var val = li.attr("data-category-id");
  li.attr("value", val);
});

$("#module_category_selector").change(function(){
    var val = $(this).getDropdownValue();
    (val!=-1&&val!="-1") ? mw.tools.toolbar_sorter(Modules_List_modules, val):'';
});
$("#elements_category_selector").change(function(){
    var val = $(this).getDropdownValue();
    (val!=-1&&val!="-1") ? mw.tools.toolbar_sorter(Modules_List_elements, val):'';
});

$("#dd_module_search").bind("keyup paste", function(event){
       var val = this.value;
       if(val!=""){
          mwd.getElementById("dd_module_val_ctrl").innerHTML = val;
       }
       else{
          mwd.getElementById("dd_module_val_ctrl").innerHTML = "Categories";
       }

       $("#module_category_selector").setDropdownValue(-1, false);
       mw.tools.toolbar_searh(Modules_List_modules, val);
       event.preventDefault();
       event.stopPropagation();
       return false;

});
$("#dd_elements_search").bind("keyup paste", function(event){
       var val = this.value;
       if(val!=""){
          mwd.getElementById("dd_elements_val_ctrl").innerHTML = val;
       }
       else{
          mwd.getElementById("dd_elements_val_ctrl").innerHTML = "Categories";
       }

       $("#dd_elements_val_ctrl").setDropdownValue(-1, false);
       mw.tools.toolbar_searh(Modules_List_elements, val);
       event.preventDefault();
       event.stopPropagation();
       return false;

});


$(".mw_ex_tools").click(function(){
  var rel = $(this).attr("href");
  $(rel).toggleClass('active');
  $(this).toggleClass('active');
  return false;
});


});




mw.extras = {
  fullscreen:function(el){
      if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
      } else if(el.mozRequestFullScreen){
        el.mozRequestFullScreen();
      }
  },
  get_filename:function(s) {
    var d = s.lastIndexOf('.');
    return s.substring(s.lastIndexOf('/') + 1, d < 0 ? s.length : d);
  }
}









mw.image = {
    isResizing:false,
    currentResizing:null,
    resize:{
      create_resizer:function(){
        if(mw.image_resizer==undefined){
          var resizer = document.createElement('div');
          resizer.className = 'mw_image_resizer';
          resizer.innerHTML = '<span onclick="mw.wysiwyg.image(\'#editimage\');" class="image_change">Change</span>';
          document.body.appendChild(resizer);
          mw.image_resizer = resizer;
        }
      },
      prepare:function(){
        mw.image.resize.create_resizer();
        $(mw.image_resizer).resizable({
            handles: "all",
            minWidth: 60,
            minHeight: 60,
            start:function(){
              mw.image.isResizing = true;
                 $(mw.image_resizer).resizable("option", "maxWidth", mw.image.currentResizing.parent().width());
            },
            stop:function(){
              mw.image.isResizing = false;
              mw.drag.fix_placeholders();
            },
            resize:function(){
              var offset = mw.image.currentResizing.offset();
              $(this).css(offset);

            },
            aspectRatio: 16 / 9
        });
      },
      init:function(selector){
        mw.image_resizer == undefined?mw.image.resize.prepare():'';   /*
        $(".element-image").each(function(){
          var img = this.getElementsByTagName('img')[0];
          this.style.width = $(img).width()+'px';
          this.style.height = $(img).height()+'px';
        });     */

        $(window).bind("onElementClick", function(e, el){

         if( !mw.image.isResizing && !mw.isDrag && !mw.settings.resize_started && el.tagName=='IMG'){
             var el = $(el);



             //window.location.hash = '#mw_tab_design';

             //$("#module_design_selector").setDropdownValue("#tb_image_edit", true);

             var offset = el.offset();
             var r = $(mw.image_resizer);
             var width = el.width();
             var height = el.height();
             r.css({
                left:offset.left,
                top:offset.top,
                width:width,
                height:height
             });
             r.addClass("active");
             $(mw.image_resizer).resizable( "option", "alsoResize", el);
             $(mw.image_resizer).resizable( "option", "aspectRatio", width/height);
             mw.image.currentResizing = el;

         }
        })

        }
      },
      linkIt:function(img_object){
        var img_object = img_object || document.querySelector("img.element-current");

        if(img_object.parentNode.tagName === 'A'){
           $(img_object.parentNode).replaceWith(img_object);
        }
        else{
            mw.tools.modal.frame({
              url:"rte_link_editor#image_link",
              title:"Add/Edit Link",
              name:"mw_rte_link",
              width:340,
              height:535
            });
        }
      },
      rotate:function(img_object, angle){
        if(!mw.image.Rotator){
           mw.image.Rotator = document.createElement('canvas');
           mw.image.Rotator.style.top = '-9999px';
           mw.image.Rotator.style.position = 'absolute';
           mw.image.RotatorContext = mw.image.Rotator.getContext('2d');
           document.body.appendChild(mw.image.Rotator);
        }

        var img_object = img_object || document.querySelector("img.element-current");
        if(!img_object.src.contains("base64")){
          var currDomain = mw.url.getDomain(window.location.href);

          var srcDomain = mw.url.getDomain(img_object.src);

          if(currDomain!==srcDomain){
               mw.tools.alert("This action is allowed for images on the same domain.");
               return false;
          }
        }

        var angle = angle || 90;
        var image = $(img_object);
        var w = image.width();
        var h = image.height();

          var contextWidth = w
          var contextHeight = h
          var x = 0;
          var y = 0;

           switch(angle){
                case 90:
                    var contextWidth = h;
                    var contextHeight = w;
                    var y = -h;
                    break;
                case 180:
                    var x = -w;
                    var y = -h;
                    break;
                case 270:
                    var contextWidth = h;
                    var contextHeight = w;
                    var x = -w;
                    break;
                default:
                    var contextWidth = h;
                    var contextHeight = w;
                    var y = -h;
           }

           mw.image.Rotator.setAttribute('width', contextWidth);
		   mw.image.Rotator.setAttribute('height', contextHeight);
		   mw.image.RotatorContext.rotate(angle * Math.PI / 180);
		   mw.image.RotatorContext.drawImage(img_object, x, y);

           var data =  mw.image.Rotator.toDataURL("image/png");
           image.attr("src", data);
      },
      _dragActivated : false,
      _dragcurrent : null,
      _dragparent : null,
      _dragcursorAt : {x:0,y:0},
      _dragTxt:function(e){
        if(mw.image._dragcurrent!==null){
          mw.image._dragcursorAt.x = e.pageX-mw.image._dragcurrent.offsetLeft;
          mw.image._dragcursorAt.y = e.pageY-mw.image._dragcurrent.offsetTop;
          var x = e.pageX - mw.image._dragparent.offsetLeft - mw.image._dragcurrent.startedX  - mw.image._dragcursorAt.x;
          var y = e.pageY - mw.image._dragparent.offsetTop - mw.image._dragcurrent.startedY  - mw.image._dragcursorAt.y;
          mw.image._dragcurrent.style.top = y + 'px';
          mw.image._dragcurrent.style.left = x + 'px';

          mw.log(mw.image._dragcurrent.startedX)

        }
      },
      text_object:function(tag, text){
        var el = mwd.createElement(tag);
        el.className = "image_free_text";
        el.innerHTML = text;
        el.style.position = 'relative';
        el.style.display = 'inline-block';
        el.contenteditable = false;
        el.style.top = '0px';
        el.style.left = '40px';
        el.style.color = 'white';
        el.style.textShadow = '0 0 6px black';
        el.style.cursor = 'move';
        el.style.zIndex = '999';
        el.style.height = 'auto';
        el.ondblclick = function(e){
          e.preventDefault();
          mw.wysiwyg.select_all(this);
        }
        return el;
      },
      enterText:function(img_object){
          var img_object = img_object || document.querySelector("img.element-current");
          var image = $(img_object);
          if(!img_object.is_activated){
                img_object.is_activated = true;
                image.removeClass("element");
                image.wrap("<div class='element mw_image_txt'></div>");
                var obj = mw.image.text_object('span', "Lorem ipsum a asd a as asd");
                image.before(obj);
          }
      }
    }







  $.fn.notmouseenter = function() {
    return this.filter(function(){
      var el = $(el);
      var events = el.data("events");
      return (events==undefined || events.mouseover==undefined || events.mouseover[0].origType!='mouseenter');
    });
  };

  $.fn.notclick = function() {
    return this.filter(function(){
      var el = $(el);
      var events = el.data("events");
      return (events==undefined || events.click==undefined);
    });
  };


  $.fn.visible = function() {
    return this.css("visibility", "visible");
  };
  $.fn.visibilityDefault = function() {
    return this.css("visibility", "");
  };

  $.fn.invisible = function() {
    return this.css("visibility", "hidden");
  };








editablePurify = function(el){
  var dirty = $(el).find("[_moz_dirty]").not("br");
  dirty.each(function(){
    var el = $(this);
    el.removeAttr("id");
    if(el.html()=="" || el.html()==" "){
      el.replaceWith('<br />');
    }
  });
}





$(document).ready(function(){






    windowOnScroll.stop();

    mw.wysiwyg.prepare();
    mw.wysiwyg.init();

$("#module_design_selector").change(function(){
  var val = $(this).getDropdownValue();
  $(".tb_design_tool").hide();
  $(val).show();
  if(val=='#tb_el_style'){
    if($(".element-current").length==0){
        $(".element").eq(0).addClass("element-current");
        mw.config_element_styles();
    }
  }
});


});

mw.toolbar = {
  module_icons:function(){
    $(".list-modules .mw_module_image").each(function(){
      var img = $(this.getElementsByTagName('img')[0]);
      var Istyle = window.getComputedStyle(img[0], null);
      var img_height = parseFloat(Istyle.height);
      var pad = parseFloat(Istyle.paddingTop)
      var img_margin = 0;
      if(img_height<32){
        var img_margin = ($(this).height()/2)-(img_height/2);
        img.css({
          marginTop: img_margin
        });
      }
      $(this).find(".mw_module_image_shadow").css({
         top:img_height+pad-4,
         left:($(this).width()/2)-32,
         marginTop:img_margin>0?img_margin+2:img_margin
      }).visible();
    });

    $(".list-elements .mw_module_image").each(function(){
      var img = this.getElementsByTagName('img')[0];
      var Istyle = window.getComputedStyle(img, null);
      var img_height = parseFloat(Istyle.height);
      var center = ($(this).height()/2)-(img_height/2)
      img.style.marginTop = center + 'px';

      $(this).find(".mw_module_image_shadow").css({
         top:img_height+center-7,
         left:($(this).width()/2)-32
      }).visible();

    });





  }
}





$(window).load(function(){




    mw.toolbar.module_icons();



    $(".element").keyup(function(event){
        editablePurify(this);
    });

    $(".element").mouseup(function(event){
        mw.wysiwyg.check_selection();
    });
    $(".element").mousedown(function(event){
        $(".mw_editor_btn").removeClass("mw_editor_btn_active");

    });


    mw.disable_selection();



  mw.smallEditor = $("#mw_small_editor");
  mw.bigEditor = $("#mw-text-editor");


$(".mw_dropdown_action_font_family").change(function(){
    var val = $(this).getDropdownValue();
     mw.wysiwyg.fontFamily(val);
});
$(".mw_dropdown_action_font_size").change(function(){
    var val = $(this).getDropdownValue();
     mw.wysiwyg.fontSize(val);
});
$(".mw_dropdown_action_format").change(function(){
    var val = $(this).getDropdownValue();
    mw.wysiwyg.format(val);
});





  //mw.image.resize.init(".edit img");
  mw.image.resize.init(".element-image");



    $("#live_edit_toolbar_holder").height($("#live_edit_toolbar").height());

    $(window).bind("scrollstop",function(){
      setTimeout(function(){
      if(mw.isDrag && $(".ui-draggable-dragging").css("position")=='relative'){
        var curr_el = $(".ui-draggable-dragging").css("position", "static");
        var offset = curr_el.offset();
        curr_el.css("position", "relative");
        var scroll_top = $(window).scrollTop();
        curr_el.css({
          top:mw.mouse.y-offset.top+(scroll_top)+30
        });
      }  }, 100);
    });
    $(document.body).mousedown(function(event){

      if($(".editor_hover").length==0){
        $(mw.wysiwyg.external).empty().css("top", "-9999px");
        mw.wysiwyg.check_selection();
      }
      if($(".mw_dropdown.hover").length==0){
        $("div.mw_dropdown_fields").hide();
      }
    });


    $("#mw_small_editor").draggable({
        drag:function(){
          mw.SmallEditorIsDragging = true;
        },
        stop:function(){
          mw.SmallEditorIsDragging = false;
        }
    });



    $("#mw-text-editor").mousedown(function(){
      if($(".mw_editor_btn_hover").length==0){
        mw.mouseDownOnEditor = true;
        $(this).addClass("hover");
      }
    });
    $("#mw-text-editor").mouseup(function(){
        mw.mouseDownOnEditor = false;
        $(this).removeClass("hover");
    });
    $("#mw-text-editor").mouseleave(function(){
        if(mw.mouseDownOnEditor){
            $("#mw_small_editor").visible();
            $("#mw-text-editor").animate({opacity:0}, function(){
              $(this).invisible();
            });
            $("#mw-text-editor").removeClass("hover");
        }
    });
    $(document.body).mouseup(function(event){
         mw.target.item = event.target;
         mw.target.tag = event.target.tagName.toLowerCase();
         mw.mouseDownOnEditor = false;
         mw.SmallEditorIsDragging = false;

        if( !mw.image.isResizing &&
             mw.target.tag!='img' &&
             mw.target.item.className!='image_change' && $(mw.image_resizer).hasClass("active")){
           $(mw.image_resizer).removeClass("active");


           //$("#module_design_selector").setDropdownValue("#tb_el_style", true);

        }
    });







});


windowOnScroll = {
    scrollcatcher : 0,
    scrollcheck : 1,
    int : null,
    stop:function(){
      $(window).scroll(function(){
        windowOnScroll.scrollcatcher +=37;
        if(!windowOnScroll.int){
           windowOnScroll.int = setInterval(function(){
               if(windowOnScroll.scrollcheck != windowOnScroll.scrollcatcher){
                 windowOnScroll.scrollcheck = windowOnScroll.scrollcatcher;
               }
               else{
                 clearInterval(windowOnScroll.int);
                 windowOnScroll.int = null;
                 //$(window).trigger("scrollstop");
               }
           }, 37);
        }
      });
    }
  }


mw.toggle_subpanel = function(){
  this.speed = 200;
  var el = $("#show_hide_sub_panel");
  if(el.hasClass("state-off")){
     el.removeClass("state-off");
     $("#show_hide_sub_panel_slider").animate({left:0}, this.speed);
     $("#show_hide_sub_panel_info").fadeOut(this.speed, function(){
       $(this).css({left:'auto'}).html('Hide').fadeIn(this.speed);
     });
     $(".mw_tab_active").slideDown(this.speed);
     $("#mw_toolbar_nav").slideDown(this.speed);
  }
  else{
    el.addClass("state-off");
    $("#show_hide_sub_panel_slider").animate({left:35}, this.speed);
    $("#show_hide_sub_panel_info").fadeOut(this.speed, function(){
      $(this).css({left:3}).html('Show').fadeIn(this.speed);
    });

    $(".mw_tab_active").slideUp(this.speed);
    $("#mw_toolbar_nav").slideUp(this.speed);
  }
}

mw.recommend = {
  read:function(){

  }
}




$(window).resize(function(){
    mw.tools.module_slider.scale();
    mw.tools.toolbar_slider.ctrl_show_hide();
});