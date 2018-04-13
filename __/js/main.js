/* Akai (pandoc HTML5 template)
 * designer:     soimort
 * last updated: 2018-04-13
 */

document.addEventListener('DOMContentLoaded', function() {

  // convert dates to human-readable format
  var options = { year: 'numeric', month: 'long', day: 'numeric' },
      date = document.getElementsByTagName('h3')[0];
  if (date)
    date.innerText = new Date(date.innerText).toLocaleDateString('en-GB', options);

});
