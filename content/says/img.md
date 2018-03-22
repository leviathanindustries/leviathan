
# {{api}}/img

## Get any image and manipulate it, all on the URL params

A note on auth: there is none, be nice or you will get blocked and/or access will
start being restricted - making the world a sadder place for everyone :(

You want to write lovely long bits of informative text, but people keep going on
about how visual impact matters. That's not true, other than that there are
people who believe it. So there are people who want communication to take a
different style. Probably these people are not going to be interested in the
actual informative message anyway... but even so, it seems it is sometimes
necessary to present things with visuals.

And sometimes pictures are just nice.

So it would be great if this was as easy as possible, at least in the early stages.
There is always going to be a point where a design narrative is necessary and
beneficial, and at that point a design professional is really useful. But before
that point, there's all the annoying fiddling with images just to make a page
a bit more visually appealing. That is what this API does.

There is also the hassle of dealing with different image scales, and different
image sizes for different devices and bandwidths. This API helps with that too.

Just hit (GET) the API URL with a "url" parameter that points to the image you want.
If it is not already in the system, it will be got. If it is already in the system,
it won't bother getting it again. If you know it is already in the system, and
know the name it was saved as, you can also just pass the "fn" param instead.
Images will be saved as the same name they have on the URL they were retrieved
from (the bit after the last slash, minus any params and hashes), unless a file
with that name already existed, in which case some randomness will be added.

TODO how will you get back the filename? POST instead of GET will return a JSON
with metadata including the filename it was saved as.

OK. So now there is an image in the system. But what gets returned? If you only
provided the "url" or "fn" you just get back the local copy of the original file.
But, during that first creation call or any subsequent one, you can add params
to alter the image in some handy ways. Each alteration will result in a new image
being saved on the system so that subsequent calls for the same alteration will
be fast, as they won't require reprocessing.

Here's the options, each one is the name of the url param that you can add, and
a description of what values you can provide, and what it does.

* w - resize the image to the width (height will scale relatively)
* h - resize the image to the height (width will scale)
* x, y, w, h - crop an image to given width and height, starting from position x, y, co-ordinated from top left
* scale - scale the image to given numeric value between 0 and 100 (which will be interpreted as %)
* quality - if the image is a jpeg, save it at % quaulity
* rotate - between 0 and 360 degrees
* brightness - between -1 (dark) and 1 (bright)
* contrast - between -1 and 1, dark to bright
* fade - 0 to 1, 1 fully faded
* opacity - 0 to 1, 1 fully transparent
* gaussian OR blur - blur the image to the given number of pixels. Gaussian will be slow, blur is fast (also accepts true for a default value)
* posterize - posterize to a given level number of effect (also accepts true)
* pixelate - to a given number of pixels
* dither - if true, apply dithering
* invert - if true, invert the image
* normalize - if true, normalize it
* opaque - if true, make it opaque
* sepia - make it sepia
* greyscale - or greyscale (truye will work, or can provide a specific amount)
* flip - can be horizontal, vertical, or both separated by a comma
* convolute - provide a convolution matrix flattened out to just a comma list of numbers e.g a 3x3 matrix -1,1-0,0,1,1,0,0,0
* emboss - if true, will apply an emboss convolution
* edge - if true, will apply an edge definition convolution
* softedge - as above but softer
* desaturate OR saturate - value 0 to 100, does what it says on the tin
* spin - -360 to 360 spin of the image colour hues
* mix - provide a hex colour code, and after a comma, an opacity amount between 0 and 1. Image will be mixed to that colour
* xor - provide a hex colour code and image will be bitfield applied to it
* red - modify red between 0 and 255
* green - modify green
* blue - modify blue
* focuscrop - experimental. Crop the image to the area that appears to be the focus. This will be whatever is clearest in the image. But say an image of four people, it doesn't care which persons it chooses, so don't be upset.
* mask - provide the name of a file you have already loaded into the system, or a URL of another image, and it will be used as a mask for the image you are editing. You can also provide mred, mgreen, and mblue as additional colour params to apply to the mask.
* composite - as above, but composites rather than masks. Providing a composite image that is a png with transparency with a vignette effect, along with optional mred, mgreen, mblue colours, will apply the suitably coloured vignette effect to your base image, for example.
* data - if true, you won't get the image, you will get a JSON containing image data. Still to decide what this will actually contain as useful info... but what it does already contain is the focus info used for the focuscrop, and the average image colour, and also a colour palette of the image in 5 clusters (or provide your own clusters param)


## How does this work?

Mostly by using https://www.npmjs.com/package/jimp with some usefully applied presets.

For providing a colour palette it does a k-means clustering of all the colours in the image -
wooo, machine learning hocus-pocus. The machines are going to take over, etc.

For cropping to a focus, I use apply greyscale and max contrast, then do k-means on
the pixel RGB as well as x and y, clustering to 2 clusters. Then there are some fudges
for where to crop to, depending on the darkness of the image and the lightness of the
foreground (or vice versa), and if the crop colour target is comparatively small enough
it will guess towards being a selfie-type image or a panorama-type image. If the
resulting image seems to be very half-and-half, it gets cut in half and the process re-runs
(think landscape pictures of horizons, where the focus is near the horizon).


## Is it good?

Yeah it's alright. Like I said at the start, if you need serious design it is not the
individual images that matter, it's the design narrative, so get a designer. The
focus cropping isn't super smart, but it does what is needed for very little computational
effort, and doesn't take long. And if one pass of focus croping does not do what
you want, just provide initial crop params yourself and rerun.

You can also do handy things like have a little js on your web pages that gets
images from this API, and you could get blurred ones first cos they are small
and load fast, then get the bigger ones, and even get a range of different sizes
depending on viewport / bandwidth. TODO, OK, I will make a demo of this.


## But I want a design narrative without paying a designer!

OK! Coming soon! Pick an image or a colour, throw your textual self-love into it,
pick a level of picturey-ness, and get back an awful page. TODO, will link to a
nice little UI for you to play with to generate these things.


## I love you for this...

Thanks. Give me money and I will love you too.

That's a joke.

I won't.





