
_L.suggest = (el, addr, key, data, total, delay) ->
  el = _L.gebi(el) if typeof el is 'string'
  elid = _L.get el, 'id'
  addr ?= _L.api + '/suggest/'
  key ?= 'title'
  data ?= 'data'
  total ?= 'total'
  delay ?= 600
  values = {}
  relevant = []
  remaining = true
  if typeof data is 'object'
    remaining = false
    for d in data
      k = if typeof d is 'string' then d else d[key]
      values[k.toLowerCase()] = d
  waiting = false
  doing = false
  _choose = (e) =>
    console.log 'choose'
    e.preventDefault()
    _L.set '#'+elid, _L.get e.target
    _L.html '#'+elid+'_suggestions', ''
  _show = () =>
    term = _L.gebi(elid).value.toLowerCase().trim()
    present = []
    _L.each '.'+elid+'_suggestion', (el) =>
      elvl = _L.html(el).toLowerCase()
      if elvl.indexOf(term) is -1 or elvl in present
        _L.remove el
      else
        present.push elvl
    for r of relevant
      break if parseInt(r) >= 50
      rl = relevant[r].toLowerCase()
      if rl not in present and rl.indexOf(term) isnt -1
        _L.append '#'+elid+'_suggestions', '<a class="'+elid+'_suggestion leviathan_suggestion button" href="#">' + relevant[r] + '</a>'
    _L.listen 'click', '.'+elid+'_suggestion', (e) => _choose(e)
  _more = () =>
    if not doing
      _L.show '#loader'
      waiting = false
      doing = true
      term = _L.gebi(elid).value.toLowerCase().trim()
      _L.jx(
        (if typeof addr is 'function' then addr(term) else addr + term) # or whatever the suggest address is
        undefined
        (res) =>
          _L.hide '#loader'
          remaining = res[total] if typeof res is 'object' and res[total]?
          records = res[data] if typeof res is 'object' and res[data]?
          remaining = 0 if records.length is 0
          _L.html('#'+elid+'_remaining', remaining) if typeof remaining is 'number'
          for r in records
            k = if typeof r is 'string' then r else r[key]
            values[k.toLowerCase()] = r
          doing = false
          _filter true
        (err) =>
          waiting = false
          doing = false
          remaining = false
      )
    else if not waiting
      waiting = true
      setTimeout (() -> doing = false; _more();), delay
  last = ''
  _filter = (got) =>
    term = _L.gebi(elid).value.toLowerCase().trim()
    remaining = true if term.indexOf(last) isnt 0
    last = term
    if term.length < 3
      _L.html '#'+elid+'_suggestions', ''
    if term.length > 1
      _r = []
      for r in relevant
        _r.push(r) if r.toLowerCase().indexOf(term) isnt -1
      relevant = _r
      if relevant.length is 0 or remaining is true
        for v of values
          if v.indexOf(term) isnt -1 and v not in relevant
            relevant.push if typeof values[v] is 'string' then values[v] else values[v][key]
      _more() if relevant.length is 0 and remaining and got isnt true
      _show()
  _L.listen 'keyup', el, () => _filter()
  # on focus could try to show a help box for the suggester in question



'''jct.suggestions = function(suggs, cached) {
  var sgst = '';
  var sd = jct.d.gebi('suggest'+jct.suggesting);
  var typed = jct.d.gebi(jct.suggesting).value.toLowerCase();
  jct.d.each('choose', function(el) { if (el.innerHTML.toLowerCase().indexOf(typed) === -1) { el.parentNode.removeChild(el); } });
  if (jct.cache[jct.suggesting] === undefined) jct.cache[jct.suggesting] = {string: '', data: []};
  var update = false;
  for ( var s in suggs.data ) {
    var t = suggs.data[s].title;
    var tl = t.toLowerCase();
    if (!jct.d.gebi(suggs.data[s].id)) {
      if (tl.indexOf(typed) !== -1) {
        sgst += '<p><a class="button choose' + (suggs.data[s].doaj ? ' success' : '') + '" which="' + jct.suggesting + '" title="' + t + '" id="' + suggs.data[s].id + '" href="#">' + t + '</a></p>';
      }
    } else if (!cached && jct.cache[jct.suggesting].string.indexOf(tl) === -1) {
      jct.cache[jct.suggesting].string += ' ' + tl;
      jct.cache[jct.suggesting].data.push(suggs.data[s]);
      update = true;
    }
  }
  if (sgst.length) {
    sd.innerHTML = sgst + sd.innerHTML;
    jct.d.each("choose", function(el) { el.addEventListener('click', jct.choose); });
  }
  if (!jct.d.gebc('choose')) {
    jct.d.gebi('whatsmissing').innerHTML = jct.suggesting;
    jct.d.gebi('titlemissing').innerHTML = jct.d.gebi(jct.suggesting).value;
    jct.d.gebi('missing').style.display = 'block';


jct.suggest = function(e) {
  if (e === undefined) e = jct.waiting;
  if (e) {
    var which = e.target.id;
    var typed = e.target.value.toLowerCase().replace(' of','').replace('the ','');
    if ('journal'.indexOf(typed.trim()) !== -1) typed = '';
    if (typed.length === 0) {
      jct.d.each('suggest','innerHTML','');
    } else {
      if (typed.length > 1) {
        jct.suggesting = which;
        if (jct.cache[which] !== undefined && jct.cache[which].string !== undefined && jct.cache[which].string.indexOf(typed) !== -1) {
          jct.suggestions(jct.cache[which], true);
        } else {
          jct.jx('/suggest/'+which+'/'+typed);


jct.setup = function() {
  var _sug = function(e) { 
    jct.d.each('help', function(el) { el.style.display = 'none'; });
    jct.d.each('choose', function(el) { if (el.innerHTML.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1 || el.getAttribute('which') !== e.target.id) el.parentNode.removeChild(el); });
    if (jct.waiting === false) jct.waiting = e; setTimeout(jct.suggest,jct.delay);
  }
  jct.d.gebi("funder").addEventListener("keyup", _sug);

  var _choose = function(e) { 
    jct.d.each('help', function(el) { if (el.style.display) el.parentNode.removeChild(el); });
    if (jct.d.gebi('help_'+e.target.getAttribute('id'))) jct.d.gebi('help_'+e.target.getAttribute('id')).style.display = 'block'; 
    jct.choose();
  }
  jct.d.gebi("funder").addEventListener("focus", _choose);
'''