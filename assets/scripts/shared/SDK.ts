/**
* @author: Blanco
* @description: SDK 管理
* @date: 2021-02-06
*/

import { sys } from "cc";
export default class SDK {

    public static showBanner() {
        console.log('showBanner');
        if (sys.platform === sys.Platform.ANDROID) {
            console.log('-------showBanner-------');
            jsb.reflection.callStaticMethod("com/sdk/TTSDK", "showBannerAd", "()V");
        }
    }

    public static hideBanner() {
        console.log('hideBanner');
        if (sys.platform === sys.Platform.ANDROID) {
            console.log('-------hideBanner-------');
            jsb.reflection.callStaticMethod("com/sdk/TTSDK", "hideBannerAd", "()V");
        }
    }

    //播放视频
    public static showRewardVideoAD(callback: Function) {
        console.log('播放激励视频');
        if (sys.platform === sys.Platform.ANDROID) {
            window.videoAdCallback = callback;
            jsb.reflection.callStaticMethod("com/sdk/TTSDK", "showRewardAd", "()V");
        } else if (sys.platform === sys.Platform.DESKTOP_BROWSER) {
            console.log('-------本地测试-------');
            callback && callback();
        }
    }

    public static showInterstitialAd(callback: Function) {
        console.log('展示插屏广告');
        if (sys.platform === sys.Platform.ANDROID) {
            window.videoAdCallback = callback;
            console.log('-------showInterstitialAd-------');
            jsb.reflection.callStaticMethod("com/sdk/TTSDK", "showInterstitialAd", "()V");
        } else if (sys.platform === sys.Platform.DESKTOP_BROWSER) {
            console.log('-------本地测试-------');
            callback && callback();
        }
    }

    public static showFloatAd(callback: Function) {
        console.log('展示浮动广告');
        if (sys.platform === sys.Platform.ANDROID) {
            window.videoAdCallback = callback;
            jsb.reflection.callStaticMethod("com/sdk/TTSDK", "showFloatAd", "()V");
        }
    }

    public static hideFloatAd() {
        console.log('隐藏浮动广告');
        if (sys.platform === sys.Platform.ANDROID) {
            jsb.reflection.callStaticMethod("com/sdk/TTSDK", "hideFloatAd", "()V");
        }
    }

    public static showNativeAd() {
        console.log('展示原生广告');
    }

    /**
     * 游戏打点
     * @param event_id 事件名称
     */
    public static onEvent(actionName:string, s1:string, s2:string) {
        if (sys.platform === sys.Platform.ANDROID) {
            jsb.reflection.callStaticMethod("com/sdk/TTSDK", "onEvent", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", actionName, s1, s2);
        }
    }
}
