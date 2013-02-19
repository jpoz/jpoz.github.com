var PageContent = new Class({

  initialize: function(el) {
    this.element = el;
    this.element.addEvent('click', this.click.bind(this));
    this.element.addEvent('touch', this.click.bind(this));
  },

  click: function() {
    $('body').removeClass('show_nav');
  }

})

var NavButton = new Class({

  initialize: function(el) {
    this.element = el;
    console.log(el);
    this.element.addEvent('click', this.click.bind(this));
    this.element.addEvent('touch', this.click.bind(this));
  },

  click: function(e) {
    e.preventDefault();
    e.stopPropagation();
    $('body').toggleClass('show_nav');
  }

});

var TextFader = new Class({
  initialize: function(el) {
    this.element = el
    this.show();
  },

  show: function() {
    this.orig = this.element.get('text');
    var sentences = this.orig.split('').map(function(sentence) {
      var s = new Element('span', {'html':sentence + ""});
      s.set('tween', {duration: 'long'});
      return s;
    });
    this.element.set('html', "");
    this.element.adopt(sentences);

    sentences.each(function(sentence, index) {
      setTimeout(function() {
        var o = 0.5 - 0.001 * index;
        sentence.tween('opacity', o)
      }, index * 30);
    });
  }

})
