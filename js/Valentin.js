// ----------------------------
// MAPA, CAPAS E INTERACTIVIDAD
// ----------------------------
var projection = ol.proj.get('EPSG:3857');
   
var overlayGroup = new ol.layer.Group({
        title: 'Capas',
        layers: [
        ]
    });

var map = new ol.Map({ 
   layers: [
            new ol.layer.Group({
                'title': 'Mapas Base',
                layers: [
                    new ol.layer.Tile({
                        title: 'OSM',
                        type: 'base',
                        source: new ol.source.OSM()
                    }),
                    
                    new ol.layer.Tile({
                        title: 'Stamen - Water color',
                        type: 'base',
                        visible: false,
                        source: new ol.source.Stamen({
                            layer: 'watercolor'
                        })
                    }),
                    new ol.layer.Tile({
                        title: 'Stamen - Toner',
                        type: 'base',
                        visible: false,
                        source: new ol.source.Stamen({
                            layer: 'toner'
                        })
                    })
                ]
            }),
            overlayGroup
        ],
    target: 'map', 
    view: new ol.View({ 
      center: ol.proj.fromLonLat([-67.0852, -39.1037]), 
      projection: projection,
      zoom: 14 }) 
});

var layerSwitcher = new ol.control.LayerSwitcher();
map.addControl(layerSwitcher);

overlayGroup.getLayers().push(
        new ol.layer.Vector({title: 'Barrios', visible: false,
          source: new ol.source.Vector({
          url: '../bases/BARRIOS.kml',
          format: new ol.format.KML() })  })
);

overlayGroup.getLayers().push(
        new ol.layer.Vector({title: 'Loteos', 
          source: new ol.source.Vector({
          url: '../bases/LOTEOS.kml',
          format: new ol.format.KML() })  })
);

overlayGroup.getLayers().push(
        new ol.layer.Vector({title: 'Sectores', visible: false,
          source: new ol.source.Vector({
          url: '../bases/SECTORES.kml',
          format: new ol.format.KML() })  })
);

overlayGroup.getLayers().push(
        new ol.layer.Vector({title: 'Límite Urbano', visible: false,
          source: new ol.source.Vector({
          url: '../bases/LIMITE_1.kml',
          format: new ol.format.KML() })  })
);


layerSwitcher.showPanel();



var featureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector(),
    map: map,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#f00',
        width: 1 }),
      fill: new ol.style.Fill({
        color: 'rgba(255,0,0,0.1)' })
    })
});

// ----------------------------
// INFORMACIÓN ANEXA A LOS MAPAS
// ----------------------------
var highlight;


document.getElementById("comentarios").style.display = "none";
    document.getElementById("L_detalla").style.display = "none";
    document.getElementById("L_etapas").style.display = "none";
    document.getElementById("adjudica").style.display = "none";
    document.getElementById("PAGO1").style.display = "none";
    document.getElementById("PAGO2").style.display = "none";


var displayFeatureInfo = function(pixel) {
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) { return feature; });
    var info = document.getElementById('info');

    document.getElementById("comentarios").style.display = "none";
    document.getElementById("L_detalla").style.display = "none";
    document.getElementById("L_etapas").style.display = "none";
    document.getElementById("adjudica").style.display = "none";
    document.getElementById("PAGO1").style.display = "none";
    document.getElementById("PAGO2").style.display = "none";
    if (feature) {
    
        for (x in obj["rows"]) {
            if (obj["rows"][x][0] === feature.get('name')) { 
                document.getElementById("L_detalla").style.display = "inline";                 
                document.getElementById("detalla").rows[1].cells[0].innerHTML =obj["rows"][x][0];
                document.getElementById("detalla").rows[1].cells[1].innerHTML =obj["rows"][x][3];
                document.getElementById("detalla").rows[1].cells[2].innerHTML =obj["rows"][x][4];
                document.getElementById("detalla").rows[1].cells[3].innerHTML =obj["rows"][x][5];                  
                break; }
        }
        var list = document.getElementById("historial");
        // As long as <ul> has a child node, remove it
        while (list.hasChildNodes()) {  list.removeChild(list.firstChild); }
        for (x in obj2["rows"]) {
            if (obj2["rows"][x][0] === feature.get('name')) {      
                document.getElementById("comentarios").style.display = "inline"; 
                var y = document.createElement("LI");
                texto="<DIV ALIGN=right>";
                texto +=obj2["rows"][x][4];
                texto +="</DIV>    <H4>";
                texto +=obj2["rows"][x][5];
                texto +="</H4>  <b>";
                texto +=obj2["rows"][x][6];
                texto +="   </b>";
                texto +=obj2["rows"][x][7];
                y.innerHTML = texto;
                document.getElementById("historial").appendChild(y); }
        }
        var list2 = document.getElementById("my_lu");
        // As long as <ul> has a child node, remove it
        while (list2.hasChildNodes()) {  list2.removeChild(list2.firstChild); }

        for (x in obj3["rows"]) {
            if (obj3["rows"][x][0] === feature.get('name')) {      
                if (obj3["rows"][x][1] === "CONTRATO") {     
                    document.getElementById("L_etapas").style.display = "inline"; 
                    document.getElementById("TI_L_etapas").innerHTML = obj3["rows"][x][2]; 
                    var y = document.createElement("LI");    
                    if (obj3["rows"][x][4] === "SI") {y.className = 'checked';}
                    var t = document.createTextNode(obj3["rows"][x][3]);       
                    y.appendChild(t);                                
                    list2.appendChild(y);}
                if (obj3["rows"][x][1] === "INVOLUCRADOS") {     
                    document.getElementById("adjudica").style.display = "inline"; 
                    document.getElementById("T_adjudica").innerHTML = obj3["rows"][x][2]; 
                    document.getElementById("N_adjudica").innerHTML = obj3["rows"][x][5]; }
                if (obj3["rows"][x][1] === "PAGO1") {     
                    var list2 = document.getElementById("fillgauge1");
                    // As long as <ul> has a child node, remove it
                    while (list2.hasChildNodes()) {  list2.removeChild(list2.firstChild); }
                    document.getElementById("PAGO1").style.display = "inline"; 
                    document.getElementById("T_PAGO1").innerHTML = obj3["rows"][x][2];
                    var gauge1 = loadLiquidFillGauge("fillgauge1", obj3["rows"][x][5]);
                    var config1 = liquidFillGaugeDefaultSettings();
                    config1.circleColor = "#FF7777";
                    config1.textColor = "#FF4444";
                    config1.waveTextColor = "#FFAAAA";
                    config1.waveColor = "#FFDDDD";
                    config1.circleThickness = 0.2;
                    config1.textVertPosition = 0.2;
                    config1.waveAnimateTime = 7000;
                    config1.waveHeight = 0.3;
                    config1.waveCount = 1; 
                    config1.valueCountUp = true; }
                if (obj3["rows"][x][1] === "PAGO2") {     
                    var list3 = document.getElementById("fillgauge2");
                    // As long as <ul> has a child node, remove it
                    while (list3.hasChildNodes()) {  list3.removeChild(list3.firstChild); }
                    document.getElementById("PAGO2").style.display = "inline"; 
                    document.getElementById("T_PAGO2").innerHTML = obj3["rows"][x][2];
                    var gauge2 = loadLiquidFillGauge("fillgauge2", obj3["rows"][x][5]);
                    var config2 = liquidFillGaugeDefaultSettings();
                    config2.circleColor = "#FF7777";
                    config2.textColor = "#FF4444";
                    config2.waveTextColor = "#FFAAAA";
                    config2.waveColor = "#0101DF";
                    config2.circleThickness = 0.2;
                    config2.textVertPosition = 0.2;
                    config2.waveAnimateTime = 7000;
                    config2.waveHeight = 0.3;
                    config2.waveCount = 1; 
                    config2.valueCountUp = true;  }
        }
    }
    } else {           // Si ninguna Capa del Mapa es Seleccionada
        document.getElementById("comentarios").style.display = "none";
        document.getElementById("L_detalla").style.display = "none";
        document.getElementById("L_etapas").style.display = "none";
        document.getElementById("adjudica").style.display = "none";
        document.getElementById("PAGO1").style.display = "none";
        document.getElementById("PAGO2").style.display = "none";
        document.getElementById("detalla").rows[1].cells[0].innerHTML ='&nbsp;';
        document.getElementById("detalla").rows[1].cells[1].innerHTML ='&nbsp;';
        document.getElementById("detalla").rows[1].cells[2].innerHTML ='&nbsp;';
        document.getElementById("detalla").rows[1].cells[3].innerHTML ='&nbsp;';
    }

    if (feature !== highlight) {
        if (highlight) { featureOverlay.getSource().removeFeature(highlight); }
        if (feature) { featureOverlay.getSource().addFeature(feature); }
        highlight = feature; }
};

var info = $('#info');
      info.tooltip({
        animation: false,
        trigger: 'manual'
      });

var displayFeatureInfo2 = function(pixel) {
    info.css({
        left: pixel[0] + 'px',
        top: (pixel[1] - 15) + 'px' });
    var feature2 = map.forEachFeatureAtPixel(pixel, function(feature) { return feature; });
        if (feature2) {
            for (x in obj["rows"]) {
                if (obj["rows"][x][0] === feature2.get('name')) {      
                   texto4=obj["rows"][x][3] ;
                   texto4 +=": ";
                   texto4 +=obj["rows"][x][5];
                   info.tooltip('hide')
                       .attr('data-original-title', texto4)
                       .tooltip('fixTitle')
                       .tooltip('show');
                }
            }       
        } else {
          info.tooltip('hide');
        }
};

map.on('pointermove', function(evt) {
    if (evt.dragging) {
        info.tooltip('hide');
        return; }
    displayFeatureInfo2(map.getEventPixel(evt.originalEvent)); });

map.on('click', function(evt) {
    if (evt.dragging) { return; }
    var pixel = map.getEventPixel(evt.originalEvent);
    displayFeatureInfo(pixel); });
  