(function() {
  var graticule, height, magnitude, map_austral, map_boreal, maps, path_generator_austral, path_generator_boreal, projection_austral, projection_boreal, svg, width, zoom;

  svg = d3.select('svg');

  width = svg[0][0].getBoundingClientRect().width;

  height = svg[0][0].getBoundingClientRect().height;

  projection_boreal = d3.geo.azimuthalEquidistant().scale(150).rotate([180, -90, 0]).center([0, 0]).translate([width / 4 + 4.35, height / 2]).precision(.1).clipAngle(90 + 1e-3);

  projection_austral = d3.geo.azimuthalEquidistant().scale(150).rotate([0, 90, 0]).center([0, 0]).translate([3 * width / 4 - 4.35, height / 2]).precision(.1).clipAngle(90 + 1e-3);

  graticule = d3.geo.graticule().minorStep([15, 10]).majorStep([90, 10]);

  path_generator_boreal = d3.geo.path().projection(projection_boreal);

  path_generator_austral = d3.geo.path().projection(projection_austral);

  /* create maps groups
  */

  maps = svg.append('g');

  map_boreal = maps.append('g').attr('id', 'map_boreal');

  map_austral = maps.append('g').attr('id', 'map_austral');

  /* draw the graticules
  */

  map_boreal.append('path').datum(graticule).attr('class', 'graticule').attr('d', path_generator_boreal);

  map_austral.append('path').datum(graticule).attr('class', 'graticule').attr('d', path_generator_austral);

  /* define a zoom behavior
  */

  zoom = d3.behavior.zoom().scaleExtent([1, 20]).on('zoom', function() {
    return maps.attr('transform', "translate(" + (zoom.translate()) + ")scale(" + (zoom.scale()) + ")");
  });

  /* bind the zoom behavior to the main SVG
  */

  svg.call(zoom);

  /* define a scale for magnitude
  */

  magnitude = d3.scale.quantize().domain([-1, 7]).range([7, 6, 5, 4, 3, 2, 1, 0.4, 0.2]);

  d3.csv('hygfull.csv', function(data) {
    map_boreal.selectAll('.star').data(data.filter(function(d) {
      return +d.Mag <= 7 && +d.Dec > 0;
    })).enter().append('circle').attr('class', 'star').attr('r', function(d) {
      return magnitude(+d.Mag) / 2;
    }).attr('transform', function(d) {
      var x, y, _ref;
      _ref = projection_boreal([-d.RA * (360 / 24), +d.Dec]), x = _ref[0], y = _ref[1];
      return "translate(" + x + "," + y + ")";
    });
    return map_austral.selectAll('.star').data(data.filter(function(d) {
      return +d.Mag <= 7 && +d.Dec <= 0;
    })).enter().append('circle').attr('class', 'star').attr('r', function(d) {
      return magnitude(+d.Mag) / 2;
    }).attr('transform', function(d) {
      var x, y, _ref;
      _ref = projection_austral([-d.RA * (360 / 24), +d.Dec]), x = _ref[0], y = _ref[1];
      return "translate(" + x + "," + y + ")";
    });
  });

}).call(this);
