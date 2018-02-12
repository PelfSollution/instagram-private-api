var _ = require('lodash');
var util = require('util');
var FeedBase = require('./feed-base');

function UserTaggedMediaFeed(session, user_id, limit) {
    this.user_id = user_id;
    this.limit = parseInt(limit) || null;
    FeedBase.apply(this, arguments);
}
util.inherits(UserTaggedMediaFeed, FeedBase);

module.exports = UserTaggedMediaFeed;
var Media = require('../media');
var Request = require('../request');
var Helpers = require('../../../helpers');
var Exceptions = require('../exceptions');

UserTaggedMediaFeed.prototype.get = function () {
    var that = this;
    return this.session.getAccountId()
        .then(function(id) {
            console.log(that.user_id)
            var rankToken = Helpers.buildRankToken(id);
            return new Request(that.session)
                .setMethod('GET')
                .setResource('userTagsFeed', {
                    user_id: that.user_id,
                    maxId: that.getCursor(),
                    rankToken: rankToken
                })
                .send()
                .then(function(data) {
                    that.moreAvailable = data.more_available && !!data.next_max_id;
                    if (!that.moreAvailable && !_.isEmpty(data.ranked_items) && !that.getCursor())
                        throw new Exceptions.OnlyRankedItemsError;
                    if (that.moreAvailable)
                        that.setCursor(data.next_max_id);
                    return _.map(data.items, function (medium) {
                        return new Media(that.session, medium);
                    });
                })
        });
};
