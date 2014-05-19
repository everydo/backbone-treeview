# backbone-treeview

a treeview component for backbone.marrionette

## How to use

#### 安装 `NodeJs`、`yo`、`bower`、`grunt`
安装完成运行 `grunt` 构建项目
使用 `grunt server` 进行预览

#### 安装RequireJS
在 `require.config` 的 `paths` 中指定 `treeview` 的路径

#### 通过RequireJS使用:
    require(['backbone', 'marionette', 'treeview'], function(Backbone, Marionette, TreeView) {
    ...
    }

#### css使用
组件的图标是基于font-awesome的，样式文件tree_view.css基于bootstrap

#### 初始化组件:

    tree = new TreeView({checkable: true, is_static: false})

如果 is_static 是true，表示静态树，不会动态加载触发 load 事件。

#### 直接加载数据:

    tree.load_nodes({id:'1',
                     name:'node 1',
                     icon:'folder',
                     is_folder:true,
                     data:{'type':'folder',},
                     nodes: {id:'1.1',
                             name:'node1.1',
                             is_folder:false,
                             icon:'file',
                             data:{'type':'file'}}
                   },
                   {id:'2',
                    name:'node 2',
                    icon:'folder',
                    is_folder:true,
                    data:{type:'shorcut'}
                   })

#### 可以设置加载子树事件，动态加载:

    tree.on('load', function(node){})

#### 如果点击一个节点:

    tree.on('clicknode', function(node){ })
 
#### 显示树:

    tree.render('#tree-container')

#### 得到选中项, 得到node的集合:

    tree.get_checked()

#### 得到当前激活项, 得到一个node:

    tree.get_activated()

#### 在当前已经加载的所有节点中，找到指定ID的节点:

    tree.get_node(node_id)
    tree.get_node([node_id_1, node_id_2, node_3], function (node) {
                         node.expand()
                   })

#### node是具体的某个节点对象，有如下功能:

    node.load_nodes({})  # 继续加载子节点
    node.model           # node_view绑定的model信息
    node.expand(function (node) {} ) # 展开，如果没有加载过，会自动触发加载
    node.collapse()      # 折叠
    node.activate()      # 高亮激活