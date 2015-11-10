(function ($) {
	var HAS_CSS3 = (function(){
	    var thisBody = document.body || document.documentElement,
	        thisStyle = thisBody.style,
	        support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
	    return support;
	})();

	// Setup default classes
	var defaults = {
		container_selector: ".mobile-slider__items",
		item_selector: ".mobile-slider__item",
		active_class: "mobile-slider__item--active",
		before_class: "mobile-slider__item--before",
		after_class: "mobile-slider__item--after",
		prev_button_selector: ".mobile-slider__prev",
		next_button_selector: ".mobile-slider__next",
		out_left_suffix: "--out-left",
		out_right_suffix: "--out-right",
		click_action: "next",
		click_link_selector: "a"
	};

	// Initialise Slider
	var MobileSlider = function (root, opts) {
		// Check versions
		if(!$) {
			throw new Error('mobile-slider requires jQuery >= 1.7');
		}

		if(!$.fn.swipe) {
			throw new Error('mobile-slider requires jQuery.touchSwipe');
		}
		
		this.options = options = $.extend(defaults, opts);
		this.options.item_class = options.item_selector.replace('.','');
		this.options.out_left_class = options.item_class + options.out_left_suffix;
		this.options.out_right_class = options.item_class + options.out_right_suffix;

		this.$root = $(root);
		this.$container = this.$root.find(options.container_selector);
		this.$items = this.$root.find(options.item_selector);
		this.$next = this.$root.find(options.next_button_selector);
		this.$prev = this.$root.find(options.prev_button_selector);		
		
		try {
			var duration = $(this.$items[0]).css('transition-duration');
			this.options.duration = (duration.indexOf("ms")>-1) ? parseFloat(duration) : parseFloat(duration)*1000;
		} catch (err) {
			this.options.duration = 250;
		}

		this.totalItems = this.$items.length;
		this.activeItemIndex = 0

		var self = this;

		this.$items.each(function (i, item) {
			// Disable selection on drag.
			$(item).find('img, a').attr('draggable', false);

			$(item).find('a').on('click', function (event) {
				event.preventDefault();
			});
			
			if( options.click_action == "link" ) {
				$(item).on('click', function (event) {
					var href = $(item).find(options.click_link_selector).attr('href');
					if( !href ) {
						self.goToNextItem();
					} else {
						window.location = href;	
					}
				});	
			}

			if( options.click_action == "next" ) {
				$(item).on('click', function (event) {
					self.goToNextItem();
				});
			}	
		});

		this.$next.on('click', function () {
			self.goToNextItem();
		});

		this.$prev.on('click', function () {
			self.goToPrevItem();
		});
 
		this.$container.swipe({
			swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
		      	if( direction == "left" ) {
		      		self.goToPrevItem();
		      	}
		      	if( direction == "right" ) {
		      		self.goToNextItem();
		      	}
		    },
		    allowPageScroll: "auto"
		});

		this.update();
	};

	MobileSlider.prototype.goToNextItem = function () {
		var activeIndex = this.activeItemIndex;
		this.activeItemIndex = activeIndex == (this.totalItems-1) ? 0 : activeIndex+1;
		this.update();
		this.$afterItem.addClass(options.out_right_class);
	};

	MobileSlider.prototype.goToPrevItem = function () {
		var activeIndex = this.activeItemIndex;
		this.activeItemIndex = activeIndex == 0 ? (this.totalItems-1) : activeIndex-1;
		this.update();
		this.$beforeItem.addClass(options.out_left_class);
	};

	MobileSlider.prototype.update = function () {
		var self = this, options = this.options;
		
		if( this.finishTimer && this.finishTransition ) {
			clearTimeout(this.finishTimer);
			this.finishTransition();
		}

		this.$otherItems = [];
		this.$items.each(function (i, item) {
			var activeIndex = self.activeItemIndex,
				nextIndex = activeIndex == (self.totalItems-1) ? 0 : activeIndex+1,
				next2Index = activeIndex == (self.totalItems-2) ? 0 : activeIndex == (self.totalItems-1) ? 1 : activeIndex+2;
				prevIndex = activeIndex == 0 ? self.totalItems-1 : activeIndex-1,

			$(item)
				.removeClass([
					options.active_class,
					options.after_class,
					options.before_class,
					options.before_class + "-2"
				].join(" "));

			switch(i) {
				case activeIndex:
					self.$activeItem = $(item);
					break;
				case nextIndex:
					self.$beforeItem = $(item);
					break;
				case prevIndex:
					self.$afterItem = $(item);
					break;
				case next2Index:
					self.$before2Item = $(item);
					break;
				default:
					self.$otherItems.push($(item));
					break;
			}
		});

		this.$activeItem
			.addClass(options.active_class);
		this.$afterItem
			.addClass(options.after_class);
		this.$beforeItem
			.addClass(options.before_class);
		this.$before2Item
			.addClass(options.before_class + "-2");
			
		this.finishTransition = function () {
			var classes = [options.out_left_class, options.out_right_class].join(' ');
			self.$items.removeClass(classes);
			self.finishTransition = null;
		};

		this.finishTimer = setTimeout(self.finishTransition, options.duration);
	};

	window.MobileSlider = MobileSlider;
})(jQuery);