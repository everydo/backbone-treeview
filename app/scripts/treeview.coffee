define [
    'underscore'
    'marionette'
    'backbone'
    'nav_root_view'
    'tree_node_collection'
], (_, Marionette, Backbone, NavRootView, TreeNodeCollection) ->

    Controller = Marionette.Controller.extend

        initialize: (options) ->
            # 初始化组件
            @checkable = options.checkable
            @css = options.css
            @is_static = options.is_static
            @treeView = new NavRootView
                collection: new TreeNodeCollection()
                controller: this

            # 加载 css
            @treeView.loadCss @css
            # 初始化保存 当前勾选节点 的变量
            @checkedNode = {}
            # 初始化保存 已加载节点 的变量
            @nodeList = {}

        # 加载根节点
        load_nodes: (data) ->
            @treeView.collection.add data
            @treeView.collapse this
            if @loaded_callback
                @loaded_callback this
                @loaded_callback = null
        
        # 渲染初始化后的导航树
        render: (dom) ->
            @treeView.render()
            $(dom).html @treeView.el

        # 返回已勾选节点对象
        get_checked: ->
            @checkedNode
        
        # 返回当前激活节点的 view
        get_activated: ->
            @currentNode

        # 根据 node_id 返回对应的 view
        get_node: (node_id) ->
            @nodeList[node_id]

        _onGotNode: (node) ->
            # 迭代
            unless @node_ids.length
                @on_loaded node
            else
                that = @that
                _gotNode = _.bind that._onGotNode,
                    on_loaded: @on_loaded
                    that: that
                    node_ids: @node_ids[1..]
                
                next_node = that.get_node(@node_ids[0])
                next_node.expand _gotNode
        
        # 根据 node_ids 循环展开对应的节点
        get_node_by_path: (node_ids, on_loaded) ->
            _gotNode = _.bind @_onGotNode,
                on_loaded: on_loaded
                that: this
                node_ids: node_ids
            
            unless @treeView.collection.length
                @loaded_callback = _gotNode
            else
                _gotNode this