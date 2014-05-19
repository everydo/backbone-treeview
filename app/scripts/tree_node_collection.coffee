define [
    'underscore'
    'backbone'
    'tree_node_model'
], (_, Backbone, TreeNode) ->

    Backbone.Collection.extend model: TreeNode