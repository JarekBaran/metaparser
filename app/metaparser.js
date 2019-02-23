var app = new Vue({
  el: '#metaparser',
  data: {
    languages: [
      {active: false, schema:"php-if-tags", name:"PHP / If / Tags"},
      {active: false, schema:"php-vars", name:"PHP / Vars"},
      {active: false, schema:"php-echo", name:"PHP / Echo"},
      {active: false, schema:"buffer", name:"PHP / Buffer"},
      {active: false, schema:"smarty", name:"Smarty / URI"},
      {active: false, schema:"smarty-assign", name:"Smarty / Vars"},
      {active: false, schema:"blade", name:"Laravel / Blade"},
      {active: false, schema:"twig-uri", name:"Twig / URI"},
      {active: false, schema:"twig-route", name:"Twig / Route"},
      {active: false, schema:"liquid", name:"Liquid"},
      {active: false, schema:"asp", name:"ASP / Tags"},
      {active: false, schema:"asp-vars", name:"ASP / Vars"},
      {active: false, schema:"stripe", name:"Silver Stripe"},
      {active: false, schema:"rubyonrails", name:"Ruby / Rails"},
      {active: false, schema:"django", name:"Python / Django"}
    ],
      input: 'http://example.com/\nTITLE-1\nDESCRIPTION-1\n\n/link\nTITLE-2\nDESCRIPTION-2',
      output: ''
  },
  filters: {
    uri: function (url) {
      let link = document.createElement('a');
      link.href = url;
      return link.pathname.replace(/^\//, '') + link.search; 
    },
    parse: function (input) {
      let clean = input.replace(/[\n]+/g, '\n').replace(/^\s+|\s+$/gm,'').split("\n").filter(Boolean);  
      return clean.chunk(3);
    }
  },
  methods: {
    show: function(active){
      this.view = active;
      this.output = this.$options.filters.parse(this.input);
      for(let toogle in this.languages){
        if(active == this.languages[toogle].schema){
          this.languages[toogle].active = true;
        } else {
          this.languages[toogle].active = false;
        }
      }  
    }
  },
  components: {
    'php-if-tags': {
      props: ['index','last','uri','title','desc'],
      template: '<p><span v-show="!index">&#x3C;?php $reqUri = $_SERVER[\'REQUEST_URI\']; ?&#x3E;<br><br></span>&#x3C;?php <span v-if="index">\} else</span>if ($reqUri == \'\/{{ uri }}\') \{ ?&#x3E;<br>&nbsp;&nbsp;&#x3C;title&#x3E;{{ title }}&#x3C;/title&#x3E;<br>&nbsp;&nbsp;&#x3C;meta name=\'description\' content=\'{{ desc }}\' /&#x3E;<br><span v-show="last.true">&#x3C;?php \} ?&#x3E;<br><br><div class="alert alert-danger">&#x3C;?php else \{ ?&#x3E;<br>&nbsp;&nbsp;&#x3C;title&#x3E;defaultTitle&#x3C;/title&#x3E;<br>&nbsp;&nbsp;&#x3C;meta name=\'description\' content=\'defaultDescription\' /&#x3E;<br>&#x3C;?php \} ?&#x3E;<br></span></p>'
    },
    'php-vars': {
      props: ['index','last','uri','title','desc'],
      template: '<p><span v-if="index">else</span>if($_SERVER[\'REQUEST_URI\']==\'\/{{ uri }}\') {<br> &nbsp; $newTitle=\'{{ title }}\';<br> &nbsp; $newDescription=\'{{ desc }}\';<br>\}<span v-show="last.true"><br><br><div class="alert alert-danger">if(isset($newTitle)) {<br> &nbsp; &nbsp; echo \'&#x3C;title&#x3E;\'.$newTitle.\'&#x3C;/title&#x3E;\';<br>}<br><br>if(isset($newDescription)) {<br> &nbsp; &nbsp; echo \'&#x3C;meta name=\\\'description\\\' content=\\\'\'.$newDescription.\'\\\'&#x3E;\';<br>}</span></div></p>'
    },
    'php-echo': {
      props: ['index','last','uri','title','desc'],
      template: '<p><span v-if="index">else</span>if($_SERVER[\'REQUEST_URI\']==\'\/{{ uri }}\') \{<br> &nbsp; echo \'&#x3C;title&#x3E;{{ title }}&#x3C;/title&#x3E;\';<br> &nbsp; echo \'&#x3C;meta name=\\\'description\\\' content=\\\'{{ desc }}\\\'&#x3E;\';<br>\}</p>'
    },
    'smarty': {
      props: ['index','last','uri','title','desc'],
      template: '<p>\{<span v-show="index">else</span>if $smarty.server.REQUEST_URI eq \'\/{{ uri }}\'\}<br>&#x3C;title&#x3E;{{ title }}&#x3C;/title&#x3E;<br>&#x3C;meta name=\'description\' content=\'{{ desc }}\'&#x3E;<br><span v-show="last.true">\{\/if\}</span></p>'
    },
    'smarty-assign': {
      props: ['index','last','uri','title','desc'],
      template: '<p>\{<span v-show="index">else</span>if $smarty.server.REQUEST_URI eq \'\/{{ uri }}\'\}<br> &nbsp; &nbsp; \{assign var=newTitle value=\'{{ title }}\'\}<br> &nbsp; &nbsp; \{assign var=newDescription value=\'{{ desc }}\'\}<br><span v-show="last.true">\{\/if\}<br><br><div class="alert alert-danger">\{if $newTitle\}<br> &nbsp; &nbsp; &#x3C;title&#x3E;\{$newTitle\}&#x3C;/title&#x3E;<br>\{\/if\}<br><br>\{if $newDescription\}<br> &nbsp; &nbsp; &#x3C;meta name=\'description\' content=\'\{$newDescription\}\'&#x3E;<br>\{\/if\}</span></div></span></p>'
    },
    'blade': {
      props: ['index','last','uri','title','desc'],
      template: '<p>@<span v-show="index">else</span>if (Request::path() === \'{{ uri }}\')<br>&#x3C;title&#x3E;{{ title }}&#x3C;/title&#x3E;<br>&#x3C;meta name=\'description\' content=\'{{ desc }}\'&#x3E;<br><span v-show="last.true">@endif</span></p>'
    },
    'twig-uri': {
      props: ['index','last','uri','title','desc'],
      template: '<p>\{% <span v-if="index">else</span>if app.request.requestUri == \'\/{{ uri }}\' %\}<br>&#x3C;title&#x3E;{{ title }}&#x3C;/title&#x3E;<br>&#x3C;meta name=\'description\' content=\'{{ desc }}\'&#x3E;<br><span v-show="last.true">\{% endif %\}</span></p>'
    },
    'twig-route': {
      props: ['index','last','uri','title','desc'],
      template: '<p>\{% <span v-if="index">else</span>if app.request.get(\'_route\') == \'\/{{ uri }}\' %\}<br>&#x3C;title&#x3E;{{ title }}&#x3C;/title&#x3E;<br>&#x3C;meta name=\'description\' content=\'{{ desc }}\'&#x3E;<br><span v-show="last.true">\{% endif %\}</span></p>'
    },
    'liquid': {
      props: ['index','last','uri','title','desc'],
      template: '<p>\{% <span v-if="index">else</span>if page.Url == \'\/{{ uri }}\') %\}<br>&#x3C;title&#x3E;{{ title }}&#x3C;/title&#x3E;<br>&#x3C;meta name=\'description\' content=\'{{ desc }}\'&#x3E;<br><span v-show="last.true">\{% endif %\}</span></p>'
    },
    'asp': {
      props: ['index','last','uri','title','desc'],
      template: '<p>&#x3C;% <span v-if="index">else</span>if(Request = "\/{{ uri }}") then %&#x3E;<br>&#x3C;title&#x3E;{{ title }}&#x3C;/title&#x3E;<br>&#x3C;meta name=\'description\' content=\'{{ desc }}\'&#x3E;<br><span v-show="last.true">&#x3C;% end if %&#x3E;</span></p>'
    },
    'asp-vars': {
      props: ['index','last','uri','title','desc'],
      template: '<p><span v-if="index">else</span>if(Request = "\/{{ uri }}") then<br> &nbsp; newTitle = "{{ title }}"<br> &nbsp; newDescription = "{{ desc }}"<br><span v-show="last.true">end if<br><br><div class="alert alert-danger">Response.Write("&#x3C;title&#x3E;"+newTitle+"&#x3C;/title&#x3E;");<br>Response.Write("&#x3C;meta name=\'description\' content=\'"+newDescription+"\'&#x3E;");</span></div></p>'
    },
    'stripe': {
      props: ['index','last','uri','title','desc'],
      template: '<p>&#x3C;% <span v-if="index">else_</span>if $getRequestURI == "\/{{ uri }}" %&#x3E;<br>&#x3C;title&#x3E;{{ title }}&#x3C;/title&#x3E;<br>&#x3C;meta name=\'description\' content=\'{{ desc }}\'&#x3E;<br><span v-show="last.true">&#x3C;% end_if %&#x3E;<br><br><div class="alert alert-danger">A function for a controller that returns a URI:<br>---<br>public function getRequestURI() {<br> &nbsp; return $_SERVER[\'REQUEST_URI\'];<br>}</div></span></p>'
    },
    'rubyonrails': {
      props: ['index','last','uri','title','desc'],
      template: '<p>&#x3C;% <span v-if="index">els</span>if current_page?(\'\/{{ uri }}\') %&#x3E;<br>&#x3C;title&#x3E;{{ title }}&#x3C;/title&#x3E;<br>&#x3C;meta name=\'description\' content=\'{{ desc }}\'&#x3E;<br><span v-show="last.true">&#x3C;% end %&#x3E;</span></p>'
    },
    'django': {
      props: ['index','last','uri','title','desc'],
      template: '<p>\{% <span v-if="index">el</span>if request.get_full_path == \'\/{{ uri }}\' %\}<br>&#x3C;title&#x3E;{{ title }}&#x3C;/title&#x3E;<br>&#x3C;meta name=\'description\' content=\'{{ desc }}\'&#x3E;<br><span v-show="last.true">\{% endif %\}</span></p>'
    },
    'buffer': {
      props: ['index','last','uri','title','desc'],
      template: '<p><span v-if="index">else</span>if($_SERVER[\'REQUEST_URI\']==\'\/{{ uri }}\') {<br> &nbsp; $newTitle=\'{{ title }}\';<br> &nbsp; $newDescription=\'{{ desc }}\';<br>\}<span v-show="last.true"><br><br><div class="alert alert-danger">function callback($buffer) {<br> &nbsp; if(isset($newTitle)) {<br> &nbsp; &nbsp; $buffer=preg_replace(\'/&#x3C;title&#x3E;(.*)&#x3C;/title&#x3E;/i\', \'&#x3C;title&#x3E;\'.$newTitle.\'&#x3C;/title&#x3E;\', $buffer);<br> &nbsp; }<br> &nbsp; if(isset($newDescription)) {<br> &nbsp; &nbsp;  $buffer=preg_replace(\'/&#x3C;meta name="description" content="(.*)"&#x3E;/i\', \'&#x3C;meta name=\\\'description\\\' content=\\\'\'.$newDescription.\'\\\'&#x3E;\', $buffer)<br> &nbsp; }<br> &nbsp; return $buffer; <br>}<br>ob_start("callback");</div></span></p>'
    }
  }
});

Array.prototype.chunk = function(n) {
  if(!this.length) {return [];}
  return[this.slice(0,n)].concat(this.slice(n).chunk(n));
};