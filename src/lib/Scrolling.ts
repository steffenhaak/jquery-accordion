import {JQueryModuleBase} from "jquery-base";
import {AccordionScrollingOptions} from "../interfaces/ScrollingOptions";
import EventHelper from 'jquery-events';

export default class Scrolling extends JQueryModuleBase {

	constructor(protected $element: JQuery,
				protected options: AccordionScrollingOptions) {
		super();
	}

	init(): void {

		this.$element.children().on('before.close.panel.accordion', (e, $param) => {
			e.preventDefault();
			if ($param) {
				this.calcScroll($param);
			}
		});
	}

	protected calcScroll($activePanel: JQuery): void {
		let scrollTopPosition: number;
		let openedContentHeight: number = 0;
		let elementsBeforeHeight: number = 0;

		if ($activePanel.prevAll('.accordion__panel--open').length > 0) {

			$activePanel.prevUntil('.accordion__panel--open').each((index, elem) => {
				elementsBeforeHeight = elementsBeforeHeight + $(elem).outerHeight(true);
			});

			openedContentHeight = $activePanel.prevAll('.accordion__panel--open').find('.accordion__content').outerHeight();
		}

		scrollTopPosition = this.getScrollTopPosition2($activePanel);

		if (!this.isPanelInViewport(scrollTopPosition - openedContentHeight) || !this.isElementInViewport($activePanel)) {
			this.animateScrolling(scrollTopPosition - openedContentHeight);
		}

	}

	protected getScrollTopPosition2($elem: JQuery): number {

		let topOffsetElementHeight: number = 0;
		let topOffsetAdditional: number = 0;

		if (this.options.topOffsetElement) {
			topOffsetElementHeight = $(this.options.topOffsetElement).outerHeight();
		}

		if (this.options.topOffsetAdditional) {
			topOffsetAdditional = this.options.topOffsetAdditional;
		}

		return $elem.offset().top - ( topOffsetElementHeight + topOffsetAdditional);
	}

	protected isPanelInViewport(scrollTopPosition: number): boolean {
		return $(window).scrollTop() <= scrollTopPosition;
	}

	protected isElementInViewport($elem: JQuery): boolean {
		return $elem.offset().top - $(window).scrollTop() <= $(window).height();
	}


	protected animateScrolling(scrollTo: number): void {
		EventHelper.wrapEvents(
			this.$element,
			'scroll.panel.accordion',
			() => {
				$('html, body').animate({
					scrollTop: scrollTo
				}, this.options.duration);
			}
		);
	}

	destroy(): void {
		this.$element.children().off('before.close.panel.accordion');
	}
}
