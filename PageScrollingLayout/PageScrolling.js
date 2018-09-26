(function ($) {
    var _window = $(window);
    var _pageScrolling = $(".page-scrolling-layout");
    var _outerContainer = _pageScrolling.find("> .outer-container-wrap > .outer-container");
    var _header = _outerContainer.find("> header");
    var _innerContainer = _outerContainer.find("> .inner-container-wrap > .inner-container");
    var _content = _innerContainer.find("> .content-wrap > .content");
    var _pages = _content.find("> .page");
    var _footer = _innerContainer.find("> footer");
    var _isPageScrollingActive = false;
    var _currentPageIndex = 0;
    var _isHeaderVisible = false;
    var _isMouseOverHeader = false;
    var _isFooterVisible = false;
    var _isMouseOverFooter = false;
    var _mouseWheelTimer = 0;

    _window.on("resize", windowResize);
    windowResize();

    $(function () {
        var index = getPageIndexFromHash();
        if (index > 0) {
            setCurrentPage(index);
        }
        setTimeout(function () {
            _content.addClass("animated");
        }, 0);
    });

    //---------------
    //Event Handling
    //---------------

    function windowResize() {
        var hasPageScrollingSize = Modernizr.mq("only screen and (min-width : 480px)");
        if (hasPageScrollingSize && !_isPageScrollingActive) {
            _window.on("mousewheel DOMMouseScroll", windowMouseWheel);
            _header.on("mouseenter", headerMouseEnter);
            _header.on("mouseout", headerMouseOut);
            _footer.on("mouseenter", footerMouseEnter);
            _footer.on("mouseout", footerMouseOut);
            _isPageScrollingActive = true;
        } else if (!hasPageScrollingSize && _isPageScrollingActive) {
            _window.off("mousewheel DOMMouseScroll", windowMouseWheel);
            _header.off("mouseenter", headerMouseEnter);
            _header.off("mouseout", headerMouseOut);
            _footer.off("mouseenter", footerMouseEnter);
            _footer.off("mouseout", footerMouseOut);
            _isPageScrollingActive = false;
        }
    }

    function windowMouseWheel(event) {
        var mouseWheelTimer = Date.now();
        if (mouseWheelTimer - _mouseWheelTimer > 200) {
            var canScrollUp = true;
            var canScrollDown = true;

            var currentPage = $(_pages[_currentPageIndex]);
            var isPageScrollable = currentPage.hasClass("scrollable");

            if (isPageScrollable) {
                var pageScrollTop = currentPage.scrollTop();
                var pageScrollHeight = currentPage[0].scrollHeight - currentPage.height();
                canScrollUp = pageScrollTop == 0 || _isMouseOverFooter;
                canScrollDown = pageScrollTop == pageScrollHeight || _isMouseOverHeader;
            }

            var delta = event.originalEvent.wheelDelta || event.originalEvent.detail;
            if (delta > 0 && canScrollUp) {
                scrollUp();
            }
            else if (delta < 0 && canScrollDown) {
                scrollDown();
            }
        }
        _mouseWheelTimer = mouseWheelTimer;
    }

    function headerMouseEnter() {
        _isMouseOverHeader = true;
    }

    function headerMouseOut() {
        _isMouseOverHeader = false;
    }

    function footerMouseEnter() {
        _isMouseOverFooter = true;
    }

    function footerMouseOut() {
        _isMouseOverFooter = false;
    }

    //----------------
    //Private Methods
    //----------------

    function showHeader() {
        if (_header.length) {
            _outerContainer.addClass("show-header");
            _isHeaderVisible = true;
        }
    }

    function hideHeader() {
        if (_header.length) {
            _outerContainer.removeClass("show-header");
            _isHeaderVisible = false;
        }
    }

    function showFooter() {
        if (_footer.length) {
            _innerContainer.addClass("show-footer");
            _isFooterVisible = true;
        }
    }

    function hideFooter() {
        if (_footer.length) {
            _innerContainer.removeClass("show-footer");
            _isFooterVisible = false;
        }
    }

    function getCurrentPage() {
        return _currentPageIndex;
    }

    function setCurrentPage(index) {
        _currentPageIndex = index;
        _content.css({ top: index * -100 + "%" });
        setHashFromPageIndex(index);
        if (window.pageScrollingLayoutAPI.pageChangedCallback) {
            window.pageScrollingLayoutAPI.pageChangedCallback(index);
        }
    }

    function setPrevPage() {
        if (_currentPageIndex > 0) {
            setCurrentPage(_currentPageIndex - 1);
        }
    }

    function setNextPage() {
        if (_currentPageIndex < _pages.length - 1) {
            setCurrentPage(_currentPageIndex + 1);
        }
    }

    function scrollUp() {
        if (!_isFooterVisible) {
            if (_currentPageIndex > 0) {
                setPrevPage();
            } else {
                showHeader();
            }
        } else {
            hideFooter();
        }
    }

    function scrollDown() {
        if (!_isHeaderVisible) {
            if (_currentPageIndex < _pages.length - 1) {
                setNextPage();
            } else {
                showFooter();
            }
        } else {
            hideHeader();
        }
    }

    function getPageIndexFromHash() {
        var hash = document.location.hash;
        if (hash != "") {
            return parseInt(hash.replace("#page", "")) - 1;
        } else {
            return 0;
        }
    }

    function setHashFromPageIndex(index) {
        document.location.hash = "page" + (index + 1);
    }

    //-----------
    //Public API
    //-----------

    window.pageScrollingLayoutAPI = {
        showHeader: showHeader,
        hideHeader: hideHeader,
        showFooter: showFooter,
        hideFooter: hideFooter,
        getCurrentPage: getCurrentPage,
        setCurrentPage: setCurrentPage,
        setPrevPage: setPrevPage,
        setNextPage: setNextPage,
        scrollUp: scrollUp,
        scrollDown: scrollDown,
        pageChangedCallback: null
    };
})(jQuery);
