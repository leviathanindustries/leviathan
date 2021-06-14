<style>
  body {
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  .jumbotron {
    margin-top:15%;
  }
</style>

<script>
jQuery(document).ready(function() {
  /*$.ajax({
    type: 'GET',
    url: '{{api}}/img?url=https%3A%2F%2Fdev.bebejam.com%2Fstatic%2Fbeach.jpg&w=980&h=780&data=true',
    success: function(colours) {
      $('h2').first().after('<p>' + colours + '</p>');
      $('p').css('color',colours[0]);
      $('h1,h2,h3').css('color',colours[1]);
      $('.cbg').css('background-color',colours[4]);
    }
  });*/

  //var noddy = {apikey: ''} // need to actually get an API key

  var colours = [];
  var colouring = 0;
  var bg = false;

  var draw = function(kwd) {
    if (bg === false) {
      bg = true;
      $('body').css('background-image','url({{api}}/img?h=800&w=800&saturate=5&url=' + kwd.img + ')');
    } else {
      // could use tf to scale in some way
      $('#pics').append('<img alt="' + kwd.term + ' (' +kwd.tf + ')" title="' + kwd.term + ' (' +kwd.tf + ')" src="{{api}}/img?h=200&saturate=5&url=' + kwd.img + '">');
      // how to fit across the page? need a tidy boxing technique, or a nice messy layout
    }
  }

  var drawer = function(kwd) {
    // once we have all the keywords, draw them in some cool way...
    if (colouring < 3) {
      // try to get some colour data points from the first five images we get
      if (kwd.img) {
        colouring += 1;
        $.ajax({
          type: 'GET',
          url: '{{api}}/img?data=true&url=' + kwd.img,
          colno: colouring-1,
          dkwd: kwd,
          success: function(info) {
            var biggest = info.colours.pop();
            colours[this.colno] = biggest.hex
            draw(this.dkwd);
          }
        });
      }
    } else {
      $('.jumbotron').css('background-color',colours[0]);
      //$('#pics').css('background-color',colours[2]);
      draw(kwd);
    }
  }

  var keywords = [];
  var getk = function() {
    if (keywords.length === 0) return;
    var kwd = keywords.shift();
    $.ajax({
      type: 'GET',
      url: '{{api}}/tdm/categorise?entity=' + kwd.term,
      ckwd: kwd,
      success: function(cat) {
        // see if there is anything useful in the language lookup, or just use it instead
        // if we get a document sentiment, perhaps that can be used for colouring the palette
        if (cat.img) {
          this.ckwd.img = cat.img;
          drawer(this.ckwd);
          if (keywords.length) getk();
        } else {
          $.ajax({
            type: 'GET',
            url: '{{api}}/use/flickr?text=' + this.ckwd.term,
            ekwd: this.ckwd,
            success: function(flick) {
              try { this.ekwd.img = flick.data[0].url; } catch(err) {}
              drawer(this.ekwd);
              if (keywords.length) getk();
            }
          })
        }
      }
    })
  }

  var run = function() {
    $.ajax({
      type: 'GET',
      //  url: 'https://dev.api.cottagelabs.com/use/google/language?apikey=' + noddy.apikey + '&url=https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/691366/20180319_DRAFT_WITHDRAWAL_AGREEMENT.pdf',
      url: '{{api}}/tdm/keywords?limit=40&score=true&len=5&cutoff=0.9&ngrams=2&min=3&stopWords=s,l,title,annex,ec&url=https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/691366/20180319_DRAFT_WITHDRAWAL_AGREEMENT.pdf',
      success: function(kwds) {
        for ( k in kwds ) {
          keywords.push(kwds[k]);
        }
        getk();
      }
    });
  }

  // trigger run() once the apikey is known, look for it on query param, and/or have an input box
  /*if (window.location.href.indexOf('apikey=') !== -1) {
    noddy.apikey = window.location.href.split('apikey=')[1];
    run();
  }*/
  run();

});
</script>

<READER>

<M>

<H>

# Visualising a dense document

Such as the draft withdrawal agreement between the EU and the UK

https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/691366/20180319_DRAFT_WITHDRAWAL_AGREEMENT.pdf

<E>

<S>

<M>

First, extract the keywords from the document.

Let's try getting the top 20 two-word combo terms that appear at least 3 times, and are at least 5 characters long, and find out
how often they occur too:

{{api}}/tdm/keywords?limit=20&score=true&len=5&cutoff=0.9&ngrams=2&min=3&stopWords=s,title,annex,ec&url=https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/691366/20180319_DRAFT_WITHDRAWAL_AGREEMENT.pdf

And we can also try to extract entities and sentiment using Google cloud language (this needs an API key, so you can't see the results, sorry).

{{api}}/use/google/language?url=https://www.gov.uk/government/uploads/system/uploads/attachment_data/file/691366/20180319_DRAFT_WITHDRAWAL_AGREEMENT.pdf

And then, let's see if we can categorise the terms - some of them will, others won't.

{{api}}/tdm/categorise?entity=TERM

Now then, if we were able to categorise, we may have an image link to represent them (in the "img" key of the result).
If we didn't, we can try a query to the Flickr API. This will probably produce some
pretty random images, but it will be fun.

{{api}}/use/flickr?text=TERM

It will return a list of results in the "data" key, each if which can have a "url"
to an image on Flickr.

Now we have some metadata and some image representations, let's also pick a colour scheme.
Take the images of the top five terms (or at least those we could find an image for),
work out their colour palettes, and take the most common colour from each. Use them
to shade the text, backgrounds etc in use on this page.

{{api}}/img?data=true&url=URL (for each image url of the top five keywords)

Use the colour palettes to apply a blend to all the images we are going to display,
and also shrink the images a bit so it won't take days to load the page. We could
size them in relation to their frequency too.

Now, let's display them all and see what we get...

<F>

<div id="pics" style="width:100%;min-height:600px;"></div>