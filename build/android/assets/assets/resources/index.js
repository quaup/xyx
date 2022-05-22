System.register("chunks:///_virtual/en.ts",["cc"],(function(e){"use strict";var t;return{setters:[function(e){t=e.cclegacy}],execute:function(){t._RF.push({},"ca21aUgHudFZKJ4cz/fdIqc","en",void 0);const o=window,a=e("languages",{login:{noAccount:"No account,please create!"},sign:{"double rewards":"Sharing Award X2","day%{value}":"Day%{value}"},fight:{fightStartAdAsk:"Watch ads to get bonuses?",fightOverAdAsk:"watch ads to get 5 extra steps?",highest:"highest: ",propExceedMaxTimes:"Reach the limit. No more effects for this round.",propNoEnough:"The props have been used up!",needCollect:"You still need to collect"},lottery:{lotteryNotEnoughGetLotteries:"No enough tickets! Click the button below to get more tickets.",noChargePleaseWait:"Coming soon",waitForLoadingAds:"Ads loading...","still%{value}winLottery":"<color=#ffffff>还有<color=#7dd5ff>%{value}</color>次获得奖券的机会</color>"},pve:{cannotSkipLastLevel:"Please finish the previous checkpoints first!",highest:"Highest",unLockProp:"Congratulations on unlocking the prop."},task:{notExist:"Task not existed",succeed:"Task completed",fail:"Task not completed"},prop:{prop:"Get props",lackGold:"lack of gold",hammer:"hammer",magic:"magic",refresh:"refresh",infinite:"infinite",get:"obtain %{name} x%{num}"},table_prop:{"锤子":"Hammer","魔法棒":"Magic","刷新":"Refresh","无限":"infinite","消除选择的1个蛋糕，每局限用3个":"Remove the selected cake. 3 times each game.","赋予选择的1个蛋糕直线特效，每局限用1个":"Give the cake a straight line effect. 1 times each game.","重新排列游戏区内所有蛋糕，每局限用3次":"Refresh. 3 times each game.","使用后本关不再限制游戏步数,每局限用1个":"The steps will be infinite, 1 times each game."},rank:{shareTitle:"Cake Crush"},onlineReward:{receive:"Receive it"},shop:{receive:"Receive it"}});o.languages||(o.languages={}),o.languages.en=a,t._RF.pop()}}}));

System.register("chunks:///_virtual/zh.ts",["cc"],(function(e){"use strict";var t;return{setters:[function(e){t=e.cclegacy}],execute:function(){t._RF.push({},"f5034jWLxVDm6kdhgPzlihH","zh",void 0);const o=window,a=e("languages",{login:{noAccount:"没有账户,请创建"},sign:{"double rewards":"分享奖励数量X2","day%{value}":" 第%{value}天"},fight:{fightStartAdAsk:"观看广告可获得2个随机效果，是否观看？",fightOverAdAsk:"步数不足!观看广告可额外获得5步，是否观看？",highest:"最高分: ",propExceedMaxTimes:"该道具已经超过本局最大可用次数",propNoEnough:"该道具已用完，快去购买吧!",needCollect:"你还需收集"},lottery:{lotteryNotEnoughGetLotteries:"奖券不足!点击下方按钮获得更多奖券",noChargePleaseWait:"暂未开放充值功能，敬请期待",waitForLoadingAds:"正在加载广告，请骚等","still%{value}winLottery":"<color=#ffffff>还有<color=#7dd5ff>%{value}</color>次获得奖券的机会</color>"},pve:{cannotSkipLastLevel:"不能跳过未通关的关卡",highest:"最高分",unLockProp:"恭喜解锁道具"},task:{notExist:"任务不存在",succeed:"任务领取成功",fail:"任务未完成"},prop:{prop:"道具",lackGold:"金币不足",hammer:"锤子",magic:"魔法棒",refresh:"刷新",infinite:"无限",get:"获得%{name}x%{num}"},table_prop:{"锤子":"锤子","魔法棒":"魔法棒","刷新":"刷新","无限":"无限","消除选择的1个蛋糕，每局限用3个":"消除选择的1个蛋糕，每局限用3个","赋予选择的1个蛋糕直线特效，每局限用1个":"赋予选择的1个蛋糕直线特效，每局限用1个","重新排列游戏区内所有蛋糕，每局限用3次":"重新排列游戏区内所有蛋糕，每局限用3次","使用后本关不再限制游戏步数,每局限用1个":"使用后本关不再限制游戏步数,每局限用1个"},rank:{shareTitle:"蛋糕连接"},onlineReward:{receive:"立即领取"},shop:{receive:"立即领取"}});o.languages||(o.languages={}),o.languages.zh=a,t._RF.pop()}}}));

System.register("chunks:///_virtual/resources",["./en.ts","./zh.ts"],(function(){"use strict";return{setters:[null,null],execute:function(){}}}));

(function(r) {
  r('virtual:///prerequisite-imports/resources', 'chunks:///_virtual/resources'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});