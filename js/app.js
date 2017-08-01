//Data Model
var Universitys = [{
    title: "Al Azhar University",
    lat: 30.049705,
    lng: 31.334294
  },
  {
    title: "Cairo University",
    lat: 30.0273365,
    lng: 31.2063854
  },
  {
    title: "Ain Shams University",
    lat: 30.0734925,
    lng: 31.2840393
  },
  {
    title: "Modern Sciences and Arts University",
    lat: 29.9516879,
    lng: 30.9529513
  },
  {
    title: "German University in Cairo",
    lat: 30.2781764,
    lng: 30.6759103
  },
  {
    title: "The American University in Cairo",
    lat: 30.0781691,
    lng: 31.3382455
  },
  {
    title: "Assiut University",
    lat: 27.1888822,
    lng: 31.1664003
  },
  {
    title: "Alexandria University",
    lat: 31.2104974,
    lng: 29.8431879
  }

];
// create style for maps
var style = [

  {
    elementType: 'geometry',
    stylers: [{
      color: '#242f3e'
    }]
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#242f3e'
    }]
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#746855'
    }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#d59563'
    }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#d59563'
    }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{
      color: '#263c3f'
    }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#6b9a76'
    }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{
      color: '#38414e'
    }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#212a37'
    }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#9ca5b3'
    }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{
      color: '#746855'
    }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
      color: '#1f2835'
    }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#f3d19c'
    }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{
      color: '#2f3948'
    }]
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#d59563'
    }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{
      color: '#17263c'
    }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#515c6d'
    }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{
      color: '#17263c'
    }]
  }


];

function ViewModel() {
  var self = this;
  self.Visible = ko.observableArray([]);
  self.mMap = ko.observableArray([]);
  self.Searchquery = ko.observable('');

  function render() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 30.0781691,
        lng: 31.3382455
      },
      styles: style,
      zoom: 6
    });
    var infowindow = new google.maps.InfoWindow({});

    Universitys.forEach(function (university) {
      //Ajax request wikipedia Api
      $.ajax({
        url: 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&callback=wikiCallBack&search=',
        data: {
          action: 'opensearch',
          search: university.title,
          format: 'json'
        },
        dataType: 'jsonp'
      }).done(
        function (data) {
          marker.content = '<h3>' + data[1][0] + '</h3>' + '<div>' + '<p>' + data[2][0] + '</p>' + '</div>' + '<a href="' + data[3][0] + '">wikipedia</a>';
        }).fail(function (jqXHR, textStatus) {
        // if request Failed Alert user
        //$(".row").append('<h2>failed to get wikipedia resources</h2><br>');
        alert('failed to get wikipedia resources');
      });
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(university.lat, university.lng),
        map: map,
        title: university.title,
        description: university.description,
        URL: university.URL,
        listC: function (thisMarker) {
          infowindow.setContent(marker.content);
          infowindow.open(map, thisMarker);
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function () {
            marker.setAnimation(null);
          }, 1000);
        }
      });
      self.Visible.push(marker);
      self.mMap.push(marker);
      marker.addListener('click', function () {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function () {
            marker.setAnimation(null);
          }, 1000);

        }
        infowindow.setContent(marker.content);
        infowindow.open(map, marker);
      });
    });
  }
  // search and visible marker or unvisible marker

  self.Searchquery.subscribe(function (item) {
    for (var i = 0; i < self.mMap().length; i++) {

      self.mMap()[i].setVisible(false);
      self.Visible.remove(self.mMap()[i]);

    }
    for (var j = 0; j < self.mMap().length; j++) {
      if (self.mMap()[j].title.toLowerCase().indexOf(item.toLowerCase()) >= 0) {
        self.mMap()[j].setVisible(true);
        self.Visible.push(self.mMap()[j]);

      }
    }
  });
  var ErrorMap = function () {
    alert('Google Maps can not load');
  };
  google.maps.event.addDomListener(window, 'load', render);
}