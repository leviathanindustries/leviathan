
/* ---------------------------------------------------------------------
 * numbering - adds section numbering to headers
 * ---------------------------------------------------------------------
 */
(function($){
  $.fn.numbering = function(options) {
    // specify the defaults
    var defaults = {
        ignore: '.ignore',
    };
    // and add in any overrides from the call
    var options = $.extend(defaults, options);
    // do the function
    return this.each(function() {
      // get this object
      obj = $(this);

      // prepare an array to represent numbers e.g 1.1.1
      var counts = new Array();
      counts[0] = 0;
      var currpos = 0;
      var prevheader = 0;

      // for every header in this obj that is not marked to ignore
      $(':header', obj).not(options.ignore).each(function() {
        var thisheader = $(this)[0].nodeName.replace(/[A-z]/gi,'');
        if ( prevheader == 0 ) {
          prevheader = thisheader;
        }
        var hdiff = thisheader - prevheader;
        if ( hdiff > 0 ) {
          currpos = counts.push(1) - 1;
        } else if ( hdiff == 0 ) {
          counts[currpos] = counts[currpos] + 1;
        } else if ( hdiff < 0 ) {
          var pops = 0;
          while (pops > hdiff) {
            counts.pop();
            pops = pops - 1;
          }
          currpos = currpos + hdiff;
          counts[currpos] = counts[currpos] + 1;
        }
        prevheader = thisheader;
        $(this).prepend('<span class="toc_header">' + counts.toString().replace(/,/gi,'.') + ' </span>');
      });
    }); // end of the function
  };
})(jQuery);



/* ---------------------------------------------------------------------
 * toc - build a stand-alone table of contents for the document
 * ---------------------------------------------------------------------
 */
(function($){
  $.fn.toc = function(options) {
    // specify the defaults
    var defaults = {
      prependto: $('#contents').length ? '#contents' : this,
      depth: 6,
      statictoo: false,
      statictoodepth: 3,
      refscrolloffset:40,
      ignore: '.ignore'
    };

    var tocontent = function(event) {
      event.preventDefault();
      window.scrollTo( 0, ($('a[name=' + $(this).attr('href').replace('#','') + ']').offset().top - options.refscrolloffset) )
    }

    // and add in any overrides from the call
    var options = $.extend(defaults, options);
    // do the function
    return this.each(function() {
      var tid = 'TOC_' + options.prependto.replace('#','');
      // get this object
      obj = $(this);

      // function to get only the text of current element, not including children text
      $.fn.textonly = function() {
        return $(this).clone().children().remove().end().text();
      };
      // function to indent by spaces based on header type
      $.fn.indent = function() {
        var eltype = ( jQuery(this)[0].nodeName.replace(/[A-z]/,'') - 1 ) * 4;
        var count = 0;
        var output = "";
        while (count < eltype) {
          count = count + 1;
          output = output + "&nbsp;";
        };
        return output;
      };

      // add a TOC div to the page where required
      $(options.prependto).prepend('<div id="' + tid + '"><ul style="list-style-type:none;margin-left:-50px;"></ul></div>');

      if ( options.statictoo ) {
        // put a contents nav on the top that shows when contents is not in view
        $('body').append('<div id="toc_nav" style="display:none;z-index:1000000000;position:fixed;top:0;left:5px;padding:4px 6px 4px 6px;background-color:#333;color:#ccc;-webkit-border-radius: 0 0 4px 4px;-moz-border-radius: 0 0 4px 4px;border-radius: 0 0 4px 4px;-webkit-box-shadow: inset 0 3px 5px rgba(0,0,0,.05);-moz-box-shadow: inset 0 3px 5px rgba(0,0,0,.05);box-shadow: inset 0 3px 5px rgba(0,0,0,.05);"><ul style="list-style-type:none;margin:0px;"><li><a id="navopts" style="color:#ccc;" href="#">CONTENTS</a></li></ul></div>');
      }

      // for each header in the apdoc,
      $(':header', obj).not(options.ignore).each(function() {
        var d = jQuery(this)[0].nodeName.replace(/[A-z]/,'');
        if ( d <= options.depth ) {
          // define the anchor name
          var anchorname = $(this).textonly().replace(/\s/gi,'');
          // create the anchor tag and push it onto the TOC
          $(this).append('<a class="toc_anchor" name="' + anchorname + '"></a>');
          var hdr = $(this).find('.toc_header').html();
          hdr == null ? hdr = '' : hdr = hdr + ' ';
          $('#' + tid + ' ul').append('<li>' + $(this).indent() + hdr + '<a class="tocontent" href="#' + anchorname + '">' + $(this).textonly() + '</a></li>');
          if ( options.statictoo && d <= options.statictoodepth ) {
            $('#toc_nav ul').append('<li>' + $(this).indent() + hdr + '<a class="tocontent" href="#' + anchorname + '">' + $(this).textonly() + '</a></li>');
          }
        };
      });
      $('.tocontent').unbind('click').bind('click',tocontent);

      if ( options.statictoo ) {
        // show the contents nav as appropriate, in expanded or collapsed form
        var offtop = $('#' + tid).offset().top;
        var offbottom = $('#' + tid).offset().top + $('#' + tid).height();
        $(window).scroll(function() {
          if ( (offtop < $(window).scrollTop() && $(window).scrollTop() < offbottom) || $(window).scrollTop() < 200 ) {
            $('#toc_nav').hide();
          } else {
            $('#toc_nav').show();
          }
        });

        var origmrg = '';
        var navopts = function(event) {
          event.preventDefault();
          if ( $(this).hasClass('collapsed') ) {
            $(this).removeClass('collapsed');
            $(this).parent().siblings().show();
            origmrg = obj.css('marginLeft');
            obj.css({'margin-left':$('#toc_nav').width() + 'px'});
          } else {
            $(this).addClass('collapsed');
            $(this).parent().siblings().hide();
            obj.css({'margin-left':origmrg});
          }
        };
        $('#navopts').bind('click',navopts);
        $('#navopts').trigger('click');
      }

    }); // end of the function
  };
})(jQuery);


/* ---------------------------------------------------------------------
 * referencing - search for references, style them and build a reference section
 * default refs are <a class="refs"> tags
 * ---------------------------------------------------------------------
 */
(function($){
  $.fn.references = function(options) {
    // specify the defaults
    var defaults = {
      identifier: 'a',
      ignore: '.ignore',
      url: '/query/reference/',
      refscrolloffset: 40,
      appendto: $('#references').length ? '#references' : this // wherever the references div should be appended
    };
    // and add in any overrides from the call
    var options = $.extend(defaults, options);

    var storeref = function(obj) { // TODO: this is not implemented yet
      var link = obj.attr('href');
      var data = {
        'id': reference,
        'link':[{'url':link}]
      };
      obj.attr('data-title') ? data.title = obj.attr('data-title') : false;
      obj.attr('data-author') ? data.author = obj.attr('data-author').split(',') : false;
      obj.attr('data-journal-name') ? data.journal = {"name":obj.attr('data-journal-name')} : false;
      if ( link.indexOf('doi') >= 0 ) {
        data.identifier = [{'type':'doi','id':link.replace('http://dx.doi.org/','')}];
      };
      // post the ref to the storage
      $.ajax({
        'type':'POST',
        'url': options.url.replace('_search','') + reference,
        "data":JSON.stringify(data),
        "contentType":"application/json; charset=utf-8",
        "processData":false
      });
      return data;
    }

    // a click event so the ref pointer goes to the reference in the list
    var gotoref = function(event) {
      event.preventDefault();
      var number = $(this).html().replace('[','').replace(']','');
      window.scrollTo( 0, ($('.reftocite:contains(' + number + ')').offset().top - options.refscrolloffset) )
    }

    // then a click to jump back to the reference in the page
    var backtocite = function(event) {
      event.preventDefault();
      window.scrollTo( 0, ($('a:contains([' + $(this).attr('href') + '])', obj).offset().top - options.refscrolloffset) )
    }

    // the function that writes the reference to the page
    var writeref = function(data,counter,ident,obj) {
      // create the reference string
      if ( data.missing ) {
        var reference = "? ";
        if ( obj.attr('href') ) {
          reference += '<a target="_blank" href="' + obj.attr("href") + '">' + obj.attr("href") + '</a>';
        }
      } else {
        var reference = "";
        if ( data.author ) {
          for ( var i = 0; i < data.author.length; i++ ) {
            var nm = data.author[i].name
            if ( nm ) {
              if ( i != 0 ) { reference += ", "; }
              reference += nm;
            }
          }
          reference.length > 0 ? reference += " " : false;
        }
        if ( data.year ) {
          reference += "(" + data.year + ") ";
        }
        reference.length > 0 ? reference += '<br>' : false;
        if ( data.title ) {
          reference += '<b>' + data.title + '</b>';
        }
        if ( data.journal ) {
          reference += '<br>';
          if ( data.journal.title ) {
            reference += ' in <i>' + data.journal.title + '</i>';
          }
          if ( data.journal.name ) {
            reference += ' in ' + data.journal.name;
          }
          if ( data.journal.volume ) {
            reference += " " + data.journal.volume;
          }
          if ( data.journal.issue ) {
            reference += " (" + data.journal.issue + ')';
          }
        }
        if ( data.publisher ) {
          if ( typeof(data.publisher) == "string" ) {
            reference += '<br>' + data.publisher;
          } else {
            reference += '<br>' + data.publisher.name;
          }
        }
      }

      // update the in-document reference link
    	obj.html('[' + counter + ']');
    	obj.attr('alt','#' + ident + ": " + data.title);
    	obj.attr('title','#' + ident + ": " + data.title);
    	obj.addClass('hidden-print');
    	obj.after('<span class="printref">[' + counter + ']</span>');

      // add the link to the ref if possible
      if ( data.link ) {
        reference += '<br><a class="hidden-print" target="_blank" href="' + data.link[0].url + '">' + data.link[0].url + '</a>';
        reference += '<span class="printref">' + data.link[0].url + '<br>(last accessed 30/09/2015)</span>';
      }

    	// then append reference to the docdiv
    	var reftab = '<tr class="references">' +
  	    '<td style="text-align:right;border:none;"><a class="hidden-print reftocite" alt="^ back to ' + ident +
  	    '" title="^ back to ' + ident + '" href="' + counter + '">' + counter +
  	    '</a><span class="printref">' + counter + '</span></td><td class="theref" style="border:none;"><p>' + reference + '</p></td></tr>';
      $('#reftable').append(reftab);

      // and attach click events
      $('.reftocite').last().bind('click',backtocite);
    	obj.bind('click',gotoref);
    }

    writerefs = function(data) {
      $(options.appendto).append('<table class="table" id="reftable"></table>');
      var refs = {};
      for ( var i = 0; i < data.hits.hits.length; i++ ) {
        var d = data.hits.hits[i]['_source'];
        refs[d['id']] = d;
      }
      $(options.identifier + ':contains("#")', obj).not(options.ignore).each(function(index) {
        var counter = index + 1;
        var ident = $(this).html().replace('#','');
        if ( ident in refs ) {
          var rec = refs[ident];
        } else {
          // TODO: send to reference storage - see storeref above
          //var rec = storeref($(this))
          var rec = {"missing":true};
        }
        writeref(rec,counter,ident,$(this));
      });
    }

    // do the function
    return this.each(function() {
      // get this object
      obj = $(this);

      // get all the references for this page
      $.ajax({
        'type':'GET',
        'url': options.url + (options.url.indexOf('?') === -1 ? '?' : '&') + 'q=*&size=10000',
        'success': writerefs
      });
    }); // end of the function
  };
})(jQuery);


/* ---------------------------------------------------------------------
 * figures - search for figures, and number them
 * ---------------------------------------------------------------------
 */
(function($){
  $.fn.figures = function(options) {
    // specify the defaults
    var defaults = {
      identifier: '.figure',
      ignore: '.ignore'
    };
    // and add in any overrides from the call
    var options = $.extend(defaults, options);

    // do the function
    return this.each(function() {
      // get this object
      obj = $(this);

      $(options.identifier).not(options.ignore).each(function(index) {
        var counter = index + 1;
        var content = "Figure " + counter + ": " + $(this).html();
        $(this).html(content);
      });
    }); // end of the function
  };
})(jQuery);


if (noddy === undefined) noddy = {}
noddy.writer = function(opts) {
  if (opts === undefined) opts = {}
  if (opts.element === undefined) opts.element = '#content';
  $(opts.element).references(opts).figures(opts).numbering(opts).toc(opts);

  if ( $(window).width() > 1200 ) {
    $('#maincontents').addClass('visible-print');
    $(opts.element).css({'margin': '100px 10% 200px auto'});
    $(opts.element).before('<div id="csidecontents" class="hidden-print" style="position:fixed;top:0;left:0;bottom:0;right:0;width:400px;border-right:2px solid #ccc;padding:5px;background-color:#eee;z-index:1000000;"><div id="sidecontents" style="font-size:0.7em;overflow-y:auto;height:100%;"></div></div>');
    $(opts.element).toc({'prependto':'#sidecontents', depth:4, url: opts.url});
  }

  var showingcontext = false;
  $('body').click(function(e) {
    if ( showingcontext ) {
      showingcontext = false;
      return;
    }
    var target = $( e.target );
    if ( target.is('a') || target.is('input') || target.is('select') ) return;
    if ( target.closest('a').length || target.closest('select').length ) return;
    alert('hello');
  });
  $('body').contextmenu(function() { showingcontext = true; });


}

