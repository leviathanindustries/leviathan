// a force directed network graph visualisation
$.fn.holder.display.network = function(obj) {
  var options = obj.holder.options;

	$.fn.holder.display.network.nodesLinks(options.response,options);
	
	if ( !$('div.'+options.class+'.network').length ) {
		obj.append('<div class="' + options.class + ' network" style="outline:1px solid #ccc;margin-top:20px;height:800px;"></div>');
	}
	if ($.fn.holder.display.network.first) {
		$.fn.holder.display.network.first = false;
		var svg = d3.select("." + options.class + ".network").append("svg").attr("width", $("." + options.class + ".network").width()).attr("height", $("." + options.class + ".network").height()).call(d3.zoom().on("zoom", function() { g.attr( "transform", d3.event.transform ); }));
		var g = svg.append("g");
		$.fn.holder.display.network.link = g.append("g").selectAll();
		$.fn.holder.display.network.node = g.append("g").selectAll();
		$.fn.holder.display.network.simulation = d3.forceSimulation($.fn.holder.display.network.nodes)
			.force("charge", d3.forceManyBody().strength(-1 * $("." + options.class + ".network").width()/8))
			.force("link", d3.forceLink($.fn.holder.display.network.links))//.distance(-50 + $("." + options.class + ".network").width()/4))
			//.force("collide",d3.forceCollide().radius(1 /*function(d) { return d.r + 5; }*/).iterations(2) )
			.force("center", d3.forceCenter($("." + options.class + ".network").width() / 2, $("." + options.class + ".network").height() / 2))
			.force("x", d3.forceX())
			.force("y", d3.forceY())
			.on("tick", $.fn.holder.display.network.tick);
	}

	function dragstarted(d) {
		if (!d3.event.active) $.fn.holder.display.network.simulation.alphaTarget(0.3).restart();
		d.fx = d.x;
		d.fy = d.y;
	}
	function dragged(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}
	function dragended(d) {
		if (!d3.event.active) $.fn.holder.display.network.simulation.alphaTarget(0);
		d.fx = null;
		d.fy = null;
	}

	function network() {
		$.fn.holder.display.network.node = $.fn.holder.display.network.node.data($.fn.holder.display.network.nodes);
		$.fn.holder.display.network.node = $.fn.holder.display.network.node.enter()
			.append("g")
			.on("click", function(d) { $.fn.holder.display.network.click(d); })
			.call(d3.drag()
				.on("start", dragstarted)
				.on("drag", dragged)
				.on("end", dragended))
			.merge($.fn.holder.display.network.node);
		$.fn.holder.display.network.node
			.append("circle")
			.attr("r", function(d) { return $.fn.holder.display.network.radius(d,options); })
			.attr("fill", function(d) { return $.fn.holder.display.network.fill(d); })
			.style("cursor","pointer")
			.attr("stroke", "#fff")
			.attr("stroke-width", 1)
			.append("svg:title").text(function(d) { return $.fn.holder.display.network.label(d); });

		$.fn.holder.display.network.node
			.append("text")
			.classed("nodeText",true)
			.text(function(d) { return $.fn.holder.display.network.text(d); })
      .attr("dx", 1) // offset from center
      .attr("dy", 1);

		$.fn.holder.display.network.node.exit().remove();

		$.fn.holder.display.network.link = $.fn.holder.display.network.link.data($.fn.holder.display.network.links);
		$.fn.holder.display.network.link.exit().remove();
		$.fn.holder.display.network.link = $.fn.holder.display.network.link.enter().append("line").merge($.fn.holder.display.network.link);
		$.fn.holder.display.network.link
			.attr("stroke","grey")
			.attr("stroke-width", 0.2)

		$.fn.holder.display.network.simulation.nodes($.fn.holder.display.network.nodes);
		$.fn.holder.display.network.simulation.force("link").links($.fn.holder.display.network.links);
		$.fn.holder.display.network.simulation.alpha(1).restart();
		$.fn.holder.display.network.styles();
	}

	network();
}

$.fn.holder.display.network.simulation;
$.fn.holder.display.network.first = true;

$.fn.holder.display.network.nodes = [];
$.fn.holder.display.network.links = [];

$.fn.holder.display.network.radius = function(d,options) {
	if (d.size === undefined) d.size = 1;
	var r = d3.scaleLinear().domain([0,d3.max($.fn.holder.display.network.nodes,function(d,i) { return d.size; })]).range([5,$("." + options.class + ".network").width()/16]);
	return r(d.size);
}
var fl = d3.scaleOrdinal(d3.schemeCategory20c);
$.fn.holder.display.network.fill = function(d) { return fl(d.group); }
$.fn.holder.display.network.label = function(d) { return d.key + ': ' + d.value + ' (' + d.size + ')'; }
$.fn.holder.display.network.text = $.fn.holder.display.network.label;

$.fn.holder.display.network.position = function(d,y,t) {
	if (y !== undefined && y !== 'x') {
		y = 'y';
	} else {
		y = 'x';
	}
	if (t === undefined && d.source !== undefined && d.source[y] !== undefined) {
		return d.source[y];
	} else if (t && d.target !== undefined && d.target[y] !== undefined) {
		return d.target[y];
	} else {
		return d[y];
	}
}

$.fn.holder.display.network.tick = function() {
	//$.fn.holder.display.network.node.attr("cx", function(d) { return $.fn.holder.display.network.position(d); })
	//	.attr("cy", function(d) { return $.fn.holder.display.network.position(d,'y'); });
	$.fn.holder.display.network.node.attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")";})
	$.fn.holder.display.network.link.attr("x1", function(d) { return $.fn.holder.display.network.position(d); })
		.attr("y1", function(d) { return $.fn.holder.display.network.position(d,'y'); })
		.attr("x2", function(d) { return $.fn.holder.display.network.position(d,'x',true); })
		.attr("y2", function(d) { return $.fn.holder.display.network.position(d,'y',true); });
}

$.fn.holder.display.network.click = function(d) {
	var fq = {term:{}};
	fq.term[d.key] = d.value;
	if ($.fn.holder.options.query.query.filtered.filter === undefined) $.fn.holder.options.query.query.filtered.filter = {};
	if ($.fn.holder.options.query.query.filtered.filter.bool === undefined) $.fn.holder.options.query.query.filtered.filter.bool = {};
	if ($.fn.holder.options.query.query.filtered.filter.bool.must === undefined) $.fn.holder.options.query.query.filtered.filter.bool.must = [];
	$.fn.holder.options.query.query.filtered.filter.bool.must.push(fq);
	$.fn.holder.options.execute();
}

$.fn.holder.display.network.nodesLinks = function(data,options) {
	if (!options.paging) {
		$.fn.holder.display.network.nodes = [];
		$.fn.holder.display.network.links = [];
	}
	// TODO what about when paging backwards, how does it affect the result set?
	for ( var ri in data.hits.hits ) {
		var rec = data.hits.hits[ri]._source !== undefined ? data.hits.hits[ri]._source : data.hits.hits[ri].fields;
		var nrec = {
			key: 'statement', // TODO these should not be set here
			value: rec.statement,
			size: rec.occurrence,
			group: rec.type
		}
		for ( var an in data.aggregations ) {
			var dta = dotindex(rec,an.replace('.exact',''));
			if ( dta ) nrec[an] = dta;
		}
		$.fn.holder.display.network.nodes.push(nrec);
		if (!$.fn.holder.display.network.first) {
			for ( var o in rec ) {
				for ( var nx = 0; nx < $.fn.holder.display.network.nodes.length; nx++ ) {
					var cr = typeof rec[o] === 'string' ? [rec[o]] : rec[o]; // what about nested objects? should prob use dotindex...
				  if ($.fn.holder.display.network.nodes[nx].key === o && cr.indexOf($.fn.holder.display.network.nodes[nx].value) !== -1) {
						$.fn.holder.display.network.links.push({"source":$.fn.holder.display.network.nodes.length-1,"target":nx});
					}
				}
			}
		}
	}
	for ( var i in data.aggregations ) {
		var arrs = data.aggregations[i].buckets;
		for ( var bi in arrs ) {
			var arr = {
				key: i,
				value: arrs[bi].key,
				size: 1, //arr.doc_count;
				group: i
			}
			$.fn.holder.display.network.nodes.push(arr);
			for ( var x = 0; x < $.fn.holder.display.network.nodes.length; x++ ) {
				if ( $.fn.holder.display.network.nodes[x][i] === arr.value || ( $.fn.holder.display.network.nodes[x][i] !== undefined && $.fn.holder.display.network.nodes[x][i].indexOf(arr.value) !== -1 ) ) {
					$.fn.holder.display.network.links.push({"source":$.fn.holder.display.network.nodes.length-1,"target":x});
				}
			}
		}
	}
}

