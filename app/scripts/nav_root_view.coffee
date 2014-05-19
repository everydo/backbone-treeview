define [
    'underscore'
    'marionette'
    'nav_node_view'
], (_, Marionette, NavNodeView) ->

    Marionette.CollectionView.extend

        initialize: (options) ->
            @controller = options.controller

        className: 'navtree'

        itemView: NavNodeView

        itemViewOptions: ->
            controller: @controller

        collapse: ->
            $(@el).find('li > ul').hide()