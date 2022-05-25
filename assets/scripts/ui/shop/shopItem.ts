import { _decorator, Component, Sprite, Label, Node, Animation, SpriteFrame } from 'cc';
import { LocalizedSpriteItem } from '../../../../extensions/i18n/assets/LocalizedSprite';
import { clientEvent } from '../../frameworks/clientEvent';
import { GameLogic } from '../../frameworks/gameLogic';
import { localConfig } from '../../frameworks/localConfig';
import { playerData } from '../../frameworks/playerData';
import { resourceUtil } from '../../frameworks/resourceUtil';
import { uiManager } from '../../frameworks/uiManager';
import { constants } from '../../shared/constants';
import { ButtonEx } from '../common/buttonEx';
import * as i18n from '../../../../extensions/i18n/assets/LanguageData';
const { ccclass, property } = _decorator;

@ccclass('ShopItem')
export class ShopItem extends Component {
    @property
    public spIcon: Sprite = null!;
    @property
    public lbPrise: Label = null!;
    @property
    public ndGold: Node = null!;
    @property
    public lbNum: Label = null!;
    @property
    public lbProcess: Label = null!;
    @property
    public aniLight: Animation = null!;
    @property
    public exBtnBuy: ButtonEx = null!;
    @property
    public ndNumber: Node = null!;
    @property
    public spBtnBuy: Sprite = null!;
    @property({
        type: LocalizedSpriteItem,
    })
    public sfBuy = [];
    @property({
        type: LocalizedSpriteItem,
    })
    public sfShare = [];
    @property({
        type: LocalizedSpriteItem,
    })
    public sfAd = [];
    @property({
        type: LocalizedSpriteItem,
    })
    public sfReceive = [];

    public info: any;
    public parent: any;
    public id: any;
    public price: any;
    public countPerBuy: any;
    public icon: any;
    public animState: any;
    public totalPrice: any;
    public times: any;
    public maxTimes: any;
    public rewardType: any;

    onEnable() {
        clientEvent.on('updateGold', this.refreshBtn, this);
        clientEvent.on('updateInfiniteShareTimes', this.updateInfiniteShareTimes, this);
    }

    onDisable() {
        clientEvent.off('updateGold', this.refreshBtn, this);
        clientEvent.off('updateInfiniteShareTimes', this.updateInfiniteShareTimes, this);
    }

    setInfo(info: any, parent: any) {
        this.info = info;
        this.parent = parent;
        this.id = info.ID;
        this.price = info.price;
        this.countPerBuy = info.countPerBuy;
        this.icon = info.icon;
        this.refreshUI();
        this.refreshBtn();
    }

    refreshUI() {
        this.animState = 'shopPropertyIdle';
        this.aniLight.play(this.animState);
        resourceUtil.setPropIcon(this.icon, this.spIcon, () => { });
        let propItem = localConfig.instance.queryByID('prop', this.id);
        this.totalPrice = this.countPerBuy * this.price;
        this.lbNum.string = propItem.countPerBuy;
        this.times = playerData.instance.getInfiniteTimes();
        this.maxTimes = constants.MAX_INFINITE_TIMES;
        if (this.info.ID !== constants.PROP_ID.INFINITE) {
            this.lbPrise.string = this.totalPrice;
            this.lbProcess.node.active = false;
        } else {
            GameLogic.instance.getOpenRewardType(constants.SHARE_FUNCTION.BUY_INFINITE, (err: any, type: any) => {
                if (!err) {
                    this.rewardType = type;
                    switch (type) {
                        case constants.OPEN_REWARD_TYPE.AD:
                            this.UpdateSprite(this.spBtnBuy,this.sfAd);
                            this.ndGold.active = false;
                            this.updateInfiniteShareTimes();
                            break;
                        case constants.OPEN_REWARD_TYPE.SHARE:
                            this.UpdateSprite(this.spBtnBuy,this.sfShare);
                            this.ndGold.active = false;
                            this.updateInfiniteShareTimes();
                            break;
                        case constants.OPEN_REWARD_TYPE.NULL:
                            this.UpdateSprite(this.spBtnBuy, this.sfBuy);
                            this.lbProcess.node.active = false;
                            this.lbPrise.string = this.totalPrice;
                            break;
                    }
                    this.refreshBtn();
                } else {
                }
            })
        }
    }
    UpdateSprite(sprite:Sprite, list:LocalizedSpriteItem[]){
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
            // @ts-ignore
            if (item.language === i18n._language) {
                // @ts-ignore
                sprite.spriteFrame = item.spriteFrame;
                break;
            }
        }
    }
    refreshBtn() {
        if (typeof this.rewardType === 'number' && this.rewardType !== constants.OPEN_REWARD_TYPE.NULL) {
            this.exBtnBuy.interactable = true;
        } else {
            this.exBtnBuy.interactable = playerData.instance.getGold() >= this.totalPrice;
        }
    }

    onBtnBuyClick() {
        uiManager.instance.showDialog('props/buy', [this.id, constants.ANALYTICS_TYPE.SHOP_PROP_PER_BUY]);
        this.parent.showAllItemUnSelect();
        this.showSelect();
    }

    onItemClick() {
        this.parent.showAllItemUnSelect();
        this.parent.hideRandPropSelect();
        this.showSelect();
    }

    showSelect() {
        this.animState = 'shopPropertySelect';
        this.aniLight.play(this.animState);
        this.parent.shopPropsOperationScript.show(this.id);
    }

    showUnSelect() {
        if (this.animState === 'shopPropertyIdle') return;
        this.animState = 'shopPropertyIdle';
        this.aniLight.play(this.animState);
    }

    updateInfiniteShareTimes() {
        this.spBtnBuy.node.setScale(1, 1, 1);
        if (this.id === constants.PROP_ID.INFINITE) {
            this.UpdateSprite(this.spBtnBuy, this.sfReceive);
            this.spBtnBuy.node.setScale(1.3, 1.3, 1.3);
        }
    }

}