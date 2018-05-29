
<READER>

<M>

Noddy is primarily an API service. Although the base of it is open source, additional 
services can run within it, and those may or may not be open source, depending on the 
needs of the creators and users of that particular service.

So Noddy is designed with the idea that users will use it via API queries rather 
than by running it themselves, and that specific services that need to run within 
it will be written in separate code repositories rather than in the Noddy repo.

If you need the Noddy API to provide a feature that it does not provide, then 
you can start by just contributing that idea - create an issue on the Noddy 
repo, and it will be discussed and prioritised into future developments. 

It is also possible to contribute to the Noddy codebase, but it is still best to 
start by creating an issue and discussing what you want to add, because it may 
already be partially or completely covered by other developments already in progress 
or planned. Once discussed, agreement will be reached on what can be developed as 
a particular new feature.


## Contributing to Noddy

* First, create an issue on the Noddy repo issue tracker. The issue must describe 
  the problem to be solved, how the Noddy API can already help with this, and what 
  the shortcomings are that must be overcome to solve the new problem. Also, 
  the issue must explain why this solution should be in the core of Noddy rather 
  than in a repo of a new service.

* The most likely additions to core Noddy are use endpoints. Any time any service 
  needs to make use of some other remote API, this should be generalised into a 
  use endpoint. These can then all be collected and run within Noddy, and more 
  conveniently used by any other Noddy service that requires them. See below 
  for more info on adding a new use endpoint

* The methods must extend the Noddy API object, and should be namespaced under a 
  named key of that object (and under any suitably existing namepsace, e.g. use 
  or service, see below). The API endpoints that call the methods must also be 
  similarly namespaced. See examples that already exist in the Noddy code.

* Noddy uses the Meteor framework, even though it is just an API backend - the 
  framework still provides useful organisational features, and provided some features 
  to make node.js easier to write before the latest versions of node had ways to do 
  them. Also, most of the files are actually written in coffeescript - BUT you 
  don't have to write in coffeescript, it will accept coffeescript or normal 
  javascript syntax.

* Also, you can even write something for Noddy in any language - but we are most 
  likely only to accept node, or python, so that maintaining the servers Noddy 
  runs on does not get overly complicated. If you really want to use another 
  language, raise it in your issue and we can discuss the cost of supporting it, 
  if needed. To use another language you still need to write a Noddy wrapper though, 
  that knows how to find and call your library, and get the results back. If you 
  really need to write something for Noddy but can't write the wrapper, again, 
  let us know and we can discuss a cost for writing that part for you.

* if your endpoint(s) require(s) authentication, they must specify whether it is 
  just authRequired (true/false), or roleRequired (group.action), or authOptional 
  (true/false). authOptional is useful in that it allows to collect user identification 
  if it is available, but does not fail if it is not available.

* Your extension must use API.log appropriately. See existing examples.

* Your extension should include a status endpoint and a test endpoint, if appropriate. 
  Status should provide fairly quick details about the running service, if it has 
  such status. Test endpoint should run tests that confirm it works, and will work, 
  including checking if any remote endpoints that it relies on are up and responding 
  as expected. You must expect that status endpoints could be called at any time 
  without causing damage to your extension or the rest of Noddy, and test endpoints 
  could also be called any time and almost certainly will run at least once a day.

* If your extension does not have a test endpoint, you must satisfy yourself that 
  it works as expected. You can do tests in any way you see fit to achieve this. 
  Once ready, a development will be deployed to our dev API, so you do not need 
  to run anything locally. If your addition causes the dev API to break, it will 
  be immediately removed. If it does not break, it will be left to run on the dev 
  API and you should test that it behaves as expected.

* If your extension requires any additional node modules and/or software installations, 
  those must be documented in the README file of your extension.

* Any special install requirements must also be documented, and discussed on the 
  issue covering your extension - bring up any questions there first, to avoid 
  disappointment if you end up relying on something we won't run.

* Once your contribution is ready, it must be available to be merged into the develop 
  branch of Noddy (or pulled / patched, as appropriate). Once it is ready, you must 
  specify this in your issue, and it will be deployed to the Noddy dev API.

* Once something runs smoothly on the dev API it will be merged into master. You 
  can request this in your issue. Nobody else should merge anything into master.

* By default anything on master will also run across the cluster. It is possible 
  to restrict endpoints so that they are only called on the primary machine, or 
  so that they only run on dedicated cluster machines. If this may be necessary, 
  raise it in the issue and alterations to the gateway machine nginx config will 
  be discussed, so that your contribution can be deployed as is most appropriate.

* If you're unsure about anything, ask in your contribution issue that you create 
  on the Noddy repo.


## Adding a new core feature to Noddy

New core features will require more discussion than other endpoints or services. 
You must ensure that a core feature is not duplicating functionality that is 
already provided, and it must not use external APIs. Anywhere that it does 
require an external API, it must use a Noddy use endpoint, or one must be written 
and contributed separately.

A core feature should not be a service. It should be something that services could 
make use of - even though it MAY be possible to use it directly. For example, 
the job endpoint can be used directly but is primarily designed to be a way for 
any service to run async jobs across a cluster. Also, the accounts API is accessed 
directly but is designed to be used within other endpoints and by remote queries. 

If you are uncertain, create an issue to describe what you need, and a decision 
can be reached about whether your addition should be core or not, and/or which 
parts should or should not be core or otherwise.


## Adding a new use endpoint to Noddy

A new use endpoint must be an API that uses some other external API beyond the 
Noddy system. It should extend the Noddy API object under the "use" key. The API 
endpoints should be namespaced at use/:use_name. See some current Noddy use 
endpoints as examples. 

New endpoints must be pushed to the develop branch of Noddy, or issue a pull 
request / patch as suits, if you don't have submit access to the repo. You can 
do your development in a feature branch if you wish, and that will probably 
keep things tidy. We don't use gitflow on Noddy, but it is essentially the same.


## Adding a new service to the Noddy API

NOTE: If you do want to get your service added to our Noddy instance, you should 
contact us first to discuss the possibility - start with an issue in the Noddy 
issue tracker.

If you just need to use the Noddy API within your own service, but don't need any of the 
infrastructure of Noddy to set up and run your own service, you can just consider 
writing your own service in any way that you desire, and running it yourself how 
you wish. In this case, you can just use Noddy by having your service query our 
Noddy instance API.

If you need some uptime guarantees of our service, and/or need to use it a lot, 
we offer service contracts to anyone who needs more stability to rely on. Contact 
us to discuss.

Also, if you write a new service that uses Noddy, you can of course run that service 
just by running your own Noddy instance. However, the idea of Noddy is that you 
don't have to do this. So, if you have written a new service that meets all the 
Noddy requirements, you can request to have it added to our Noddy instance.

But, moving on, assuming you do want to add a service into Noddy, you can start 
by writing a new Noddy service in any git repo. They don't go into the Noddy 
repo directly. Your service must extend the Noddy API 
object, under the "service" key, under which it must define any necessary functions, 
and API endpoints must be added under service/:service_name, and you must 
ensure that there are no namespace collisions.

Note that Noddy runs across multiple machines in a cluster. Don't write code that 
expects files to always be on the same machine. Follow all the other Noddy code 
conventions, and remember to separate out anything that can be generalised into 
a use endpoint to make it convenient for others.

Include a README with your service code. It must list any additional node modules 
your service uses, and if any of those node modules require installation of additional 
software on the server, those must be listed too. We run Noddy on Ubuntu Linux, 
so we'll need to know what and how to install anything your service needs.

Your service repo must have a master and a develop branch. Whenever you push to 
either of those branches, the Noddy API will receive the git hook and will load 
up the latest code onto our dev or live API (if you run your own instance of Noddy, 
you can configure it to do this for you too).

There will be a cost for running your service on our instance. The cost will depend 
on the service you write, and your relationship with us - e.g. part of a project 
we already work on, or not. We provide 24/7 uptime for a number of international 
services. Contact us to discuss these costs.


