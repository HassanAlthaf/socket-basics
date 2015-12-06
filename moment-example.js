var moment = require('moment');
var now = moment();

console.log(now.format('MMM Do YYYY, h:mma'));

console.log(now.valueOf());

var timestamp = 1449408132771;
var timestampMoment = moment.utc(timestamp);
console.log(timestampMoment.local().format('h:mm a'));