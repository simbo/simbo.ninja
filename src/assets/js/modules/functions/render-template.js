/**
 * template cache
 * @type {Object}
 */
const cache = {};

/**
 * render a html/js template
 * inspired by john resig's micro templating:
 * http://ejohn.org/blog/javascript-micro-templating/
 *
 * @param  {string} str     template string
 * @param  {object} data    template data object
 * @return {HTMLCollection} rendered template
 */
function renderTemplate(str, data) {
  const dom = document.implementation.createHTMLDocument();
  if (!cache.hasOwnProperty(str)) {
    const tpl = str
      .replace(/[\r\t\n]/g, ' ')
      .split('{%')
      .join('\t')
      .replace(/((^|%\})[^\t]*)"/g, '$1\r')
      .replace(/\t=(.*?)%\}/g, '\',$1,\'')
      .split('\t')
      .join('\');')
      .split('%}')
      .join('p.push(\'')
      .split('\r')
      .join('"');
    cache[str] = new Function('obj', // eslint-disable-line no-new-func
      `var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('${tpl}');}return p.join("");`
    );
  }
  data = typeof data === 'object' ? data : {};
  dom.body.innerHTML = cache[str](data);
  return dom.body.children.length > 1 ?
    dom.body.children : dom.body.children[0];
}

module.exports = renderTemplate;
