

stocker_company = new API.collection index: API.settings.es.index + 'stocker', type: 'company'
stocker_source = new API.collection index: API.settings.es.index + 'stocker', type: 'source'


API.add 'service/stocker/sources', get: () -> return stocker_source.search this.queryParams

API.add 'service/stocker/companies', get: () -> return stocker_company.search this.queryParams

# TODO is a list of all companies and their tickers necessary? Could then look for them in content
# (would this be any better than the google cloud extraction? maybe test if it pulls companies when their ticker names are present)


API.service.stocker = {}

# track company details each day from av / iex
# could also use google finance API if useful, putting info in use/google, where it should be added

API.service.stocker.company = (company) ->
  return
  # get details about the company

API.service.stocker.scrape = (url) ->
  s = stocker_source.find url:url
  stocker_source.insert({url:url}) if not s
  # get the page, extract all the entities. look for those that are companies
  # for things that may be companies, try to look up in knowledge graph / wikidata and get ticker
  # find statements about companies and analyse their sentiment
  # get the overall sentiment of the document too
  # save info about the source page and what it was like at this time
  # save info about each company too, creating a record if not already present
  src = Meteor.http.call('GET', url).content
  #src = src.replace(/\n/g,'').replace(/<ul.*?<\/ul>/g,'').replace(/<a.*?<\/a>/g,''); // these can lead to slightly tidier results but lose a lot of interesting words
  src = src.replace(/<\/li>/g,'.')
  # save the content of the page as it was now to some listing of page status each time it is scraped
  content = API.convert.xml2txt undefined, src
  ggl = API.use.google.cloud.language content, 'entities'
  for entity in ggl.entities
    if entity.type is 'ORGANIZATION'
      console.log 'do something'
      # is the company already in stocker_company? If not:
      # lookup the company in knowledge graph / wikidata, and get the ticker
      # want to get the sentiment and all statements about all the organisations... save them in leviathan? or elsewhere?
      # does the google analysis give enough for this? or reprocess the page again, looking for sentences including the relevant entities?

API.service.stocker.read = (urls) ->
  if not urls?
    urls = []
    stocker_source.each (src) ->
      urls.push src.url
  urls = urls.split(',') if typeof urls is 'string'
  for url in urls
    API.service.stocker.scrape url


API.service.stocker.eod = (types=['LSE','NASDAQ','AMEX','NYSE','ASX'], load=false, update=false, delay=1) ->
  results = []
  stocklisturl = 'http://eoddata.com/stocklist/'
  list = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
  for t in types
    url = stocklisturl + t + '/'
    for l in list
      future = new Future()
      Meteor.setTimeout (() -> future.return()), delay*1000
      future.wait()
      purl = url + l + '.htm'
      res = API.convert.table2json purl, undefined, {start:'<table class="quotes">'}
      for r in res
        if r.Code and r.Code.length and r.Name and r.Name.length
          exists = stocker_company.find {code: r.Code}
          company = if exists then exists else {exchange:t,code:r.Code,name:r.Name}
          if exists and load and update
            stocker_company.update company._id, company
          else if load
            company.ftstr = doc.name
            company.ftstr += ' (' + company.exchange if company.exchange
            company.ftstr += ' ' + company.code if company.code
            company.ftstr += ')' if company.exchange
            company.ftstr += ' ' + company.url if company.url
            company._id = stocker_company.insert company
          results.push company
  return {count:results.length, data:results}



API.service.stocker.loadcompanyurls = (update) ->
  # on first pass found 5167 URLs from google places API for the 16712 companies that were present
  matcher = if update then {} else {url:{exists:false}} # check this
  companies = stocker_company.find matcher
  found = 0
  companies.forEach (company) ->
    future = new Future()
    Meteor.setTimeout (() -> future.return()), 500
    future.wait()
    try
      url = API.use.google.places.url(company.name).data.url
      if url
        stocker_company.update company._id, {url:url}
        found += 1
  return found

API.service.stocker.loadcompanyabstract = (update) ->
  matcher = if update then {} else {abstract:{exists:false}} # check this
  companies = stocker_company.find matcher
  found = 0
  companies.forEach (company) ->
    future = new Future()
    Meteor.setTimeout (() -> future.return()), 2000
    future.wait()
    try
      info = API.use.duckduckgo.instants company.name
      if info?.Results? and info.Results.length
        company.url ?= info.Results[0].FirstURL if info.Results[0].FirstURL?
        company.logo = info.Image
        company.abstract = info.Abstract
        found += 1
  return found





