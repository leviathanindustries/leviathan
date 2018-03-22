
jQuery(document).ready(function() {
  // INTRO STUFF
  
  if ($(window).width() >= 760) $('#categoryor').css('padding-left','49%');
  $('body').css('min-height',$(window).height()+'px');
  if ( $('#smalllogo').is(':visible') ) {
    $('#smalllogo').css({'width':$(window).width()+'px','height':$(window).height()+'px'});
    $('#smalllogo > h1').css('padding-top',Math.floor($(window).height()/4.5)+'px');
    $('#logo').hide();
    $('#introheader').hide();
  }
  
  var first = true;
  var howto = function() {
    if (first) {
      first = false;
      $('#searchbox').blur().attr('placeholder','Search Leviathan');
      $('.toggle').hide();
      $('#howto').show();
    }
    $('#searchbox').unbind('focus',howto);
  }
  
  var loginRequired = false;
  var afterLoginAction;
  var afterLogin = function() {
    first = false;
    $('.login').hide();
    $('.loading').hide();
    $('#messages').html("").hide();
    $('.toggle').hide();
    $('#topstrap').show();
    $('#searchui').show();
    if (afterLoginAction) {
      afterLoginAction.trigger('click');
      afterLoginAction = undefined;
    }
  }
  var showIntro = function() {
    if ( $('#intro').length ) {
      $('.loading').hide();
      $('#intro > .row').css('margin-top',Math.floor((( $(window).height() + 5 - $('#intro').height() ) / 2)) + 'px');
      $('#intro').css('min-height',($(window).height()-$('#topstrap').height()-10)+'px').show();
      setTimeout(function() {
        $('#smalllogo').remove();
        if ( $('#introheader').is(':visible') ) $('#introheader').hide();
        if ( $('#logo').length ) $('#logo').fadeOut('slow');        
        $('#intro > .row').css('margin-top', ($('#intro > .row').css('margin-top').replace('px','')-$('#topstrap').height()-10)+'px');
        $('#intro > .row').animate({'margin-top':'0px'},600);
        $('#topstrap').fadeIn('slow',function() { 
          $('#explain').fadeIn('slow'); 
        });
      },2000);
    }
  }
  noddy.init({api:'https://dev.api.cottagelabs.com/accounts',afterLogin:afterLogin,afterFailure:showIntro,messagesDivId:'messages'});
  if (!noddy.loggedin()) {
    if (loginRequired) $('#howto').find('.notcloggedin').html('<span class="visible-xs visible-sm">Welcome to Leviathan. </span>Please <a class="toggler" href=".login">login</a> to get started.');
    $('#searchbox').bind('focus',howto);
    showIntro();
  } else {
    first = false;
    $('#smalllogo').remove();
  }
  
  

  // SEARCH AND DISPLAY RESULTS
  category = 'say';
  
  var template = '<div id="new" class="statement" style="background-color:#5F5C64;border-radius:3px;margin-bottom:15px;">\
    <a class="close toggler" href=".statement" style="margin-top:0px;margin-right:8px;">x</a>\
    <p style="text-align:center;padding-top:15%;">\
      <a class="header toggler" href=".details" style="text-decoration:none;color:#FFFFFC;font-size:4em;line-height:1.2em;word-wrap:break-word;" alt="More details" title="More details">\
        New statement\
      </a>\
    </p>\
    <div class="details" style="display:none;color:#FFFFFC;padding:2px;">\
      <div class="about"></div>\
      <div class="info"></div>\
    </div>\
  </div>';
  
  var record = function(rec) {
    if (!rec.statement) return '';
    var tmpl = $(template);
    tmpl.attr('id',rec._id);
    var ht = $(window).height()-150;
    if (category === 'or' || category === 'and') ht = ht/2 - 20;
    if (ht>400) ht = 400;
    tmpl.css('min-height',ht+'px');
    $('.statement').css('height',ht+'px'); // in case we are leaving any on the screen
    // TODO apply slabtext to p.header
    tmpl.find('.header').html(rec.statement);
    //if (rec.keywords && rec.keywords.img) tmpl.find('.header').append('<br><img src="' + rec.keywords.img + '" style="max-height:300px;">'); 
    if (rec.about) {
      // about could be a leviathan ID, so check that...
      tmpl.find('.about').html('<p style="border-bottom:1px solid #ccc;padding-bottom:8px;">about: <a href="' + rec.about + '" style="word-wrap:break-word;">' + rec.about + '</a></p>');
    }
    tmpl.find('.info').html('<p>' + (rec.info ? rec.info : rec._id + ' - no extra information available') + '</p>');
    return tmpl;
  }
  
  var swipers = {};
  var swipe = function() {
    swipers = {};
    $('.statement').each(function() {
      swipers[$(this).attr('id')] = new Snap({element: document.getElementById($(this).attr('id'))});
      swipers[$(this).attr('id')].on('end',function() {
        for ( var s in swipers ) {
          var i = swipers[s].state().info;
          if ( i && ( i.halfway || i.flick ) && i.towards ) {
            var sentiment = i.towards === 'right' ? 'agree' : 'disagree';
            if ($('.statement').length === 2) {
              var pos = $('.statement').first().attr('id') === s ? 'first' : 'second';
              if (category === 'and') {
                response(undefined,sentiment);
                // TODO want some way to know which was selected, so other does not get replaced?
              }
              if (category === 'or') {
                if (sentiment === 'agree') {
                  sentiment = pos;
                } else if (pos === 'first') {
                  sentiment = 'second';
                } else {
                  sentiment = 'first';
                }
                response(undefined,sentiment);
              }
            } else {
              response(undefined,sentiment);
            }
          }
        }
      });
    });
  }
  var review = function(data) {
    var options = $.fn.holder.options;
    if (data === undefined) data = options.response;
    $('.statement').remove(); // TODO see below re category or,and - removing all statements may not be appropriate action
    if (!options.paging) {
      options.records = [];
      $('div.holder.results').html('');
    }
    for ( var r in data.hits.hits ) {
      var rec = data.hits.hits[r]._source;
      options.records.push(rec);
      // TODO may need to check if category or,and and if one statement still on screen, just replace the other?
      if (r === '0' && category !== 'all') {
        $('#firststatement').html(options.record(rec)).fadeIn('fast');
      } else if (r === '1' && category !== 'all' ) {
        $('#secondstatement').html(options.record(rec)).fadeIn('fast');        
      } else {
        if (r === '0' && !options.paging) {
          $('div.' + options.class + '.results').append('<div style="height:20px;"></div>');
        } else {
          $('div.' + options.class + '.results').append('<hr>');
        }
        $('div.' + options.class + '.results').append('<p><a style="color:#5F5C64;" class="toggler" href="#statement_' + r + '">' + rec.statement + '</a></p>');      
      }
    }
    if (data.hits.hits.length === 0) {
      category = 'say';
      $('#plusminus').hide();
      $('#category').val('say');
      $('#say').attr('placeholder','Make a statement');
      $('#messages').html('<p>There are no more statements matching this search. Try a different search, or create a new statement.</p>').show();
    } else {
      $('#plusminus').show();
      $('#say').attr('placeholder','Write a response (optional)');
    }
    $('#holder').show();
    $('.toggler').on('click',toggler);
    swipe();
  }

  // TODO consider holder could actually always use a large query size, and have a bundle to work through before requerying
  $('#holder').holder({
    url: "https://dev.api.cottagelabs.com/service/leviathan/statements",
    datatype: 'JSON',
    pushstate: false,
    //sticky: true,
    //scroll: true,
    record: record,
    review: review,
    sort:'random',
    executeonload: false,
    thenadd: function(e,th) {
      $('.toggle').hide();
      $('.statement').remove();
      $(this).holder.options.add(e,th);
    },
    size:1,
    placeholder: function() {
      var options = $(this).holder.options;
      var pl = '';
      try { pl += options.response.hits.total + ' statements'; } catch(err) { pl += 'Search Leviathan' }
      $('input.holder.search').val("").attr('placeholder',pl);
    }
  });
  
  var post = function(resp) {
    //$('.statement').remove()
    $('#firststatement').hide();
    $('#secondstatement').hide();
    $('.loading').show();
    var opts = {
      url: 'https://dev.api.cottagelabs.com/service/leviathan/statement/' + resp._id,
      type: 'POST',
      cache: false,
      contentType: "application/json; charset=utf-8",
      process: false,
      data: JSON.stringify(resp),
      dataType: 'JSON',
      success: function(data) {
        // TODO or could get back the next random set in the response, and not need another query...
        $.fn.holder.options.execute();
      },
      error: function(data) {
        $('.loading').hide();
        // TODO show error msg
        console.log(data);
      }
    };
    try {
      //opts.url += '?apikey=' + noddy.apikey;
      opts.beforeSend = function (request) { request.setRequestHeader("x-apikey", noddy.apikey); };      
    } catch(err) {}
    if (loginRequired && !noddy.loggedin() ) {
      $('#messages').html('<p class="message">Please login or sign up to respond to statements!</p>').show();
      $('.login').show();
      $('#noddyEmail').focus();
      afterLoginAction = $(this);
      return;
    }
    $.ajax(opts);    
  }
  
  response = function(e,sentiment,pos) {
    if (e) e.preventDefault();
    if (loginRequired && !noddy.loggedin()) {
      $('#messages').html('<p class="message">Please login or sign up to respond to statements!</p>').show();
      $('.login').show();
      $('#noddyEmail').focus();
      afterLoginAction = $(this);
      return;
    }
    var stmt = $('.statement').first();
    if (!sentiment) sentiment = $(this).attr('data-value');
    if (!pos) pos = $(this).attr('data-pos');
    if (category === 'or' || category === 'levor') {
      if (pos) {
        if (pos === 'second') {
          stmt = $('.statement:eq(1)');
          $('#secondstatement').html("");
        } else {
          $('#firststatement').html("");          
        }
      } else {
        if (sentiment === 'second') stmt = $('.statement:eq(1)');
        sentiment = 'agree';
      }
    }
    var sid = stmt.attr('id');
    var statement = $('#say').val();
    $('#say').val("");
    if ( stmt.length === 0 && !statement) {
      $('#searchbox').attr('placeholder','Search for statements first!');
      $('#say').attr('placeholder','Or write a new statement!');
      $('#plusminus').hide();
      $('.toggle').hide();
      first = false;
      $('#howto').show();
    } else {
      var about = sid === 'new' ? undefined : sid;
      //if ( about === undefined && stmt.find('.about').length && stmt.find('.about').val() ) about = stmt.find('.about').val();
      var info, tags;
      if (statement) {
        statement = statement.trim();
      } else {
        statement = undefined;
      }
      var resp = {
        _id: 'new',
        category: (category === 'all' ? 'statement' : category),
        about: about,
        sentiment: sentiment,
        statement: statement
      }
      if ($('#is').val()) resp.is = $('#is').val();
      $('.statement').each(function() {
        if ( resp.relation === undefined && sid !== $(this).attr('id') && $(this).attr('id') !== 'new' ) resp.relation = $(this).attr('id');
      });
      post(resp);
    }
  }
  $('.response').on('click',response);

  
  
  // PAGE UI ACTIONS

  var preview = function(e) {
    if ( $('#say').val().replace(/ /g,'').length ) {
      $('#plusminus').show();
      var s = $(this).val();
      if (s) s = s.trim(); // TODO trim new lines too
      if (s && s.toLowerCase().replace(/ /g,'').indexOf('about:') === 0) {
        if (s.indexOf('\n') !== -1) {
          s = s.split(/\n(.+)/)[1];
        } else {
          s = '';
        }
      }
      if (s) {
        s = s.trim(); // TODO trim new lines again
        if (s.indexOf('\n') !== -1) s = s.split('\n')[0].trim();
        $(this).parents('.statement').find('.header').html(s);
      } else {
        $(this).parents('.statement').find('.header').html('New statement');        
      }
    } else {
      $('#plusminus').hide();
    }
    // TODO look for inputs of # or #L or @ or @L and provide dropdown suggestions - and track if already looking, so don't kick off too many (bind with delay, perhaps separately to preview)
  }
  $('#say').on('keyup',preview);
  
  var prompt = function(e) {
    if ($('.statement').length === 0) {
      // TODO scale the box for users to type in, and maybe push below the say button
      // maybe just show separate fulltext box and hide the response bar...
      // and could make the input box swipable too?
      $('.toggle').hide();
      if (first) {
        first = false;
        $('#searchbox').attr('placeholder','Search Leviathan');
        $('#say').blur();
        $('#howto').show();
      } else {
        $('#searchbar').hide();
        $('#responsebar').hide();
        $('#newbar').show();
        $('#new').focus();
      }
    }
  }
  $('#say').on('focus',prompt);
  
  var toggler = function(e,what) {
    if (e) e.preventDefault();
    if (what === undefined) what = $(this).attr('href');
    $('#messages').html("").hide();
    if ( what === '#howto' ) {
      first = false;
      $('#searchbox').attr('placeholder','Search Leviathan');
    }
    if ( what === ".details" ) {
      $(this).closest('.statement').children('.details').toggle();
    } else if ( what.indexOf('#statement_') === 0 ) {
      var st = parseInt(what.replace('#statement_',''));
      $('#firststatement').html(record($.fn.holder.options.records[st])).show();
      $('.toggler').on('click',toggler);
    } else if ( what === '.statement') {
      $(this).closest('.statement').remove();
      if ($('.statement').length) {
        $.fn.holder.options.execute();
      } else {
        $('#category').val('say');
        $('#is').hide();
        $('#plusminus').hide();
        $('#say').attr('placeholder','Make a statement').show();
      }
    } else if ( what === '.login') {
      $('#messages').html('<p>Just provide your email address to login or sign up.<br>No passwords! You\'ll receive an email with a link and a code.</p>').show();
      $('#searchui').hide();
      $('.login').show();
      if ( $('.login').first().is(':visible') ) $('noddyEmail').focus();
    } else {
      $('.toggle').hide();
      $(what).show();
    }
  };
  $('.toggler').on('click',toggler);
  
  var categorise = function(e) {
    if (e) e.preventDefault();
    first = false;
    $('.toggle').hide();
    category = $('#category').val();
    // what else to do? depending on say/is/and/or/statements/responses...
    // change the response bar category select layout and say input / is select view
    if (category === 'all') {
      $.fn.holder.options.sticky = true;
      $.fn.holder.options.scroll = true;
      $.fn.holder.options.query.sort = {createdAt:'desc'};
      $.fn.holder.options.query.size = 50;
    } else {
      $.fn.holder.options.sticky = false;
      $.fn.holder.options.scroll = false;
      delete $.fn.holder.options.query.sort;
      $.fn.holder.options.query.size = 1;
    }
    if (category === 'or' || category === 'and') $.fn.holder.options.query.size = 2;
    if (category === 'or') {
      $('#responsebar').hide();
      $('#responseor').show();
    } else {
      $('#responseor').hide();
      $('#responsebar').show();      
    }
    if (category === 'is') {
      $('#say').hide();
      $('#is').show();
    } else {
      $('#is').hide();
      $('#say').show();      
    }
    if ( $('.statement').length === 2 && ( category !== 'or' && category !== 'and' ) ) $('#secondstatement').html("").hide();
    if ( $('.statement').length === 0 || ( $('.statement').length === 1 && ( category === 'or' || category === 'and' ) ) ) $.fn.holder.options.execute();
  }
  $('.category').on('click',categorise);
  $('#category').on('change',categorise);

  var categoryor = function() {
    if ($('#categoryor').val() !== 'or') {
      $('#category').val($('#categoryor').val());
      categorise();
    }
  }
  $('#categoryor').on('change',categoryor);

});

