/**
 * Checks if a font is available to be used on a web page.
 *
 * @param {String} fontName The name of the font to check
 * @return {Boolean}
 * @license MIT
 * @copyright Sam Clarke 2013
 * @author Sam Clarke <sam@samclarke.com>
 */
(function (document) {
    var calculateWidth, monoWidth, serifWidth, sansWidth, width;
    var body          = document.body;
    var container     = document.createElement('div');
    var containerCss  = [
        'position:absolute',
        'width:auto',
        'font-size:128px',
        'left:-99999px'
    ];

    // Create a span element to contain the test text.
    // Use innerHTML instead of createElement as it's smaller
    container.innerHTML = '<span style="' + containerCss.join(' !important;') + '">' +
        Array(100).join('wi') +
    '</span>';
    container = container.firstChild;

    calculateWidth = function (fontFamily) {
        container.style.fontFamily = fontFamily;

        body.appendChild(container);
        width = container.clientWidth;
        body.removeChild(container);

        return width;
    };

    // Pre calculate the widths of monospace, serif & sans-serif
    // to improve performance.
    monoWidth  = calculateWidth('monospace');
    serifWidth = calculateWidth('serif');
    sansWidth  = calculateWidth('sans-serif');

    window.isFontAvailable = function (fontName) {
        return monoWidth !== calculateWidth(fontName + ',monospace') ||
            sansWidth !== calculateWidth(fontName + ',sans-serif') ||
            serifWidth !== calculateWidth(fontName + ',serif');
    };
})(document);
