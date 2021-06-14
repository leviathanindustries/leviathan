
var graph = function(data) {

  var svg = d3.select('svg.graph'),
    //margin = {top: 100, right: 100, bottom: 30, left: 40},
    margin = {top: 10, right: 5, bottom: 10, left: 60},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
  var x = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

  //var x1 = d3.scaleBand()
  //  .padding(0.05);

  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  x.domain(data.map(function(d) { return d.key; }));
  //x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  //y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  g.append("g")
    .selectAll("g")
    .data(data)
    //.enter().append("g")
    //  .attr("transform", function(d) { return "translate(" + x0(d[graphgroup]) + ",0)"; })
    //.selectAll("rect")
    //.data(function(d) { return keys.map(function(key) { var val = d[key] ? d[key] : 0; return {key: key, value: val}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("group", function(d) {return d.group; })
      .attr("width", function(d) {return x.bandwidth(); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return fill(d.group); })
  		.attr("class","graph bar")
  		.style('cursor', 'pointer' )
    .append("title")
      .text(function(d) { return d.key + " " + d.value; });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      //.call(d3.axisBottom(x));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(10, "s").tickSize(-(width), 0, 0).tickSizeOuter(0));

}

var graphdata = undefined;
var graphit = function(showgroup,which='endpoints') {
  var qr = { query: { filtered: {
    query: { bool: { must: [] } }, filter: { bool: {
      must: [] //must
    }}}}, size: 0, 
    facets: {
      items: {terms: {field: 'endpoint.exact', order: 'term', size: 1000}}
    }
  }
  if (which === 'functions') qr.facets.items.terms.field = 'function'; 

  var _graph = function(data) {
  	$('svg.graph').html("");
  	var res = [];
  	for ( var d in data.facets.items.terms ) {
  	  var dt = data.facets.items.terms[d];
  	  var group = (dt.term.startsWith('/') ? dt.term.replace('/','') : dt.term).replace(/\//g,'.').replace('API.','').replace('api.','').replace('service.','').replace('use.','').split('.')[0];
  		if (!showgroup || group === showgroup) {
    		res.push({
    		  key: dt.term, 
    		  value: dt.count, 
    		  group: group
    		});
  		}
  	}
    graph(res);
  }

  if (showgroup && graphdata) {
    _graph(graphdata);
  } else {
    $.ajax({
      url: api + '/log',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'JSON',
      data: JSON.stringify(qr),
      success: function(data) {
        graphdata = data;
        _graph(data);
      }
    });
  }
}


