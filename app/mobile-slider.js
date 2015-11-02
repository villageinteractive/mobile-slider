(function ($) {
	var HAS_CSS3 = (function(){
	    var thisBody = document.body || document.documentElement,
	        thisStyle = thisBody.style,
	        support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined || thisStyle.MozTransition !== undefined || thisStyle.MsTransition !== undefined || thisStyle.OTransition !== undefined;
	    return support;
	})();

	// Check versions
	if(!$) {
		throw new Error('mobile-slider requires jQuery >= 1.7');
	}

	if(!$.fn.swipe) {
		throw new Error('mobile-slider requires jQuery.touchSwipe');
	}

	// Setup default classes
	var defaults = {
		container_selector: ".mobile-slider__items",
		items_selector: ".mobile-slider__item",
		active_class: "mobile-slider__item--active",
		before_class: "mobile-slider__item--before",
		after_class: "mobile-slider__item--after",
		prev_button_selector: ".mobile-slider__prev",
		next_button_selector: ".mobile-slider__next"
	}

	// Initialise Slider
	var MobileSlider = function (root, opts) {
		this.options = options = opts || defaults;
		this.$root = $(root);
		this.$container = this.$root.find(options.container_selector);
		this.$items = this.$root.find(options.items_selector);
		this.$next = this.$root.find(options.next_button_selector);
		this.$prev = this.$root.find(options.prev_button_selector);		
		
		this.totalItems = this.$items.length;
		this.activeItemIndex = 0

		var self = this;

		this.$items.on('click', function () {
			self.goToNextItem();
		});

		this.$next.on('click', function () {
			self.goToNextItem();
		});

		this.$prev.on('click', function () {
			self.goToPrevItem();
		});

		this.$container.swipe({
			swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
		      if(direction=="left") {
		      	self.goToPrevItem();
		      } 
		      if(direction=="right") {
				self.goToNextItem();
		      }
		    }
		});

		this.update();
	};

	MobileSlider.prototype.goToNextItem = function () {
		var activeIndex = this.activeItemIndex;
		this.activeItemIndex = activeIndex == (this.totalItems-1) ? 0 : activeIndex+1;
		this.update();
		this.$afterItem.addClass('mobile-slider__item--out-right');
	};

	MobileSlider.prototype.goToPrevItem = function () {
		var activeIndex = this.activeItemIndex;
		this.activeItemIndex = activeIndex == 0 ? (this.totalItems-1) : activeIndex-1;
		this.update();
		this.$beforeItem.addClass('mobile-slider__item--out-left');
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
				.removeClass(options.active_class)
				.removeClass(options.after_class)
				.removeClass(options.before_class)
				.removeClass(options.before_class + "-2")
				.removeClass('mobile-slider__item--from-left')
				.removeClass('mobile-slider__item--from-right');

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
			self.$afterItem.removeClass('mobile-slider__item--out-right');
			self.$beforeItem.removeClass('mobile-slider__item--out-left');
			self.finishTransition = null;	
		};

		this.finishTimer = setTimeout(self.finishTransition, 300);
	};

	window.MobileSlider = MobileSlider;
})(jQuery)