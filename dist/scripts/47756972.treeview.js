(function () {define('nav_node_view',['underscore', 'marionette'], function(_, Marionette) {
  return Marionette.CompositeView.extend({
    template: _.template("<li>\n  <{{ ((id==\"null\") ? \"div\": \"a\") }} class=\"node-a-{{ id }}\" href=\"#\">\n    <div class=\"node\">\n      <span class=\"toggle-icon fa {{ is_folder? \"fa-plus\" : \"hidden\" }}\" ></span>\n      <label class=\"{{ (checkable ? \"\" : \"hidden\") }}\">\n      <input id=\"checkbox-{{ id }}\" type=\"checkbox\" class=\"node-checkbox\">\n      </label>\n      <span class=\"{{ icon }}\"></span>{{ nodeName }}\n    </div>\n  </{{ ((id==\"null\") ? \"div\": \"a\") }}>\n  </li>"),
    tagName: 'ul',
    initialize: function(options) {
      this.collection = this.model.nodes;
      this.controller = options.controller;
      this.controller.nodeList[this.model.id] = this;
      this.on('click:toggle', this._onToggle);
      this.on('click:checkbox', this._clickCheckbox);
      return this.on('click:node', this._clickNode);
    },
    _clickCheckbox: function(node) {
      var checked, nodeName;
      nodeName = node.model.get('nodeName');
      checked = $("#checkbox-" + (node.model.get('id'))).prop('checked');
      if (checked) {
        return this.controller.checkedNode[nodeName] = node.view;
      } else {
        return delete this.controller.checkedNode[nodeName];
      }
    },
    _clickNode: function(node) {
      this.activate();
      return this.controller.trigger('clicknode', node.view);
    },
    _onToggle: function(node) {
      if (this.isExpanded()) {
        return this.collapse();
      } else {
        return this.expand();
      }
    },
    triggers: {
      'click .toggle-icon': 'click:toggle',
      'click a': 'click:node',
      'click .node-checkbox': {
        event: 'click:checkbox',
        preventDefault: false,
        stopPropagation: true
      }
    },
    load_nodes: function(data) {
      this.collection.add(data);
      if (this.on_loaded) {
        this.on_loaded(this);
        return this.on_loaded = null;
      }
    },
    serializeData: function() {
      var checkable;
      checkable = this.model.get('checkable');
      if (typeof checkable === 'undefined') {
        checkable = this.controller.checkable;
      }
      return {
        id: this.model.get('id'),
        icon: this.model.get('icon'),
        nodeName: this.model.get('nodeName'),
        is_folder: this.model.get('is_folder'),
        checkable: checkable
      };
    },
    itemViewOptions: function() {
      return {
        controller: this.controller
      };
    },
    appendHtml: function(collectionView, itemView) {
      return collectionView.$('li:first').append(itemView.el);
    },
    isExpanded: function() {
      return $(this.el).find('span').first().attr('class').indexOf('plus') <= -1;
    },
    expand: function(on_expanded) {
      if (!this.collection.length) {
        this.on_loaded = on_expanded;
        if (!this.controller.is_static && this.model.get('is_folder')) {
          this.controller.trigger('load', this, this.model);
        } else if (on_expanded) {
          on_expanded(this);
        }
      } else if (on_expanded) {
        on_expanded(this);
      }
      $(this.el).find('span').first().addClass('fa-minus').removeClass('fa-plus');
      return $(this.el).children().children().filter('ul').show('fast');
    },
    collapse: function() {
      $(this.el).find('span').first().addClass('fa-plus').removeClass('fa-minus');
      return $(this.el).children().children().filter('ul').hide('fast');
    },
    activate: function() {
      var currentActive, lastActive;
      lastActive = this.controller.currentNode;
      if (lastActive) {
        lastActive = lastActive.model.get('id');
      }
      currentActive = this.model.get('id');
      if (lastActive === currentActive) {

      } else {
        $(".navtree .node-a-" + lastActive).find('div').removeClass('node-active');
        $(this.el).find('.node').first().addClass('node-active');
        return this.controller.currentNode = this;
      }
    }
  });
});

define('nav_root_view',['underscore', 'marionette', 'nav_node_view'], function(_, Marionette, NavNodeView) {
  return Marionette.CollectionView.extend({
    initialize: function(options) {
      return this.controller = options.controller;
    },
    className: 'navtree',
    itemView: NavNodeView,
    itemViewOptions: function() {
      return {
        controller: this.controller
      };
    },
    collapse: function() {
      return $(this.el).find('li > ul').hide();
    }
  });
});

define('tree_node_model',['underscore', 'backbone'], function(_, Backbone) {
  return Backbone.Model.extend({
    initialize: function() {
      var TreeNodeCollection, nodes;
      nodes = this.get('nodes');
      if (nodes) {
        TreeNodeCollection = require('tree_node_collection');
        this.nodes = new TreeNodeCollection(nodes);
        return this.unset('nodes');
      }
    }
  });
});

define('tree_node_collection',['underscore', 'backbone', 'tree_node_model'], function(_, Backbone, TreeNode) {
  return Backbone.Collection.extend({
    model: TreeNode
  });
});

define('treeview',['underscore', 'marionette', 'backbone', 'nav_root_view', 'tree_node_collection'], function(_, Marionette, Backbone, NavRootView, TreeNodeCollection) {
  var Controller;
  return Controller = Marionette.Controller.extend({
    initialize: function(options) {
      this.checkable = options.checkable;
      this.css = options.css;
      this.is_static = options.is_static;
      this.treeView = new NavRootView({
        collection: new TreeNodeCollection(),
        controller: this
      });
      this.checkedNode = {};
      return this.nodeList = {};
    },
    load_nodes: function(data) {
      this.treeView.collection.add(data);
      this.treeView.collapse(this);
      if (this.loaded_callback) {
        this.loaded_callback(this);
        return this.loaded_callback = null;
      }
    },
    render: function(dom) {
      this.treeView.render();
      return $(dom).html(this.treeView.el);
    },
    get_checked: function() {
      return this.checkedNode;
    },
    get_activated: function() {
      return this.currentNode;
    },
    get_node: function(node_id) {
      return this.nodeList[node_id];
    },
    _onGotNode: function(node) {
      var next_node, that, _gotNode;
      if (!this.node_ids.length) {
        return this.on_loaded(node);
      } else {
        that = this.that;
        _gotNode = _.bind(that._onGotNode, {
          on_loaded: this.on_loaded,
          that: that,
          node_ids: this.node_ids.slice(1)
        });
        next_node = that.get_node(this.node_ids[0]);
        return next_node.expand(_gotNode);
      }
    },
    get_node_by_path: function(node_ids, on_loaded) {
      var _gotNode;
      _gotNode = _.bind(this._onGotNode, {
        on_loaded: on_loaded,
        that: this,
        node_ids: node_ids
      });
      if (!this.treeView.collection.length) {
        return this.loaded_callback = _gotNode;
      } else {
        return _gotNode(this);
      }
    }
  });
});

}());