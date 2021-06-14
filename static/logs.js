var group = undefined;

var compare = undefined;
var loop = ['minute','hour'].indexOf(interval) !== -1;
var looping = false;
var timing = undefined;
var logdata = undefined;

var showerrors = false;
var alldata = [];
var datasets = {};

var line = function(data,tgt,key,append=true) {
  //if (group === undefined || alldata === undefined) 
  $('svg.line').html('');
  if (append) {
    alldata = alldata.concat(data);
  } else {
    alldata = data;
    datasets = {};
  }
  if (!key && datasets.length && datasets[0].key) key = datasets[0].key;
  datasets[key] = data;

  var svg = d3.select(tgt),
    margin = {top: 10, right: 5, bottom: 10, left: 60},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x = d3.scaleUtc() // Time for local time
    .rangeRound([0, width]);
  var y = d3.scaleLinear()
    .rangeRound([height, 0]);

  var line = d3.line()
		.curve(d3.curveCatmullRom) // comment this out for straight line
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.val); });

  x.domain(d3.extent((alldata.length ? alldata : data), function(d) { return d.date; })).range([0, width - margin.left - margin.right]);
  y.domain(d3.extent((alldata.length ? alldata : data), function(d) { return d.val; })).nice().range([height - margin.top - margin.bottom, 0]);

  g.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + y.range()[0] + ")")
    .call(d3.axisBottom(x)
			.ticks( 10 )
			.tickSizeOuter(0)
		);

  g.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y)
			.ticks( 10 )
			.tickSizeOuter(0)
		);

  for ( var ds in datasets) {
    var dd = datasets[ds];

    g.append("path")
      .datum(dd)
      .attr("class", "line values")
      .attr("d", line)
  		.style('fill', 'none' )
      .attr("stroke", function(d) { return showerrors ? '#ff0c00' : fill(ds); })
  		.style('stroke-width', '1.3px' );
  
    svg.selectAll("dot")
      .data(dd)
      .enter().append("circle")
      .attr("r", 4)
      .attr("cx", function(d) { return x(d.date) + margin.left; })
      .attr("cy", function(d) { return y(d.val) + margin.top; })
  		.attr("class","holder dot")
      .attr("stroke", function(d) { return showerrors ? '#ff0c00' : fill(ds); })
      .attr("fill", function(d) { return showerrors ? '#ff0c00' : fill(ds); })
  		//.attr("do", "add")
  		.attr("key",function(d) { return d.key ? d.key : (key ? key : 'createdAt'); })
  		.attr("val",function(d) { return d.date.valueOf(); })
  		.style('cursor', 'pointer' )
      .append("title")
      .text(function(d) { return d.val + " on " + (d.text ? d.text : d.date); });
  }
  
  if (!group && !compare) {
    datasets = {};
    alldata = [];
  }
}

var lineit = function(t,tgt,key,append) {
  if (t === undefined) t = [];
	var points = [];
  for ( var d in t ) {
    var text = moment.utc(moment.unix(t[d].key/1000)).format('DD/MM/YYYY HHmm');
    points.push({key:(key ? key : text),text:text,date:t[d].key,val:t[d].doc_count});
  }
  $(tgt).show();
	if ( !$(tgt).attr('height') ) $(tgt).attr('height',$(window).height()-70);
	if ( !$(tgt).attr('width') ) $(tgt).attr('width',$(window).width());
  line(points,tgt,key,append);
}

var q = '*';
if (window.location.search.indexOf('q=') !== -1) q = window.location.search.split('q=')[1].split('&')[0];
var day = 'today';
if (window.location.search.indexOf('day=') !== -1) day = window.location.search.split('day=')[1].split('&')[0];
var interval = 'day';
if (window.location.search.indexOf('interval=') !== -1) interval = window.location.search.split('interval=')[1].split('&')[0];
if (['day','week','month'].indexOf(interval) !== -1) day = '';

var must = [
  {query: {query_string: {query: q}}}
]

if (interval === 'minute') must[1] = {range: {createdAt: {gt: (Date.now()-10800000)}}}; // only 3 hours of minute history
if (interval === 'day') must[1] = {range: {createdAt: {gt: (Date.now()-604800000)}}}; // last 7 days

var qr = {
  query: {
    filtered: {
      query: {
        bool: {
          must: [
          ]
        }
      },
      filter: {
        bool: {
          must: must
        }
      }
    }
  },
  size: 0,
  aggs: {
    logs: {date_histogram: {field: "createdAt", interval: interval}}
  }
}

var getlatest = function() {
  $('.holder.loading').show();
  must[0].query.query_string.query = q;
  if (q !== '*') $('#q').val(q);
  var url = '{{api}}/log' + (compare || day ? '/' : '') + (compare ? compare : day);
  if (window.location.search.indexOf('dev=true') !== -1 && url.indexOf('dev.') === -1) url = url.replace('api.','//dev.');
  if (window.location.search.indexOf('live=true') !== -1 && window.location.search.indexOf('apikey=') !== -1) url = url.replace('dev.','api.');
  if (window.location.search.indexOf('apikey=') !== -1) url += '?apikey=' + window.location.search.split('apikey=')[1].split('&')[0];
  $.ajax({
    url: url,
    type: 'POST',
    contentType: 'application/json',
    dataType: 'JSON',
    data: JSON.stringify(qr),
    success: function (data) {
      logdata = data;
      $('#q').attr('placeholder',($('#q').attr('placeholder') && looping ? parseInt($('#q').attr('placeholder')) : 0) + data.hits.total);
      looping = false;
      lineit(data.aggregations.logs.buckets,'svg.line',(group ? group : (compare ? compare : day)));
      $('.holder.loading').hide();
      if (['hour','minute'].indexOf(interval) !== -1) {
        $('.logcompare').show();
      } else {
        $('.logcompare').hide();
      }
      if (compare) {
        compare = undefined;
      } else if (loop) {
        must[1] = {range: {createdAt: {gt: (Date.now()-1000)}}};
        if (must.length === 3) must.pop();
        if (timing !== undefined) clearTimeout(timing);
        timing = setTimeout(function() { looping = true; getlatest(); },30000);
      }
    }
  });
}

// TODO merge filter into the q change function below
var filter = function(e) {
  try { e.preventDefault(); } catch(err) {}
  q = typeof e === 'string' ? e : url + ':"' + $(this).attr('href') + '"';
  $('svg.line').html('');
  if (interval === 'minute') {
    must[1] = {range: {createdAt: {gt: (Date.now()-10800000)}}}; // only 3 hours of minute history
  } else if (interval === 'hour') {
    must[1] = {range: {createdAt: {gt: (Date.now()-86400000)}}}; // last 24 hours
  } else if (['day','week','month'].indexOf(interval) !== -1) {
    day = '';
    if (interval === 'day') {
      must[1] = {range: {createdAt: {gt: (Date.now()-604800000)}}}; // last 7 days
    } else if (must.length === 2) {
      must.pop();
    }
  } else if (must.length === 2) {
    must.pop();
  }
  getlatest();
}

$('body').on('change','#q',function() {
  if ($('#q').val().indexOf('compare:') === 0 || $('#q').val().indexOf('interval:') === 0) {
    if ($('#q').val().indexOf('compare:') === 0) {
      compare = $('#q').val().replace('compare:','');
    } else if ($('#q').val().indexOf('interval:') === 0) {
      interval = $('#q').val().replace('interval:','');
      qr.aggs.logs.date_histogram.interval = interval;
      if (['day','week','month'].indexOf(interval) !== -1) day = '';
    }
    if (interval === 'month') {
      if (must.length === 3) must.pop();
      if (must.length === 2) must.pop();
    } else if (interval === 'week') {
      if (must.length === 3) must.pop();
      if (must.length === 2) must.pop();
      must.push({range: {createdAt: {gt: Date.now() - 2592000000}}});
    } else if (interval === 'day') {
      if (must.length === 3) must.pop();
      if (must.length === 2) must.pop();
      must.push({range: {createdAt: {gt: Date.now() - 604800000}}});
    } else if (interval === 'hour') {
      if (!day) day = 'today';
      if (must.length === 3) must.pop();
      if (must.length === 2) must.pop();
      //must.push({range: {createdAt: {gt: Date.now() - 86400000}}});
    } else if (interval === 'minute') {
      if (must.length === 3) must.pop();
      if (must.length === 2) must.pop();
      must.push({range: {createdAt: {gt: (Date.now()-10800000)}}}); // only 3 hours of minute history
    } else {
      must.pop();
    }
    $('#q').val('');
    if (timing !== undefined) clearTimeout(timing);
    loop = false;
    qr.aggs.logs.date_histogram.interval = interval;
    $('svg.line').html('');
    getlatest();
  } else {
    q = $('#q').val();
    if (q === '') q = '*';
    filter(q);
  }
});

$('body').on('click','.holder.dot',function() {
  must[1] = {range: {createdAt: {gt: $(this).attr('val')}}};
  if (interval === 'month') {
    interval = 'week';
    must[2] = {range: {createdAt: {lt: (parseInt($(this).attr('val'))+2592000000)}}};
  } else if (interval === 'week') {
    interval = 'day';
    must[2] = {range: {createdAt: {lt: (parseInt($(this).attr('val'))+604800000)}}};
  } else if (interval === 'day') {
    interval = 'hour';
    day = moment($(this).attr('val'), 'x').format('YYYYMMDD');
    while (must.length > 1) must.pop();
  } else if (interval === 'hour') {
    interval = 'minute';
    must[2] = {range: {createdAt: {lt: (parseInt($(this).attr('val'))+3600000)}}};
  }
  $('.logrange.label-info').removeClass('label-info').addClass('label-default');
  $('.logrange[href="' + interval + '"]').removeClass('label-default').addClass('label-info');
  if (timing !== undefined) clearTimeout(timing);
  loop = false;
  qr.aggs.logs.date_histogram.interval = interval;
  $('svg.line').html('');
  getlatest();
});

$('body').on('click','.showerrors',function(e) {
  e.preventDefault();
  interval = 'hour';
  $('.logrange.label-info').removeClass('label-info').addClass('label-default');
  $('.logrange[href="' + interval + '"]').removeClass('label-default').addClass('label-info');
  showerrors = true;
  if (timing !== undefined) clearTimeout(timing);
  loop = false;
  $('.pane').hide();
  $('#logs').show();
  filter('error OR error:*');
});