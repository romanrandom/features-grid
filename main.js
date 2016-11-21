var options = {
	boxHeight: 200,
	border: 20,
	columns: 4,
	grow: 2,
	animationTime: 200,
	breakpoints: [
		{
			minWidth: 1900,
			columns: 5
		},
		{
			maxWidth: 800,
			columns: 2
		}
	]
};

var lastState = {
	title: {}
};

$(function() {

	$('.rr-features').growGrid(options, function($this) {

		// mouseenter
		var $shader = $this.children();
		var $title = $shader.children();
		lastState.title.top = $title.css('top');
		lastState.title.height = $title.css('height');
		lastState.title['padding-top'] = $title.css('padding-top');
		lastState.title['font-size'] = $title.css('font-size');
		$title.stop().animate({
			top: 0,
			height: 30,
			'padding-top': 8,
			'font-size': 20
		}, options.animationTime);


	}, function($this) {

		// mouseleave
		$this.children().children().stop().animate(lastState.title, options.animationTime);

	});

});


$.fn.growGrid = function(options, expandCallback, shrinkCallback) {
	// TODO
	// Mobile interactions
	// Breakpoints
	// Adjust width with scrollbar active
	// Possibility to use clicks instead of hovers, set a button for closing or use whole element

	var settings = $.extend({
		boxHeight: 200,
		border: 20,
		columns: 4,
		grow: 2,
		animationTime: 200
  }, options );

	var boxHeight = settings.boxHeight;
	var border = settings.border;
	var columns = settings.columns;
	var grow = settings.grow;
	var animationTime = settings.animationTime;
	var zeta = 0;
	var animationProperties;

	var $container = this;
	var $items = $container.children();

	var numItems = $items.length;

	var rows = Math.ceil(numItems / columns);

	var featureWidth 		= (innerWidth / columns) - border - (border / columns);
	var featureHeight 	= boxHeight - border;
	var expandedWidth 	= (featureWidth + border) * grow - border;
	var expandedHeight 	= (featureHeight + border) * grow - border;
	var expandedLeft = innerWidth - expandedWidth - border;

	var containerHeight = featureHeight * rows + border * (rows + 1);
	var containerWidth = $('body').width();

	var lastNormalRow = rows - Math.round(grow);

	$container.css({
		width: containerWidth,
		height: containerHeight
	});

	var rightEdge = [];

	for (var i = 0; i < numItems; i++) {
		if ((i + 1) % columns === 0) {
			rightEdge.push(i);
			if (grow > 2) {
				for (var j = 1; j <= Math.round(grow) - 2; j++) {
					rightEdge.push(i - j);
				}
			}
		}
	}

	$items.css({
		width: featureWidth,
		height: featureHeight
	});

	for (i = 0; i < $items.length; i++) {
		$($items[i]).css({
			left: ((i % columns) * (innerWidth - border) / columns) + border,
			top: (Math.floor(i / columns) * boxHeight) + border
		});
	}


	$items.on('mouseenter', function() {
		// Keep last hovered element on top of others
		zeta += 10;
		var $this = $(this);
		var index = $this.index();
		var row = Math.floor(index / columns);

		$this.css('z-index', zeta);

		animationProperties = {
			width: expandedWidth,
			height: expandedHeight
		};

		if ($.inArray(index, rightEdge) !== -1) {
			animationProperties.left = expandedLeft;
		}

		if (row > lastNormalRow) {
			animationProperties.top = containerHeight - (featureHeight + border) * grow;
		}

		$this.stop().animate(animationProperties, animationTime);
		expandCallback($this);
	});

	$items.on('mouseleave', function() {
		var $this = $(this);
		var index = $this.index();
		var row = Math.floor(index / columns);

		animationProperties = {
			width: featureWidth,
			height: featureHeight,
			top: featureHeight * row + border * (row + 1)
		};

		if ($.inArray(index, rightEdge) !== -1) {
			animationProperties.left = (featureWidth + border) * (index % columns) + border;
		}

		$this.stop().animate(animationProperties, animationTime);
		shrinkCallback($this);
	});
}
