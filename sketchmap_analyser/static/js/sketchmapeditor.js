

var sketchMap;
var sketchMaptitle;
var drawnSketchItems;
var alignSketchID=[];
var sketchOtypearray={};
var baseOtypearray={};
var alignBaseID=[];
var allDrawnSketchItems={};
var AlignmentArray = {};
var checkAlignnum;
var alignmentArraySingleMap={};
var id=-1;
var bid=-1;
var layerGroupBasemap = new L.LayerGroup();
var layerGroupBasemapGen = new L.LayerGroup();
var baseMap;
var drawnItems;
var addedClickBase = false;
var addedClickSketch = false;
var routeOrder = 0;


$(function() {

    $('.btn-link[aria-expanded="true"]').closest('.accordion-item').addClass('active');
  $('.collapse').on('show.bs.collapse', function () {
	  $(this).closest('.accordion-item').addClass('active');
	});

  $('.collapse').on('hidden.bs.collapse', function () {
	  $(this).closest('.accordion-item').removeClass('active');
	});



});


$( "#filemenu" ).click(function() {
  $( "#filemenuoptions" ).slideToggle(500);
});


$( "#upload" ).click(function() {
  $( "#filemenuoptions" ).slideToggle(500);
});

$( "#downloadProject" ).click(function() {
  $( "#filemenuoptions" ).slideToggle(500);
});

$( "#editmenu" ).click(function() {
  $( "#editmenuoptions" ).slideToggle(500);
});




function loadFromImage(){
addedClickBase = false;
var imageList = document.getElementById('fromfile').files;
$("#loadbasemap").hide();
$("#imagemap").show();
    for (var i = 0; i < imageList.length; i++) {
        renderImageFile(imageList[i], location);
    }
}



function renderImageFile(file, location) {
    var reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function (e) {

        var container = L.DomUtil.get('baseMap');
        if (container != null) {
            container._leaflet_id = null;
        }
        var image = new Image();

        image.title = file.name;
        image.src = this.result;


        baseMap = new L.map('imagemap', {
            crs: L.CRS.Simple
        });

 var bounds = [[0, 0], [600, 850]];

        var BMLoaded = new L.imageOverlay(image.src,bounds);
        BMLoaded.addTo(baseMap);
        baseMap.fitBounds(bounds);
        drawnItems = new L.geoJson();
        layerGroupBasemap.addTo(baseMap);
        layerGroupBasemapGen.addTo(baseMap);
        drawnItems.addTo(layerGroupBasemap);
        var layerControl = new L.Control.Layers(null, {
            'Base Map': layerGroupBasemap,
            'Generalized Map': layerGroupBasemapGen
        }).addTo(baseMap);
        }

$( "#loaded" ).prop( "checked", true );
$( "#loaded" ).prop( "disabled", false );





}


 routeButton = L.easyButton({

 states: [{
            stateName: 'Select-Route-Mode-On',        // name the state
            icon:      'fa-arrow-trend-up',               // and define its properties
            title:     'SelectRouteOff',      // like its title
            onClick: function(btn, map) {
                console.log("On");
                $($(this)[0]._container).css('display','inline-flex');
                btn.button.style.boxShadow = 'inset 0 -1px 5px 2px rgba(81, 77, 77, 1)';

                $($(this)[0]._container).append($("<a style='outline: none;width: fit-content;' id = 'clearRoute' onclick='clearRoute()'>Clear Route</a>"));
                drawnItems.eachLayer(function(blayer){
                    blayer.on('click',function(e){
                    if (!blayer.feature.properties.isRoute){
                        blayer.feature.properties.isRoute = "Yes";
                        blayer.feature.properties.RouteSeqOrder = routeOrder + 1;
                        blayer.setStyle({
                            color: 'red'   //or whatever style you wish to use;
                        });
                        routeOrder = routeOrder + 1;
                    }
                    else if (blayer.feature.properties.isRoute == "Yes"){
                        blayer.feature.properties.isRoute = null ;
                        delete blayer.feature.properties.RouteSeqOrder;
                        blayer.setStyle({
                            color: '#e8913a'   //or whatever style you wish to use;
                        });
                        routeOrder = routeOrder - 1;
                     }
                });
            });
             btn.state('Select-Route-Mode-Off');    // change state on click!
            }
        }, {
            stateName: 'Select-Route-Mode-Off',
            icon:      'fa-arrow-trend-up',
            title:     'SelectRouteOn',
            onClick: function(btn, map) {
                btn.button.style.boxShadow = null;// and its callback
                $( "#clearRoute" ).remove();
               drawnItems.eachLayer(function(blayer){
                blayer.off('click');
                });
                console.log("Off");
                btn.state('Select-Route-Mode-On');
            }
    }]


 });

function clearRoute(){
        drawnItems.eachLayer(function(blayer){
                        blayer.feature.properties.isRoute = null ;
                        delete blayer.feature.properties.RouteSeqOrder;
                        blayer.setStyle({
                            color: '#e8913a'   //or whatever style you wish to use;
                        });
                        routeOrder = 0;
    });
};


labelButton = L.easyButton({
states: [{
            stateName: 'label-visible',        // name the state
            icon:      'fa-solid fa-info',               // and define its properties
            title:     'showlabels',      // like its title
            onClick: function(btn, map) {
                btn.button.style.boxShadow = 'inset 0 -1px 5px 2px rgba(81, 77, 77, 1)';
                drawnItems.eachLayer(function(blayer){
                    blayer.bindTooltip(String(blayer.feature.properties.id), {permanent:true});
                })
                btn.state('label-invisible');    // change state on click!

                if (GenBaseMap != null){
                       GenBaseMap.eachLayer(function(glayer){
                        glayer.bindTooltip(String(glayer.feature.properties.id), {permanent:true});
                       });
                }
            }
        }, {
            stateName: 'label-invisible',
            icon:      'fa-solid fa-info',
            title:     'hidelabels',
            onClick: function(btn, map) {
                 btn.button.style.boxShadow = null;// and its callback
                 drawnItems.eachLayer(function(blayer){
                    blayer.unbindTooltip();
                })
                if (GenBaseMap != null){
                       GenBaseMap.eachLayer(function(glayer){
                        glayer.unbindTooltip();
                       });
                }
                btn.state('label-visible');
            }
    }]
});





labelButtonSketchMap = L.easyButton({
states: [{
            stateName: 'label-visible',        // name the state
            icon:      'fa-solid fa-info',               // and define its properties
            title:     'showlabels',      // like its title
            onClick: function(btn, map) {
                btn.button.style.boxShadow = 'inset 0 -1px 5px 2px rgba(81, 77, 77, 1)';
                drawnSketchItems.eachLayer(function(slayer){
                    slayer.bindTooltip(String(slayer.feature.properties.sid), {permanent:true});
                })
                btn.state('label-invisible');    // change state on click!
            }
        }, {
            stateName: 'label-invisible',
            icon:      'fa-solid fa-info',
            title:     'hidelabels',
            onClick: function(btn, map) {
                 btn.button.style.boxShadow = null;// and its callback
                 drawnSketchItems.eachLayer(function(slayer){
                    slayer.unbindTooltip();
                })
                btn.state('label-visible');
            }
    }]
});


var drawBM = document.getElementById('drawBM');
$('#drawBM').click(function(){


drawnItems.setStyle({pmIgnore: false});
drawnItems.options.pmIgnore = false; // If the layer is a LayerGroup / FeatureGroup / GeoJSON this line is needed too
L.PM.reInitLayer(drawnItems);

baseMap.pm.addControls({
position: 'topleft',
drawCircle: false,
drawMarker: false,
drawRectangle:false,
drawText: false,
drawCircleMarker:true,
dragMode:false,
rotateMode:false,
cutPolygon:false
});

baseMap.on('pm:create', function (event) {
    bid=bid+1;
    var layer = event.layer;
    var feature = layer.feature = layer.feature || {}; // Initialize feature
    feature.type = feature.type || "Feature"; // Initialize feature.type
    var props = feature.properties = feature.properties || {}; // Initialize feature.properties
    props.id = bid;
    props.isRoute = null;
    if(event.shape == "Polygon"){
        props.feat_type = "Landmark"
    }
    else{
        props.feat_type = null;
    }
    props.selected=false;
    props.aligned=false;
    props.otype = event.shape;
    drawnItems.addLayer(layer);
});

baseMap.on('pm:remove', function (e) {
    drawnItems.removeLayer(e.layer);
});



baseMap.pm.setGlobalOptions({
  continueDrawing : true,
  pathOptions:{
    opacity:0.7,
    dashArray: [5, 5],
    weight: 5,
    color: "#e8913a",
    radius: 5},
  templineStyle: {
    color: "#e8913a",
    dashArray: [5, 5],
  },
  hintlineStyle: {
    color: "#e8913a",
    dashArray: [5, 5],
  }

});

const actions = [];
baseMap.pm.Toolbar.changeActionsOfControl('Polygon', actions);
baseMap.pm.Toolbar.changeActionsOfControl('Polyline', actions);
baseMap.pm.Toolbar.changeActionsOfControl('CircleMarker', actions);

$( "#editmenuoptions" ).slideToggle(500);

drawnItems.eachLayer(function(blayer){
        blayer.off('click');
        });
addedClickBase = false;
routeButton.addTo(baseMap);
labelButton.addTo(baseMap);
});




$("#saveBM").click(function(){
drawnItems.eachLayer(function(blayer){
        blayer.off('click');
});

if (addedClickBase == false){
addClickBase();
}
$( "#marked" ).prop( "checked", true );
$( "#marked" ).prop( "disabled", false );
baseMap.pm.disableDraw();
baseMap.pm.removeControls();
drawnItems.setStyle({opacity:1});

$( "#editmenuoptions" ).slideToggle(500);
baseMap.removeControl(routeButton);

allDrawnSketchItems["basemap"] = drawnItems;
});




function addClickBase(){
drawnItems.eachLayer(function(blayer){
        blayer.on('click',function(e){
        if(blayer.feature.properties.selected==false){
            blayer.feature.properties.selected=true;
            alignBaseID.push(blayer.feature.properties.id);
            baseOtypearray[blayer.feature.properties.id]=blayer.feature.properties.otype;
            styleLayers();
        }
        else{
            blayer.feature.properties.selected = false;
            alignBaseID= alignBaseID.filter(function(item) {
                return item !== blayer.feature.properties.id;
            })
            delete baseOtypearray[blayer.feature.properties.id];
            styleLayers();
        }
    });
    });

    addedClickBase = true;
}


   $('.thumbnail').click(function(e){
   addedClickSketch = false;

     $('#slider').prop('checked', true);

        if (sketchMap != null) {
            sketchMap.remove();
        }
        var image = new Image();
        image.src = $(e.target).attr('src');

        sketchMap = new L.map('sketchimagemap', {
            crs: L.CRS.Simple
        });
        sketchMap.getContainer().focus = ()=>{};

        var bounds = [[0, 0], [600, 850]];
        var SMLoaded = new L.imageOverlay(image.src,bounds);
        SMLoaded.addTo(sketchMap);
        sketchMap.fitBounds(bounds);
        sketchMaptitle = $(e.target).parent().attr("data-original-title");
        if(allDrawnSketchItems.hasOwnProperty(sketchMaptitle)){
            drawnSketchItems=allDrawnSketchItems[sketchMaptitle];
            drawnSketchItems.addTo(sketchMap);
            if (Object.keys(AlignmentArray).length == 0){
                console.log("inside Alignment Array=0");
                checkAlignnum = 1;
                alignmentArraySingleMap={};
                drawnSketchItems.eachLayer(function(slayer){
                    slayer.feature.properties.selected = false;
                    slayer.feature.properties.aligned = false;
                    slayer.feature.properties.isRoute = null;
                    if (slayer.feature.properties.group){
                        delete slayer.feature.properties.group;
                        delete slayer.feature.properties.groupID;
                    }
                    });
                drawnItems.eachLayer(function(blayer){
                    blayer.feature.properties.selected=false;
                    blayer.feature.properties.aligned=false;
                    if (blayer.feature.properties.group){
                        delete blayer.feature.properties.group;
                        delete blayer.feature.properties.groupID;
                    }
             if (blayer.feature.properties.missing){
                delete blayer.feature.properties.missing;
             }

        });
        styleLayers();
        }
        else{
            console.log("in AlignmentArray");

            checkAlignnum = AlignmentArray[sketchMaptitle].checkAlignnum;
            alignmentArraySingleMap=AlignmentArray[sketchMaptitle];

             drawnSketchItems.eachLayer(function(slayer){
                $.each(alignmentArraySingleMap, function(i, item) {
                    if(alignmentArraySingleMap[i].genType == "Abstraction to show existence"){
                        if((alignmentArraySingleMap[i].SketchAlign[0]).includes(slayer.feature.properties.sid)){
                             slayer.feature.properties.group = true ;
                             slayer.feature.properties.groupID = i;
                        }
                }
                });
            });

            drawnItems.eachLayer(function(blayer){
                $.each(alignmentArraySingleMap, function(i, item) {
                    if(alignmentArraySingleMap[i].genType == "Abstraction to show existence"){
                        if((alignmentArraySingleMap[i].BaseAlign[0]).includes(blayer.feature.properties.id)){
                             blayer.feature.properties.group = true ;
                             blayer.feature.properties.groupID = i;
                        }
                }
                });
            });
         }


        restoreBaseAlignment(alignmentArraySingleMap);
        styleLayers();
        }
        else{
        console.log("No sketchmap own title");
        drawnSketchItems = new L.geoJson().addTo(sketchMap);
        alignmentArraySingleMap={};
        drawnItems.eachLayer(function(blayer){
            blayer.feature.properties.selected=false;
            blayer.feature.properties.aligned=false;
            if (blayer.feature.properties.missing){
                delete blayer.feature.properties.missing;
            }
            if (blayer.feature.properties.group){
                delete blayer.feature.properties.group;
                delete blayer.feature.properties.groupID;
             }
        });
        styleLayers();
        id = -1;
        checkAlignnum = 1;
        }
   });



    $('#drawSM').click(function(){

    if (addedClickBase == false){
           addClickBase();
    }


    if (addedClickSketch == false){
        drawnSketchItems.eachLayer(function(slayer){
        slayer.off('click');
        });
         drawnSketchItems.eachLayer(function(slayer){
                 slayer.on('click', function (e) {
                    clickFunctionforSketch(e.target);
                });
            });


    }
        sketchMap.pm.addControls({
            position: 'topleft',
            drawCircle: false,
            drawRectangle:false,
            drawMarker:false,
            drawCircleMarker:true,
            drawText:false,
            dragMode:false,
            rotateMode:false,
            cutPolygon:false
    });
    sketchMap.pm.setGlobalOptions({
            continueDrawing: false,
            pathOptions:{
                opacity:0.7,
                weight: 5,
                color: "#e8913a",
                radius: 5,
                dashArray: [5, 5],
                },
            templineStyle: {
                color: "#e8913a",
                dashArray: [5, 5],
             },
            hintlineStyle: {
                color: "#e8913a",
                dashArray: [5, 5],
            }
        });

const sketchActions = [];
sketchMap.pm.Toolbar.changeActionsOfControl('Polygon', sketchActions);
sketchMap.pm.Toolbar.changeActionsOfControl('Polyline', sketchActions);
sketchMap.pm.Toolbar.changeActionsOfControl('CircleMarker', sketchActions);

          sketchMap.on('pm:drawstart', function (e) {
            drawnSketchItems.eachLayer(function(slayer){
                slayer.off('click');
            });
        });

        sketchMap.on('pm:create', function (event) {
                       id=id+1;
                       console.log("create id", id);
            var layer = event.layer;

            var feature = layer.feature = layer.feature || {}; // Initialize feature
            feature.type = feature.type || "Feature"; // Initialize feature.type
            var props = feature.properties = feature.properties || {}; // Initialize feature.properties
            props.id = id;
            props.sid= 'S' + id;
            props.isRoute = null;
             if(event.shape == "Polygon"){
    props.feat_type = "Landmark"
    }
    else{
    props.feat_type = null;}
            props.selected = false;
            props.aligned = false;
            props.otype = event.shape;
            drawnSketchItems.addLayer(layer);
     });


       sketchMap.on('pm:drawend', function (e) {
            drawnSketchItems.eachLayer(function(slayer){
                 slayer.on('click', function (e) {
                    clickFunctionforSketch(e.target);
                });
            });
        });

        sketchMap.on('pm:remove', function (e) {
            checkIfAlignedAlready([e.layer.feature.properties.sid]);
            alignSketchID = [];
            alignBaseID = [];
            sketchOtypearray = [];
            baseOtypearray = [];
            drawnSketchItems.removeLayer(e.layer);
        });




    $( "#editmenuoptions" ).slideToggle(500);
    labelButtonSketchMap.addTo(sketchMap);

    });



    function clickFunctionforSketch(layer){
         if(layer.feature.properties.selected==false){
            layer.feature.properties.selected = true;
            alignSketchID.push(layer.feature.properties.sid);
            sketchOtypearray[layer.feature.properties.sid]=layer.feature.properties.otype;
            styleLayers();
            }
        else{
            layer.feature.properties.selected = false;
            alignSketchID= alignSketchID.filter(function(item) {
                return item !== layer.feature.properties.sid;
            });
            delete sketchOtypearray[layer.feature.properties.sid];
            styleLayers();
        }

    addedClickSketch = true;

    }



    $('#alignbutton').click(function(){
        checkIfAlignedAlready(alignSketchID);
        drawnItems.eachLayer(function(blayer){
        if (alignBaseID.includes(blayer.feature.properties.id)){
        blayer.feature.properties.aligned = true;
        blayer.feature.properties.selected = false;
        styleLayers();
        if (blayer.feature.properties.isRoute == "Yes"){
            drawnSketchItems.eachLayer(function(slayer){
                if (alignSketchID.includes(slayer.feature.properties.sid)){
                slayer.feature.properties.isRoute = "Yes";
                slayer.feature.properties.SketchRouteSeqOrder = blayer.feature.properties.RouteSeqOrder;
              }

            });
        }
        }
        });
        drawnSketchItems.eachLayer(function(slayer){
        if (alignSketchID.includes(slayer.feature.properties.sid)){
        slayer.feature.properties.aligned = true;
        slayer.feature.properties.selected = false;
        styleLayers();
        }
        });

        align(alignBaseID,alignSketchID,checkAlignnum,sketchOtypearray,baseOtypearray);
        checkAlignnum=checkAlignnum+1;
    });




    function align(BID,SID,num,sketchtype,basetype){
       console.log(BID,SID,num,sketchtype,basetype);
       var degreeOfGeneralization;
       var BaseAlign={};
       var SketchAlign={};
            BaseAlign[0]=BID;
            SketchAlign[0]=SID;
       degreeOfGeneralization=(BID.length - SID.length)/BID.length;
       var genType;
       (async () => {
           console.log(sketchtype,basetype);
          genType = await predictGeneralization(sketchtype,basetype);
          if(genType!= "Generalization Not possible") {
          alignmentArraySingleMap[num]={BaseAlign,SketchAlign,genType,degreeOfGeneralization};
          }
          if(genType == "Abstraction to show existence"){
                console.log("Group Yes");
                drawnItems.eachLayer(function(blayer){
                       if(BID.includes(blayer.feature.properties.id)){
                            blayer.feature.properties.group = true;
                            blayer.feature.properties.groupID = num;
                       }
                });

                drawnSketchItems.eachLayer(function(slayer){
                       if(SID.includes(slayer.feature.properties.sid)){
                            slayer.feature.properties.group = true;
                            slayer.feature.properties.groupID = num;
                       }
                });
             }
        })()

       alignBaseID=[];
       alignSketchID=[];
       sketchOtypearray = {};
       baseOtypearray = {};
       hoverfunction();
    }
    var hoverarray = [];

    function hoverfunction(){
    drawnSketchItems.eachLayer(function(slayer){
    slayer.on('mouseover', function() {
    $.each(alignmentArraySingleMap, function(i, item) {
    if((alignmentArraySingleMap[i].SketchAlign != null) && (alignmentArraySingleMap[i].SketchAlign[0]).includes(slayer.feature.properties.sid)){

    hoverarray.push(alignmentArraySingleMap[i].BaseAlign[0]);
    hoverarray.push(alignmentArraySingleMap[i].SketchAlign[0]);
    }

    changestyleOnHover(hoverarray);
    });
    });
    slayer.on('mouseout', function() {
    hoverarray=[];
    styleLayers();
    });

    });
    }


  function predictGeneralization(sketchtype,basetype){
        if (checktype(sketchtype,basetype)){
            switch (sketchtype[Object.keys(sketchtype)[0]]){
                case "Line":
                    switch (checkgroupalign(sketchtype,basetype)){
                        case "one-one":
                            return "No generalization";
                            break;
                        case "one-many":
                            return predictGenSingleLine(sketchtype,basetype);
                            break;
                        case "many-many":
                            return "Abstraction to show existence";
                            break;
                    }
                    break;
                case "Polygon":
                    switch (checkgroupalign(sketchtype,basetype)){
                        case "one-one":
                            return "No generalization";
                            break;
                        case "one-many":
                            return "Amalgamation";
                            break;
                        case "many-many":
                            return "Abstraction to show existence";
                            break;
                    }
                    break;
            }

        }
        else if(sketchtype[Object.keys(sketchtype)[0]]=="CircleMarker" || basetype[Object.keys(basetype)[0]]=="CircleMarker"){
            return "Collapse";
        }
        else{
        alert("Error Cannot Align :Basemap feature type is different from sketchmap feature type");
        return "Generalization Not possible"
        }
    }

    function checktype(sketchtype,basetype){
     const allOtype = {...sketchtype,...basetype}
     return new Set(Object.values(allOtype)).size === 1;
    }

    function checkgroupalign(sketchtype,basetype){
        if (Object.keys(sketchtype).length == 1 && Object.keys(basetype).length==1){
            return "one-one";
        }
        if (Object.keys(sketchtype).length == 1 && Object.keys(basetype).length > 1){
            return "one-many";
        }
        if(Object.keys(sketchtype).length > 1 && Object.keys(basetype).length>1){
            return "many-many";
        }
    }


    function changestyleOnHover(Array){
    Array=Array.flat();
     drawnItems.eachLayer(function(blayer){
     for (i in Array){
        if (blayer.feature.properties.id==Array[i]){
                blayer.setStyle({
            color: 'blue'   //or whatever style you wish to use;
        });
        }
    }

     });
     drawnSketchItems.eachLayer(function(slayer){
     for (i in Array){
        if (slayer.feature.properties.sid==Array[i]){
            slayer.setStyle({
            color: 'blue'   //or whatever style you wish to use;
        });
        }
    }
   });

    }

    $('#saveSM').click(function(){
     sketchMap.pm.removeControls();

     drawnSketchItems.eachLayer(function(slayer){
        slayer.off('click');
        });

     drawnItems.eachLayer(function(blayer){
        blayer.off('click');
        });
     addedClickBase = false;
     addedClickSketch = false;

     sketchMap.off('pm:drawstart');
     sketchMap.off('pm:drawend');
     sketchMap.off('pm:create');
      $( "#editmenuoptions" ).slideToggle(500);

     allDrawnSketchItems[sketchMaptitle]=drawnSketchItems;
      drawnSketchItems.setStyle({opacity:1});
      AlignmentArray[sketchMaptitle]=alignmentArraySingleMap;
      AlignmentArray[sketchMaptitle].checkAlignnum = checkAlignnum;

    });


function restoreBaseAlignment(alignmentArraySingleMap){

drawnItems.eachLayer(function(blayer){
    blayer.feature.properties.aligned = false;
    blayer.feature.properties.selected = false;
    $.each(alignmentArraySingleMap, function(i, item) {
        if(alignmentArraySingleMap[i].BaseAlign != null && (alignmentArraySingleMap[i].BaseAlign[0]).includes(blayer.feature.properties.id)){
            blayer.feature.properties.aligned=true;
        }
    });
})

hoverfunction();
}

function checkIfAlignedAlready(alignSketchID){
drawnSketchItems.eachLayer(function(slayer){
$.each(alignmentArraySingleMap, function(i, item) {
    if(alignSketchID.includes(slayer.feature.properties.sid) && (alignmentArraySingleMap[i].SketchAlign != null) && (alignmentArraySingleMap[i].SketchAlign[0]).includes(slayer.feature.properties.sid)){
     drawnItems.eachLayer(function(blayer){
     if((alignmentArraySingleMap[i].BaseAlign != null) && (alignmentArraySingleMap[i].BaseAlign[0]).includes(blayer.feature.properties.id)){
        blayer.feature.properties.aligned=false;
     }
     });
    console.log("removed",alignmentArraySingleMap[i]);
     delete alignmentArraySingleMap[i];
     styleLayers();
    }
    });
})


}


function styleLayers(){

if (drawnSketchItems){

    drawnSketchItems.eachLayer(function(slayer){
            if (slayer.feature.properties.selected){
                slayer.setStyle({weight:12});
            }
            if (!slayer.feature.properties.selected && !slayer.feature.properties.aligned && !slayer.feature.properties.isRoute){
                slayer.setStyle({opacity:0.7,weight: 5,color: "#e8913a",dashArray: [5, 5]});
            }
            if (!slayer.feature.properties.selected && slayer.feature.properties.aligned && !slayer.feature.properties.isRoute){
                slayer.setStyle({opacity:0.7,weight: 5,color: "#e8913a",dashArray: null});
            }
            if (!slayer.feature.properties.selected && !slayer.feature.properties.aligned && slayer.feature.properties.isRoute=="Yes"){
                slayer.setStyle({opacity:0.7,weight: 5,color: "red",dashArray: [5, 5]});
            }
            if(!slayer.feature.properties.selected && slayer.feature.properties.aligned && slayer.feature.properties.isRoute=="Yes"){
                slayer.setStyle({opacity:0.7,weight: 5,color: "red",dashArray: null,});
            }

     });
}

if (drawnItems){
    drawnItems.eachLayer(function(blayer){

         if (blayer.feature.properties.selected){
                blayer.setStyle({weight:12});
            }
            if (!blayer.feature.properties.selected && !blayer.feature.properties.aligned && !blayer.feature.properties.isRoute){
                blayer.setStyle({opacity:0.7,weight: 5,color: "#e8913a",dashArray: [5, 5]});
            }
            if (!blayer.feature.properties.selected && blayer.feature.properties.aligned && !blayer.feature.properties.isRoute){
                blayer.setStyle({opacity:0.7,weight: 5,color: "#e8913a",dashArray: null});
            }
            if (!blayer.feature.properties.selected && !blayer.feature.properties.aligned && blayer.feature.properties.isRoute=="Yes"){
                blayer.setStyle({opacity:0.7,weight: 5,color: "red",dashArray: [5, 5]});
            }
            if(!blayer.feature.properties.selected && blayer.feature.properties.aligned && blayer.feature.properties.isRoute=="Yes"){
                blayer.setStyle({opacity:0.7,weight: 5,color: "red",dashArray: null,});
            }
     });
    }
}



// function predictGenSingleLine(sketchtype,basetype){
// var datatobesent = new L.geoJson();
//  drawnItems.eachLayer(function(blayer){
//     if((Object.keys(basetype).map(Number)).includes(blayer.feature.properties.id)){
//        datatobesent.addData(blayer.toGeoJSON());
//     }
// });

// var returnValue;

// var url = "http://localhost:8080/fmedatastreaming/Generalization/junctiondetect.fmw?data=" + encodeURIComponent(JSON.stringify(JSON.stringify(datatobesent.toGeoJSON())));
// var newurl = "http://desktop-f25rpfv:8080/fmerest/v3/repositories/GeneralizationPredict/networkcalculator.fmw/parameters?fmetoken=47e241ca547e14ab6ea961aef083f8a4cbe6dfe3"


// var httpRequest = new XMLHttpRequest();
// httpRequest.open("GET", url, false);
// httpRequest.setRequestHeader("Authorization","fmetoken token=*****")
// httpRequest.setRequestHeader("Access-Control-Allow-Origin", "http://localhost:8080");
// httpRequest.setRequestHeader("Accept","text/html");
// httpRequest.setRequestHeader("content-Type","application/x-www-form-urlencoded");
//             httpRequest.onreadystatechange = function()
//             {
//                 if (httpRequest.readyState == 4 && httpRequest.status == 200)
//                 {
//                  var responseArray = (httpRequest.response).split(/\r?\n/);
//                  responseArray.pop();
//                  var nodeArray = [];
//                   $.each(responseArray, function(i, item) {
//                         nodeArray.push(Object.values(JSON.parse(responseArray[i])));
//                   });
//                  nodeArray = _.flatten(nodeArray,true);
//                  if (new Set(nodeArray).size == nodeArray.length){
//                     returnValue = "Abstraction to show existence";
//                  }
//                  else{
//                     var nodeCount = _.countBy(nodeArray);
//                     if (!(Object.values(nodeCount)).includes(3)){
//                     returnValue =  "OmissionMerge";
//                     }
//                  }
//                 }
//             }
//             // send a request so we get a reply
//             httpRequest.send();

//  return returnValue;
// }

function predictGenSingleLine(sketchtype, basetype) {
    var datatobesent = new L.geoJson();
    drawnItems.eachLayer(function(blayer) {
      if ((Object.keys(basetype).map(Number)).includes(blayer.feature.properties.id)) {
        datatobesent.addData(blayer.toGeoJSON());
      }
    });
    var coordinates = [];
    for (var i = 0; i < datatobesent.toGeoJSON().features.length; i++) {
    var feature = datatobesent.toGeoJSON().features[i];
    if (feature.geometry.type === "LineString") {
        coordinates.push(feature.geometry.coordinates);
    }
    }
    var result = checkOverlap(coordinates[0], coordinates[1]);
    return result
  }
  
function checkOverlap(line1, line2) {
var commonPair = false;
for (var i = 0; i < line1.length; i++) {
    for (var j = 0; j < line2.length; j++) {
    if (line1[i][0] == line2[j][0] && line1[i][1] == line2[j][1]) {
        commonPair = true;
        break;
    }
    }
    if (commonPair) {
    break;
    }
}
if (commonPair) {
    return "OmissionMerge";
} else {
    return "abstraction to existence";
}
}


  