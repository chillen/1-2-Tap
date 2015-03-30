# 1-2-Tap

This is a passwording system which provides a password to a user who registers with the system, 
offers a 3 point practice, and then asks them to login to the system.

## The Password ##

The user is shown 7 images in sequence of cute animals with a grid on top of it. The user clicks
or taps to input the password. On each image, they have to single or double tap a particular section
of the grid. After doing 7 images, if they have put in the password successfully, they gain access! Yay!
The only other restriction is that they can't tap the middle. This is mainly to make sure we have the proper
probability space for testing purposes.

The password is translated into a string. The password is translated into **hex**. Each grid point 
is stored as a value.

```
0  1  2
3     4
5  6  7
```

For each grid point `i`, the hex output is gained by `singleTap? i*2 : i*2+1`. For example, the 
string **13ABB42** translates to: **double tap 0, double tap 1, tap 5, double tap 5 twice, tap 2, tap 1**.

On top of the images, we'll be overlaying (in small, transluscent text) the *i* value onto the grid. 

## The Technologies ##

We use a variety of technologies, tossed onto a Node.js server hosted by Heroku. 

We are using the [mean.io](http://mean.io/#!/) client to generate the application.
From there, we're using [jQuery UI for slide effects](https://jqueryui.com/show/), [bootstrap gridding](http://getbootstrap.com/examples/grid/)
to produce our div grid, and the [effect found at this JSFiddle](http://jsfiddle.net/Fy8vD/) 
for the tutorial and tap recognition. We're also using [SweetAlert](http://tristanedwards.me/sweetalert). It's pretty.
