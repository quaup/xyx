package com.sdk;

import android.content.Context;

import com.cocos.service.SDKWrapper;
import com.happyeliminate.yinglongyou.aha.activity.MainActivity;

public class TTSDK implements SDKWrapper.SDKInterface {
    private static TTSDK sdk;
    private Context context;
    @Override
    public void init(Context context) {
        this.context = context;
        sdk = this;
    }
    Context getContext() { return this.context; }
    private void playFloatAd() {
        ((MainActivity)this.getContext()).playFloatAd();
    }
    private void closeFloatAd() {
        ((MainActivity)this.getContext()).closeFloatAd();
    }
    private void playRewardAd() {
        ((MainActivity)this.getContext()).playRewardAd();
    }

    private void playNativeAd() {
        ((MainActivity)this.getContext()).playNativeAd();
    }

    private void playInterstitialAD() {
        ((MainActivity)this.getContext()).playInterstitialAD();
    }

    private void track(String name, String s1, String s2) {
        ((MainActivity)this.getContext()).track(name, s1, s2);
    }

    public static void showBannerAd(){}
    public static void hideBannerAd() {}
    public static void showFloatAd() {
        if(sdk!=null) sdk.playFloatAd();
    }
    public static void hideFloatAd() {
        if(sdk!=null) sdk.closeFloatAd();
    }
    public static void showRewardAd() {
        if(sdk!=null) sdk.playRewardAd();
    }
    public static void showNativeAd() {
        if(sdk!=null) sdk.playNativeAd();
    }
    public static void showInterstitialAd() {
        if(sdk!=null) sdk.playInterstitialAD();
    }
    public static void onEvent(String name, String s1, String s2) {
        if(sdk != null) {
            sdk.track(name, s1, s2);
        }
    }
}
