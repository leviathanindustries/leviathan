<READER>

<4>

<MENU /api>

<8>

The useful client (or sort-of client) libraries:

* <a href="/api/build">build.js</a> - start here, although it's not a client library - this builds static 
sites from html / markdown content, with simple templating and settings control; 
so now you've got something to use your client libraries on! Works independently 
of Leviathan API.

* <a href="/api/reader">reader.js</a> - produce well-structured readable content with automated header numbering, 
reference management, column layouts. Works independently of Leviathan API.

* <a href="/api/nobject">nobject</a> - when you need to query a backend API and get back a data object, 
then represent it on the page and allow users to dynamically edit the data values, 
nobject makes it quick and easy to keep your UI in sync with your backend. This will 
work well with any API that provides a typical CRUD interface to datasets.

* <a href="/api/noddy">noddy</a> - a user management library that works with the Leviathan API (whose 
software versions are also called noddy), providing user login / logout, oauth, sessions, 
and options for locating, fingerprinting, cookie management and GDPR confirmations. 
This could theoretically work without the noddy API, but it is the most closely integrated.

* <a href="/api/holder">holder</a> - for displaying complex data in many extensible configurations, from 
fully interactive data visualisations and infographics to highly configurable 
browser search interfaces. This works well with the Leviathan API, but will work 
with any elasticsearch endpoint, or indeed any database / indexing endpoint, if 
you're willing to write a little translation code.
