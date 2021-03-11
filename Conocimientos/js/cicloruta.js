//Es lo que requiere para tener un optimo funcionamiento 
require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/FeatureLayer",
    "esri/widgets/Directions",
    "esri/widgets/Track",
    "dojo/domReady!",
    "esri/widgets/Expand",
  ], function(esriConfig, Map, MapView, FeatureLayer, Directions, Track, Expand) {

    //La apiKey sirve para acceder a los servicios y contenido
    esriConfig.apiKey = "AAPKe5cbac65965142caacc4f99e879243a96wQMcjhjr_Mm6589Qkt56_B-AOFWPshBSJKcBcVTLMojNCQSboxBogAduxYsvrDY";
    
    var map = new Map({
      basemap: "topo-vector"
    });

    var view = new MapView({
      container: "viewDiv",  
      map: map,
      center: [-74.08175, 4.60971],
      zoom: 13            
    });

    view.watch("heightBreakpoint, widthBreakpoint", function() {
        var ui = view.ui;


        if (view.heightBreakpoint === "xsmall" || view.widthBreakpoint === "xsmall") {
          ui.components = ["attribution"];
        } else {
          ui.components = ["attribution", "zoom", "directionWidget", "directions"];
        }
      });

    var track = new Track({
        view: view
      });
      view.ui.add(track, "top-left");

      //Sirve para rastrear su ubicación
      view.when(function() {
        track.start();
      });

      //Capa de entidades trailheads (Diseño puntos)
      var customPoint = new FeatureLayer({
        url:
          "https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/movilidad/cicloparqueadero/MapServer"
        });

    var directionsWidget = new Directions({
        view: view,
        
        //Sirve para realizar una solicitud al servicio de ruta
        routeServiceUrl: "https://sig.simur.gov.co/arcgis/rest/services/MVI_REDBICI/NARedBici/NAServer/Avanzado"
      });

      //Agrega el widget de indicaciones 
      view.ui.add(directionsWidget, {
        position: "top-right"
      });

       //Capa de entidades trailheads (Puntos)
       var trailheadsLayer = new FeatureLayer({
        //Uso de la API (Cicloparqueaderos)
        url: "https://services2.arcgis.com/NEwhEo9GGSHXcRXV/arcgis/rest/services/Cicloparqueaderos_Certificados_Bogota_D_C/FeatureServer/0",
        outFields: ["*"],

        //Widget de ventana emergente 
        popupTemplate: {
          title: "Cicloparqueaderos Certificados Bogota D.C {COD_CICP}",
          content: [
            {
              // También es posible establecer fieldInfos fuera del contenido
              // directamente en popupTemplate. Si no se establece ningún fieldInfos específicamente
              // en el contenido, por defecto es lo que se pueda establecer dentro de popupTemplate

              //Formato tipo fila 

              type: "fields", //FieldsContentElement
              //Sirve para proporcionar información en vistas y capas
              fieldInfos: [
                {
                  fieldName: "COD_CICP",
                  visible: true,
                  label: "Codigo_Cicloparqueadero",
                },
                {
                  fieldName: "NOMBRE_CICP",
                  visible: true,
                  label: "Nombre_Cicloparqueadero",
                },
                {
                  fieldName: "HORARIO_CICP",
                  visible: true,
                  label: "Horario_CicP",
                },
                {
                  fieldName: "DIRECCION",
                  visible: true,
                  label: "DIRECCION",
                },
                {
                  fieldName: "LOCALIDAD",
                  visible: true,
                  label: "LOCALIDAD",
                },
                {
                  fieldName: "CUPOS",
                  visible: true,
                  label: "Cupos_Bici",
                },
                {
                  fieldName: "TIPOLOGIA_CICP",
                  visible: true,
                  label: "Tipologia_Cicloparqueadero",
                },
                {
                  fieldName: "SELLO",
                  visible: true,
                  label: "SELLO_TIPO",
                },
              ],
            },
          ],
        },
      });

      //Sirve para añadir filas 
      map.add(trailheadsLayer);
      //Sirve para añadir diseño a los puntos
      map.add(customPoint);

  });