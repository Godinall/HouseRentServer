var AV = require('avoscloud-sdk');
var _ = require('underscore');
var configs = require('../configs.json').prod;
var utils = require('../utils');
var sourceWebsites = require('../source.json').duoban;

AV.initialize(configs.APP_ID, configs.APP_KEY, configs.MASTER_KEY);
AV.setProduction(0);
AV.Cloud.useMasterKey();

var promises = [];
_.each(sourceWebsites, function(website){
  var query = new AV.Query('House');
  query.equalTo('source', website.source);
  query.addDescending('updateTime');

  var beforeTime = '05-01';
  var startPos = 0;
  var p =  query.first()
  .then(function(row) {
    if(row){
      beforeTime = row.get('updateTime').substr(5);
    }

    utils.sleep(2000);
    return utils.dealOnePage(website, 0, beforeTime);
  })
  promises.push(p);
})

AV.Promise.when(promises).then(function(){
    console.log('done')
})
