import { _decorator, Component, Label, Sprite, SpriteFrame, Node } from 'cc';
import { playerData } from '../../frameworks/playerData';
import { clientEvent } from '../../frameworks/clientEvent';
import { constants } from '../../shared/constants';
import { GameLogic } from '../../frameworks/gameLogic';
import { uiManager } from '../../frameworks/uiManager';
import { resourceUtil } from '../../frameworks/resourceUtil';
import { localConfig } from '../../frameworks/localConfig';
import { LocalizedSpriteItem } from '../../../../extensions/i18n/assets/LocalizedSprite';
import * as i18n from '../../../../extensions/i18n/assets/LanguageData';

const { ccclass, property } = _decorator;

@ccclass('UnLockProp')
export class UnLockProp extends Component {
    @property
    public lbNum: Label = null!;
    @property
    public lbName: Label = null!;
    @property
    public spIcon: Sprite = null!;
    @property
    public spBtnReceive: Sprite = null!;
    @property({
        type:LocalizedSpriteItem
    })
    public sfReceive = [];
    @property({
        type:LocalizedSpriteItem
    })
    public sfAd = [];
    @property({
        type:LocalizedSpriteItem
    })
    public sfShare = [];
    @property
    public ndBtnGoStart: Node = null!;

    public _fightUI: any;
    public callback: any;
    public level: any;
    public unLoclProp: any;
    public propItem: any;
    public openRewardType: any;

    show(callback: any, fightUI: any) {
        this._fightUI = fightUI;
        this.callback = callback;
        this.level = playerData.instance.getCurrentLevelInfo().ID;
        this.unLoclProp = constants.UNLOCK_PROP_ID[this.level - 2];
        this.propItem = localConfig.instance.queryByID('prop', this.unLoclProp);
        GameLogic.instance.getOpenRewardType(constants.SHARE_FUNCTION.FIGHT, (err: any, type: any) => {
            if (!err) {
                this.openRewardType = type;
                switch (type) {
                    case constants.OPEN_REWARD_TYPE.AD:
                        this.UpdateSprite(this.spBtnReceive, this.sfAd);
                        break;
                    case constants.OPEN_REWARD_TYPE.SHARE:
                        this.UpdateSprite(this.spBtnReceive, this.sfShare);
                        break;
                    case constants.OPEN_REWARD_TYPE.NULL:
                        this.UpdateSprite(this.spBtnReceive, this.sfReceive);
                        break;
                }
            } else {
                this.close();
            }
        })
        this.ndBtnGoStart.active = false;
        this.scheduleOnce(() => {
            this.ndBtnGoStart.active = true;
        }, constants.NORMAL_SHOW_TIME);
        this.init();
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
    init() {
        this.lbNum.string = (1).toString();
        this.lbName.string = i18n.t('table_prop.' + this.propItem.name);
        resourceUtil.setPropIcon(this.propItem.icon, this.spIcon, () => { });
    }

    onBtnReceiveClick() {
        switch (this.openRewardType) {
            case constants.OPEN_REWARD_TYPE.AD:
                GameLogic.instance.showRewardAd((err: any) => {
                    if (!err) {
                        this.showUnlockProp();
                        GameLogic.instance.addProp(this.propItem.ID, 1);
                    }
                })
                break;
            case constants.OPEN_REWARD_TYPE.SHARE:
                GameLogic.instance.share(constants.SHARE_FUNCTION.FIGHT, {}, (err: any) => {
                    if (!err) {
                        this.showUnlockProp();
                        GameLogic.instance.addProp(this.propItem.ID, 1);
                    }
                })
                break;
            case constants.OPEN_REWARD_TYPE.NULL:
                this.showUnlockProp();
                GameLogic.instance.addProp(this.propItem.ID, 1);
                break;
        }
    }

    showUnlockProp() {
        this.close();
        this._fightUI.showUnlockProp(this.propItem.ID, () => {
            playerData.instance.updateUnLockInfo(this.propItem.ID);
            clientEvent.dispatchEvent('updateUnlockProp');
            this.callback();
        });
    }

    onBtnCloseClick() {
        this.close();
        this.showUnlockProp();
    }

    close() {
        uiManager.instance.hideDialog('fight/unLockProp');
    }

}