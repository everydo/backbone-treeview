require [
  'backbone'
  'marionette'
  'treeview'
], (Backbone,Marionette,TreeView) ->
  App = new Marionette.Application()

  treeView = new TreeView
    checkable: true
    css: 'styles/tree_view.css'
    is_static: false

  treeView.render '#tree'

  treedata = [
    nodeName: "测试站点"
    id: "0"
    icon: "icon-home"
    is_folder: true
    nodes: [
      {
        nodeName: "总裁办"
        id: "1"
        icon: "icon-home"
        is_folder: true
        nodes: []
      }
      {
        nodeName: "财务部"
        id: "2"
        icon: "icon-home"
        is_folder: true
        nodes: []
      }
      {
        nodeName: "人力资源部"
        id: "3"
        icon: "icon-home"
        is_folder: true
        nodes: []
      }
      {
        nodeName: "客户服务部"
        id: "4"
        icon: "icon-home"
        is_folder: true
        nodes: []
      }
      {
        nodeName: "市场开发部"
        id: "5"
        icon: "icon-home"
        is_folder: true
        nodes: []
      }
      {
        nodeName: "培训管理部"
        id: "6"
        icon: "icon-home"
        is_folder: true
        nodes: []
      }
      {
        nodeName: "公关部"
        id: "7"
        icon: "icon-home"
        is_folder: true
        nodes: []
      }
      {
        nodeName: "行政部"
        id: "8"
        icon: "icon-home"
        is_folder: true
        nodes: []
      }
    ]
  ]

  treeView.load_nodes treedata

  App.start()