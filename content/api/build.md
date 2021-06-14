
<READER>

<4>

<MENU /api>

<8>

# build.js

To serve a simple static site it first has to be built from some simple static pages.
That is what the noddy build script does. It is like many other static site generators,
only simpler in some ways and more complex in others. I was not interested in
making it extensible via plugins, although that would be easy to achieve with a
couple more lines of code. Instead I was interested in making it as automatic as
possible to use, whilst supporting increasing levels of complexity only where necessary.
So here is what it can do.

## requirements

A linux / unix machine, nginx, node installed, and npm. Also you must npm install 
certain packages - fs and handlerbars are always needed; if markdown content is 
being used, markdown is required too; to use the css/js bundling feature, crypto 
is required as is uglify-js (if you want to bundle js - and must be version 2.x 
or greater) and uglifycss (if you want to bundle css) - and if you want to bundle 
http URLs rather than just local files, sync-request is needed too; if you have 
any scss files to convert, sass is also necessary; and finally, if there is any 
coffeescript to convert, install coffee.

Then, create a folder for you static site. Copy/download the build.js file
into it. Inside the site folder, make two more folders called "content" and "static".
Optionally, and make a file called settings.json and one called local.json - see 
below for how to use them.

You will also end up with a "serve" folder next to these, which is created every
time the build script is run. This is where the generated content files will be
stored and served from.


## content

In the content folder you can put files that are the pages of your site. You can
give them hierarchy using the normal folder structure within "content". That is,
if you want a subsection of your site called "blog", make a folder in "content"
called "blog" and put your blog posts in it. If someone goes to the /blog URL
route, they will be shown whatever file you have called "index.html" or "index.md".
There is the first clue about what content can be handled - and in fact, either
file can handle mixed content. A ".html" file will be assumed to be html, but if
it contains &lt;markdown&gt; ... &lt;/markdown&gt; tags, anything within the tags
will be rendered from markdown format to html. A ".md" file works the other way
round - the whole file will be rendered as markdown, and of course it is possible
to insert html within markdown where necessary, so that will work too.

There are some particular keyword files that can be included in "content". These
are "open", "head", "header", "footer", "close". They are all optional, and can
be overriden in other ways (see explanation of settings below). "open" simply
overrides the default &lt;html&gt; opening tag statement that will be used for the
generated html. "head" can be a default &lt;head&gt; section for inclusion on
any content page. "header" and "footer" can be default page content headers and
footers to put onto every generated page. And "close" can be used to change the
default closing &lt;/html&gt; tags that will be used.

Additional &lt;head&gt; content for any particular content page can also be included
in that page by just using the &lt;head&gt; ... &lt;/head&gt; tags and putting
the necessary head content between them. This is most useful if you want to give
a page a specific title, or keywords, or include some js or css files specific to
that page.

Also, a &lt;head&gt; file is not actually needed at all - the main static files
that your site needs can actually be specified in the settings file. This also
has the advantage of creating js and css minified bundle files for you on the fly
so that your site loads faster. But you can still do that AND have head includes
too, if you wish. See "settings" below for more info.

You can use variables and includes anywhere in your content files, and any content
file can be used as an include in any other file. See the "variables" section below
for more info.


## shortcut (reader) tags

To quickly generate nice html layouts for content control, some special shortcut
html tags can be used. First, use the &lt;READER&gt; tag to indicate to the
build script that it should process these tags in a given content file.

For layout you can use &lt;L&gt;, &lt;M&gt;, and &lt;R&gt; tags to indicate left,
middle and right columns. Using &lt;M&gt; on its own will result in one central
column with some guttering either side. &lt;M&gt; can be avoided altogether to
just have left and right columns. &lt;R&gt; can be used on its own to have an
empty left column. You can also use numbers 1-9 to specify sized columns (out
of a total width of 12).

&lt;F&gt; can be used to break "containment". By default the reader content will
be placed into a container with a fluid max width of 1000px. To break out from this
and use the full width, use &lt;F&gt;. To get back into it, use &lt;C&gt;.

You can also add some nice effects using &lt;S&gt; and &lt;X&gt;. &lt;S&gt; gives
a "splash page" effect, e.g. everything below it will be pushed "below the fold",
out of the current viewport, so that only the content above it will be seen on the
screen. A big header with a nice background image, or even without, followed by an
&lt;S&gt; tag gives a good intro section to a page.

&lt;X&gt; can be used to add a parallax effect where the following content seems
to slide across the background. Use this with a nice background image for cool
parallax effects. You can specify the background image (and any other values) by
using the "src" attribute on the &lt;X&gt; tag. Similarly, any other attributes
given on any of these shortcut tags will be applied to their rendered outputs -
so for example you could specify an &lt;L&gt; section with a style attribute where
you alter the font in that particular column.

&lt;H&gt; can create large specialised header sections. This gives a bigger
heading font size as well as a padded backgrounded "well" to the section, and a
different font. This works well over the top of a splashed or parallaxed area.
To have just a "well" effect on its own, you can use &lt;W&gt;.

Combining these tags with a markdown content file can make it very quick and easy
to generate nice looking textual content pages.

When you need to use big background splash or parallax images, or even anywhere
that you want to include an image inline, consider using the
<a href="/says/img">Noddy img API</a> for quick and easy image resizing and effects.


## static

Put any static files, like css, images, etc into the "static" folder. You can also
put scss files in here if you wish, and they will be converted to css automatically.
Any coffeescript files will be converted to javascript. Variables can be included in
static files too.

From your content files, refer to any file in "static" in the usual way, just by
using "/static/filename.css" for example.


## variables, includes

Anywhere you want to use some particular variable, like the URL of the API to connect
to, use double curly braces and the name of the variable, for example &#123;&#123;api&#125;&#125;.
Define the value of the variable in the "settings.json" file.

You can include any file in the "content" folder as content in any other file,
just using a curly brace and a %, like {% FILENAME %}. You do not need to include
the filetype suffix, so it doesn't matter if they are html or markdown files.

You can't do any clever things with jinja templating beyond that - just use js
on your pages where you want smart behaviour.


## settings

The "settings.json" should contain the main settings for your site. A "local.json"
can also be used, the main difference being that "settings" is for anything general
that could go into a git repo with your content, whereas "local" should be used
for anything secret that your site may need, or for local settings, such as if
you want different configurations to run on a production or development version
of the static site.

Your settings file can specify js and css includes to minify and serve as a bundle.
This is just a handy way to list what css, js, etc your site needs on every page,
and have them load a bit faster. It can list local files in the static folder, or
files at remote URLs. Remote ones will be retrieved and stored in the "serve" folder
and included in the bundling process. Once css and/or js bundle files have been made,
they will also be stored in the "serve" folder and tags to include them in all
your pages will be inserted, referred to using a generated UUID as the file names.
Different UUIDs will be generated every time "build" is run, so this also ensures
that if you change the content of any of your bundle files, your users will see
the newest versions.

To use this "bundle" feature, just add a key called "bundle" to your settings.json
file, and the value for it should be a list of file names that start with "/static"
or "http".

As with all settings, you can override this in the "local.json" file, or for
convenience you can use a key called "+bundle" to just add to it, so any extra
files you need for dev, for example, can just go in "+bundle" in your "local.json" file.

Any variables that you want to insert into your content or static files can also
be declared in "settings.json". Just provide the name that you used in curly braces
in the content files as the key in the "settings.json" object, and have it point
to the value you want used. Note that this means you cannot use variable names
that would clash with any of the functionality specified above.


## serving (with nginx)

On a linux / unix machine with node installed, in your MYSITE folder on the command
line, run node build.js to create and populate the "serve" directory. Sorry, I
don't know how you would do this on a windows machine.

There is an nginx config example file provided. It will try to serve any
requested page by checking in the "serve" directory first, then falling back
to looking for it in content, then in static. Direct calls to "/static/*" will
just search the static folder. Just copy the nginx config into your nginx
"sites_enabled" folder and reload/restart nginx, and it will start serving.

If you don't have nginx it should be easy to write a suitable apache (or other
web server) config file that has the same behaviour, but I haven't done that.
Just follow the structure of the provided nginx example, and refer to the
documentation of your preferred web server.