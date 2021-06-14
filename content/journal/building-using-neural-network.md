
<READER>

<M>

<H class="black shadow">

# Building a neural network

<E>

Neural networks are just a way of thinking of a certain sort of algorithm. All 
computer programmes are algorithms - just a set of instructions for how to do 
something. So, what is the big deal with neural networks?

Well, nothing really - they're not even new, they were invented in the 70s, 
when many software algorithms were invented. But they're very popular at the 
moment, mostly because they can be inefficient, so we need to have lots of 
computing power to run them, which we have now; and also because we now do 
a lot of things like image analysis, where we want to work out if one thing 
is the same as something else, just from a picture.

So that's where neural networks come in - we mainly used computers to work out 
exact things, like adding really big numbers together, and getting them exactly 
right. So how does that relate to telling if a picture of a cat is a picture 
of a cat, or a picture of a dog?

It's because pictures are just giant lists of numbers. Pictures are made of pixels, 
loads of tiny little dots, and each one has a position in the picture, and a colour. 
Actually the colour is made up of three numbers, the red, green, and blue, which 
mix together to make any other colour.

So if we wanted to know if one picture contains something, we just count all the 
little pixel numbers, and that represents the thing - say a picture of a cat. 
But this wouldn't be much use because it would only work on that exact picture - 
a slightly different picture, like of the same cat from a different angle, would 
look a bit different so would have different numbers in some of the pixels. So 
now what we really need is a way to add up all the numbers of the cat picture, 
then all the numbers of the second cat picture, then a whole lot of numbers from 
lots of other cat pictures, and get a sort of an average - work out a way to say 
that any other picture is of a cat if it is similar enough to the other pictures 
the computer has added up previously.

That's what neural networks are for, and they are modeled on how researchers think 
human brains work - we see lots of things, and learn they could be of the same thing 
even if they don't look exactly the same.

Note - this doesn't just work with pictures, but pictures are a good example. Any 
big set of data where we need to approximate things and measure how similar they 
may be, and particularly to guess that some missing data, or data records that 
are collected later, could have particular values, then we build a neural network. 

Actually the approximation alone is what we call machine learning - the algorithm 
for that just clusters things around values, and then "learns" the averages to 
match things to.

But with neural networks, we can do better with new pictures or new data, even 
if there is not a simple similarity. A great example is trying to work out where 
the black and white sections or a square that is half black and half white are, 
compared to where the black and white sections of a spiral are - there is no 
line dividing the two colours neatly in the spiral, they are not easy to figure 
out linearly.

So, to building the neural network - we need to be able to measure some incoming 
data, but not remember it exactly, and just have a fuzzy sense of how to work 
out what it is, so that next time we see something similar we can realise that 
it is the same thing. How would we do that?



